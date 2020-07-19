import React from "react";
import { Link } from "react-router-dom";
import { Icon, InlineIcon } from "@iconify/react";
import closeCircleOutline from "@iconify/icons-eva/close-circle-outline";

import "./ResultPage.css";

export default class ResultPage extends React.Component {
  componentDidMount() {
    window.card = document.getElementsByClassName("result-card")[0];
  }
  
  componentWillUnmount() {
    window.card = null;
  }

  render() {
    const { results, setResultsCallback } = this.props;

    const imageStyle = {
      backgroundImage:
        'url("https://source.unsplash.com/700x1120/?' +
        results[Math.floor(Math.random() * results.length)] +
        '")'
    };

    return (
      <div>
        <div className="overlay"></div>
        <div className="result-card">
          <div style={imageStyle} className="result-card-image"></div>
          <div className="result-card-content-container">
            <div
              className="close-icon"
              onClick={() => {
                setResultsCallback([]);
              }}
            >
              <Icon className="shadow" icon={closeCircleOutline} />
            </div>
            <div className="result-card-title-container">
              <div className="result-card-title">Your algorithm</div>
              <div className="result-card-metadata">
                Created {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="result-card-item-container">
              {results.slice(0, 10).map(function(result, i) {
                return (
                  <div className="result-card-item" key={i}>
                    {result}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ul></ul>
      </div>
    );
  }
}
