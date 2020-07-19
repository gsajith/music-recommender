import React from "react";
import "./App.css";

import StartPage from "./Start/StartPage.js";
import ResultPage from "./Result/ResultPage.js";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      results: []
    };

    this.setResults = this.setResults.bind(this);
  }

  componentDidMount() {
    function handleFirstTab(e) {
      if (e.keyCode === 9) {
        // the "I am a keyboard user" key
        document.body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
      }
    }

    window.addEventListener("keydown", handleFirstTab);
  }


  setResults(newResults) {
    this.setState({
      results: newResults
    });
  }

  render() {
    const { results } = this.state;

    return (
      <div>
        <StartPage results={results} setResultsCallback={this.setResults} />

        {results.length >= 10 ? (
          <ResultPage results={results} setResultsCallback={this.setResults} />
        ) : (
          ""
        )}
        
        <div className="mhci-logo">
          <img src="https://cdn.glitch.com/d23d20c2-ff4e-46bf-9b1a-47b838e5533e%2FJoint%20logo.png?v=1595127572481"/>
        </div>
      </div>
    );
  }
}

export default App;
