import React from 'react';

import Resources from './Resources.js';
import DinoScript from './DinoScript.js';
import DinoStyle from './DinoStyle.js';

import './Dino.css';

class ChromeDinoComponent extends React.Component {
  appendDinoScript() {
    this.dinoScriptContainer = document.createElement("script");
    this.dinoScriptContainer.appendChild(document.createTextNode(DinoScript)); 
    this.startDiv.appendChild(this.dinoScriptContainer);
  }

  appendRunnerScript() {
    this.runnerScriptContainer = document.createElement("script");
    this.runnerScriptContainer.appendChild(document.createTextNode(`window.runner = new Runner('.interstitial-wrapper');`)); 

    this.endDiv.appendChild(this.runnerScriptContainer);
  }

  componentDidMount() {
    this.appendDinoScript();

    this.appendRunnerScript();
  }

  componentWillUnmount() {
    // Stop the game runner if it exists
    if (window.runner && window.runner.stop) {
      window.runner.stop();
    }
    
    // Clean up the runner instance
    if (window.runner) {
      delete window.runner;
    }

    // Remove the script elements from the DOM
    if (this.dinoScriptContainer && this.dinoScriptContainer.parentNode) {
      this.dinoScriptContainer.parentNode.removeChild(this.dinoScriptContainer);
    }
    
    if (this.runnerScriptContainer && this.runnerScriptContainer.parentNode) {
      this.runnerScriptContainer.parentNode.removeChild(this.runnerScriptContainer);
    }
  }

    render() {
        return (
          <div ref={el => (this.startDiv = el)}>
            <style>{DinoStyle}</style>
            <div id="main-frame-error" className="interstitial-wrapper">
              <Resources />
              <div ref={el => (this.endDiv = el)}>
              </div>
            </div>
          </div>
        );
    }
}

export default ChromeDinoComponent;
