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
      </div>
    );
  }
}

export default App;
