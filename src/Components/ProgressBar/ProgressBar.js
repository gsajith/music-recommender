import * as React from 'react';

import "./ProgressBar.css"


export var ProgressBar =  ({width, percent}) => {

  return (
    <div>
      <div className="progress-div" style={{ width: `${width}%` }}>
        <div style={{ width: `${Math.min(percent, 97.5)}%` }} className="progress" />
      </div>
    </div>
  );
}