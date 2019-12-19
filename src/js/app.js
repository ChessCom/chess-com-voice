'use strict';

import { LOG } from './utils';
import { Settings } from './settings';
import { LiveGameObserver } from './observers';
import { GamesManager } from './games';

import { VoiceFactory } from './audio';

import { makeAudioPath, AudioSequence, PlayQueue } from './audio/utils';

let voiceObj = null;

const pingFrequency = 1; // in seconds

const init = () => {
  let chatElem = document.querySelector('.sidebar-tabsetBottom');
  if (chatElem !== null) {
    const manager = new GamesManager();
    manager.addListener('start', ({ gameId, whiteUsername, blackUsername }) => {
      LOG(`new game started, gameId=${gameId} whiteUsername=${whiteUsername} blackUsername=${blackUsername}`);
      voiceObj && voiceObj.start();
    });
    manager.addListener('end', ({ gameId, ...params }) => {
      if (params.draw) {
        LOG(`game ended in a draw, reason=${params.drawnBy}`);
        voiceObj.draw({ reason: params.drawnBy });
      } else {
        LOG(`game ended, winnerColor=${params.winnerColor}, winnerUsername=${params.winnerUsername} wonBy=${params.wonBy}`);
        voiceObj && voiceObj.win(({ winnerColor: params.winnerColor, reason: params.wonBy }));
      }
    });

    manager.addListener('move', ({ gameId, playerUsername, playerColor, san, ...params }) => {
      LOG(`${playerColor} (${playerUsername}) played ${san}`);
      voiceObj && voiceObj.move({ san });
    });

    manager.addListener('opening', ({ gameId, name }) => {
      LOG(`We have opening ${name}`);
      voiceObj && voiceObj.opening({ name });
    });

    manager.addListener('time', ({ playerColor, seconds }) => {
      LOG(`${playerColor} clock is ${seconds}s`);
      if (seconds === 30 || seconds === 15) {
        voiceObj && voiceObj.time({ playerColor, seconds });
      }
    });

    manager.addListener('idle', ({ playerColor, seconds }) => {
      LOG(`${playerColor} is idle for ${seconds}s`);
      if (seconds === 10 || (seconds > 10 && seconds % 30 === 0)) {
        voiceObj && voiceObj.idle({ playerColor, seconds });
      }
    });

    manager.addListener('drawOffered', ({ playerColor, playerUsername }) => {
      LOG(`draw offered by ${playerColor} (${playerUsername})`);
      voiceObj && voiceObj.drawOffered({ playerColor, playerUsername });
    });

    manager.addListener('drawDeclined', ({ playerColor, playerUsername }) => {
      LOG(`draw declined by ${playerColor} (${playerUsername})`);
      voiceObj && voiceObj.drawDeclined({ playerColor, playerUsername });
    });

    const liveGameObserver = new LiveGameObserver(document, pingFrequency);
    liveGameObserver.addHandler((event) => { manager.handleEvent(event)});
    liveGameObserver.start();
  }
};

const loadVoiceObj = (callback) => {
  Settings.get(['volume', 'voice'], ({ volume, voice }) => {
    voiceObj = voice === 'off' ? null : VoiceFactory({ voice, volume: volume / 100 });
    if (callback && typeof callback === 'function') {
      callback();
    }
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'settingsChanged') {
      loadVoiceObj();
    }
  }
);

const app = () => {
  loadVoiceObj(init);
};

export { app };
