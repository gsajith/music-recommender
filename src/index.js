import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

window.card = null;

window.handleOrientation = function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha = event.alpha.toFixed(2);
  var beta = event.beta.toFixed(2);
  var gamma = event.gamma.toFixed(2);

  var betaVector = (parseFloat(beta) + 180.0) / 360.0;
  var gammaVector = (parseFloat(gamma) + 180.0) / 360.0;

  var angle = Math.atan2(parseFloat(beta), -1 * parseFloat(gamma)) * 20;
  angle =
    Math.sqrt(Math.abs(0.5 - betaVector) + Math.abs(0.5 - gammaVector)) * 60;

  if (window.card != null) {
    window.card.style.transform =
      "rotate3d(" +
      -1 * (0.5 - parseFloat(betaVector)) +
      "," +
      (0.5 - parseFloat(gammaVector)) +
      "," +
      0 +
      ", " +
      angle +
      "deg)";
  }
}
