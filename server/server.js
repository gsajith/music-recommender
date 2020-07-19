const express = require("express");
const path = require("path");
const fs = require("fs");
const apiRequest = require("request"),
  username = "username",
  password = process.env.GPT_SECRET,
  url = "https://" + username + ":" + password + "@api.openai.com";

const app = express();
const requestedEngine = "davinci";

let serverActive = false;
let engine = null;

let basePromptReadDone = false;
let classifierPromptReadDone = false;
let basePrompt = "";
let classifierPrompt = "";

// PWAs want HTTPS!
function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps);

// A test route to make sure the server is up.
app.get("/api/ping", (request, response) => {
  console.log("❇️ Received GET request to /api/ping");
  response.send("pong!");
});

// Process list of keywords with GPT-3.
app.get("/api/generate-card", (request, response) => {
  console.log("❇️ Received GET request to /api/generate-card");
  console.log(request.query.tags);
  let tags = JSON.parse(request.query.tags).join();

  if (!serverActive || engine == null || !basePromptReadDone || !classifierPromptReadDone) {
    response.status(503).send("Engine not active! 😱");
  } else {
    let postData = {
      "prompt": basePrompt + "Input:" + tags + "\n" + "Output:",
      "max_tokens": 255,
      "temperature": 0.84,
      "stop": "\n"
    };
    var postUrl = url + "/v1/engines/" + engine +"/completions";
    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: postUrl
    };
    apiRequest(options, function(error, res, body) {
      if (error) {
        // TODO: handle error
        console.error('error posting json: ', error);
        throw error;
      }
      response.send(body);
    });
  }
});

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});

console.log("❇️ Seeing if " + requestedEngine + " OpenAI engine is active");
apiRequest(
  {
    url: url + "/v1/engines/" + requestedEngine
  },
  function(error, response, body) {
    if (error) {
      // TODO: Handle error
      console.log(error);
    } else {
      let response = JSON.parse(body);
      if (response.id == requestedEngine && response.ready == true) {
        console.log("❇️ " + requestedEngine + " engine is ready");
        serverActive = true;
        engine = requestedEngine;
      }
    }
  }
);

// Read base prompt
console.log("❇️ Reading base prompt");
fs.readFile(path.join(__dirname, '/trainingData.txt'), function(err, data) {
  if (err) {
    // TODO: Handle error
    return console.error(err);
  }
  basePrompt = data.toString();
  basePromptReadDone = true;
});


// Read classifier prompt
console.log("❇️ Reading classifier prompt");
fs.readFile(path.join(__dirname, '/genreArtistClassifier.txt'), function(err, data) {
  if (err) {
    // TODO: Handle error
    return console.error(err);
  }
  classifierPrompt = data.toString();
  classifierPromptReadDone = true;
})