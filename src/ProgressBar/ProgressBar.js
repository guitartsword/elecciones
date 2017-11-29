import React, { Component } from 'react';

class ProgressBar extends Component {
    render(){
        const title = this.props.titleBar;
        const leftPercent = this.props.leftPercent;
        const leftText = this.props.leftText;
        const rightPercent = this.props.rightPercent;
        const rightText = this.props.rightText;
        return(
            <div>
            <h2>{title}</h2>
            <div className="progress margin-s">
              <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow={leftPercent} aria-valuemin="0" aria-valuemax="100" style={{width:`${leftPercent}%`}}>
                 {leftText}
              </div>
              <div className="progress-bar progress-bar-striped progress-bar-info active" role="progressbar" aria-valuenow={rightPercent} aria-valuemin="0" aria-valuemax="100" style={{width:`${rightPercent}%`}}>
                 {rightText}
              </div>
            </div>
            </div>
        );
    }
}

export default ProgressBar;
