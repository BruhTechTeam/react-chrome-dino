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
      // FIRST: Disable the playSound function immediately to prevent any more sounds
      runner.playSound = function() {};

      // Clear sound buffers immediately
      runner.soundFx = {};
      runner.audioBuffer = null;

      // Cancel any pending animation frame
      if (runner.raqId) {
        cancelAnimationFrame(runner.raqId);
        runner.raqId = 0;
      }

      // Stop animation frame
      if (runner.stop) {
        runner.stop();
      }

      // Remove event listeners (call the existing stopListening method)
      if (runner.stopListening) {
        runner.stopListening();
      }

      // Remove window event listeners that stopListening doesn't handle
      // These are added in init() and startGame() with bound functions
      // Since we can't remove bound functions easily, we'll remove by overriding handlers
      if (runner.debounceResize) {
        window.removeEventListener('resize', runner.debounceResize);
      }
      if (runner.onVisibilityChange) {
        window.removeEventListener('visibilitychange', runner.onVisibilityChange);
        window.removeEventListener('blur', runner.onVisibilityChange);
        window.removeEventListener('focus', runner.onVisibilityChange);
      }

      // Clear resize timer if running
      if (runner.resizeTimerId_) {
        clearInterval(runner.resizeTimerId_);
        runner.resizeTimerId_ = null;
      }

      // Properly cleanup audio context
      if (runner.audioContext) {
        const audioCtx = runner.audioContext;
        try {
          // Suspend first to immediately stop all audio processing
          if (audioCtx.state !== 'closed') {
            audioCtx.suspend().then(() => {
              audioCtx.close().catch(() => {});
            }).catch(() => {});
          }
        } catch (e) {
          // Context might already be closed or in invalid state
        }
        runner.audioContext = null;
      }

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

    // Also delete the Runner constructor to ensure fresh state on remount
    delete window.Runner;

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
