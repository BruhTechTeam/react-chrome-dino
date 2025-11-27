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
    const runner = window.runner;

    if (runner) {
      // Stop animation frame
      if (runner.stop) {
        runner.stop();
      }

      // Remove event listeners (call the existing stopListening method)
      if (runner.stopListening) {
        runner.stopListening();
      }

      // Clear resize timer if running
      if (runner.resizeTimerId_) {
        clearInterval(runner.resizeTimerId_);
        runner.resizeTimerId_ = null;
      }

      // Properly cleanup audio context
      if (runner.audioContext) {
        try {
          // Suspend first to immediately stop all audio processing
          if (runner.audioContext.state !== 'closed') {
            runner.audioContext.suspend().then(() => {
              runner.audioContext.close().catch(() => {});
            }).catch(() => {});
          }
        } catch (e) {
          // Context might already be closed or in invalid state
        }
        runner.audioContext = null;
      }

      // Clear sound buffers to prevent them from being played
      if (runner.soundFx) {
        runner.soundFx = {};
      }

      // Clear audio buffer
      runner.audioBuffer = null;

      // Remove DOM elements created by Runner
      if (runner.containerEl && runner.containerEl.parentNode) {
        runner.containerEl.parentNode.removeChild(runner.containerEl);
      }
      if (runner.touchController && runner.touchController.parentNode) {
        runner.touchController.parentNode.removeChild(runner.touchController);
      }

      // Clear the singleton instance so it can be recreated on remount
      if (window.Runner) {
        window.Runner.instance_ = null;
      }

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
