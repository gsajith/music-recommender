import React from "react";
import { Link } from "react-router-dom";

import "./StartPage.css";
import InputTag from "../Components/InputTag/InputTag.js";
import { ProgressBar } from "../Components/ProgressBar/ProgressBar.js";

export default class StartPage extends React.Component {
  constructor() {
    super();
    this.state = {
      waiting: false,
      tags: ["Pop", "Billie Eilish"],
      inputVal: "",
      percent: 0,
      percentInterval: null
    };

    this.receivedCardResponse = this.receivedCardResponse.bind(this);
    this.getCardResponse = this.getCardResponse.bind(this);
    this.doCardResponseFetch = this.doCardResponseFetch.bind(this);
    this.updateTags = this.updateTags.bind(this);
    this.updateInputVal = this.updateInputVal.bind(this);
    this.startProgressTimer = this.startProgressTimer.bind(this);
    this.appendProgress = this.appendProgress.bind(this);
    this.clearProgressTimer = this.clearProgressTimer.bind(this);
  }

  receivedCardResponse(data) {
    let newResults = this.props.results.slice();
    newResults = newResults.concat(data.choices[0].text.trim().split(","));
    newResults = this.sanitizeArray(newResults);
    this.props.setResultsCallback(newResults);

    if (newResults.length < 10) {
      this.doCardResponseFetch();
    } else {
      this.clearProgressTimer();
      this.setState({ waiting: false });
    }
  }

  sanitizeArray(results) {
    // Set all to lowercase
    var mappedArray = results.map(x =>
      typeof x === "string" ? x.toLowerCase() : x
    );

    // Remove null and empty
    mappedArray = mappedArray.filter(function(e) {
      return e;
    });

    // Remove duplicates
    var reducedArray = Array.from(new Set(mappedArray));

    // Capitalize first letter of each result
    for (var i = 0; i < reducedArray.length; i++) {
      reducedArray[i] = this.stringToTitleCase(reducedArray[i]);
    }

    return reducedArray;
  }

  stringToTitleCase(str) {
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }

    return str.join(" ");
  }

  doCardResponseFetch() {
    this.setState({ waiting: true, percent: 0 }, () => {
      this.clearProgressTimer();
      this.startProgressTimer();
      document.activeElement.blur();
      fetch(
        "/api/generate-card?tags=" +
          encodeURIComponent(JSON.stringify(this.state.tags))
      )
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            console.log("ERROR");
            throw new Error(res.text());
          }
        })
        .then(data => this.receivedCardResponse(data))
        .catch(error => {
          // TODO: This logs a promise
          console.log(error);

          // TODO: Set error state
        });
    });
  }

  getCardResponse() {
    this.props.setResultsCallback([]);

    if (this.state.tags.length == 0) {
      // TODO: Set an error

      if (this.state.inputVal.length > 0) {
        this.updateTags([this.state.inputVal], function() {
          this.updateInputVal("", function() {
            // TODO: Hacky
            document.getElementsByClassName(
              "input-tag__tags__input"
            )[0].childNodes[0].value = "";
            this.doCardResponseFetch();
          });
        });
      }
    } else {
      if (this.state.inputVal.length > 0) {
        this.updateTags([...this.state.tags, this.state.inputVal], function() {
          this.updateInputVal("", function() {
            // TODO: Hacky
            document.getElementsByClassName(
              "input-tag__tags__input"
            )[0].childNodes[0].value = "";
            this.doCardResponseFetch();
          });
        });
      } else {
        this.doCardResponseFetch();
      }
    }
  }

  updateTags(newTags, callback) {
    this.setState({ tags: newTags }, callback);
  }

  updateInputVal(newVal, callback) {
    this.setState({ inputVal: newVal }, callback);
  }

  startProgressTimer() {
    this.setState({
      percent: this.state.percent + 10
    });
    let intervalId = setInterval(this.appendProgress, 1000);
    this.setState({
      percentInterval: intervalId
    });
  }

  appendProgress() {
    let valRemaining = (100 - this.state.percent) / 3;
    this.setState({
      percent: this.state.percent + valRemaining
    });
  }

  clearProgressTimer() {
    clearInterval(this.state.percentInterval);
    this.setState({
      percent: 0,
      percentInterval: null
    });
  }

  render() {
    const { waiting, tags, inputVal, percent } = this.state;

    return (
      <div>
        <div className="start-page-wrapper">
          <div className="input-tags-wrapper">
            <InputTag
              tags={tags}
              updateTagsCallback={this.updateTags}
              updateInputVal={this.updateInputVal}
            />
          </div>
          <button
            className={`generate-button ${waiting ? "disabled" : ""}`}
            type="button"
            onClick={() => {
              if (!waiting) {
                this.getCardResponse();
              }
          >
            Generate Recommendations 
          </button>

          <ProgressBar width={100} percent={percent} />
        </div>
      </div>
    );
  }
}
