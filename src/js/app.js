'use strict';

import { LOG } from './utils';
import { Settings } from './settings';
import { GamesObserver } from './observers';
import { GamesManager } from './games';

import { VoiceFactory } from './audio';

import { makeAudioPath, AudioSequence, PlayQueue } from './audio/utils';

let voiceObj = null;

const init = () => {
  let chatElem = document.querySelector('.sidebar-tabsetBottom');
  if (chatElem !== null) {
    const manager = new GamesManager();
    manager.addListener('start', ({ gameId, whiteUsername, blackUsername }) => {
      LOG(`new game started, gameId=${gameId} whiteUsername=${whiteUsername} blackUsername=${blackUsername}`);
    });
    manager.addListener('end', ({ gameId, ...params }) => {
      if (params.draw) {
        LOG(`game ended in a draw, reason=${params.drawnBy}`);
        voiceObj.draw({ reason: params.drawnBy });
      } else {
        LOG(`game ended, winnerColor=${params.winnerColor}, winnerUsername=${params.winnerUsername} wonBy=${params.wonBy}`);
        voiceObj.win(({ winnerColor: params.winnerColor, reason: params.wonBy }));
      }
    });

    manager.addListener('move', ({ gameId, playerUsername, playerColor, san, ...params }) => {
      LOG(`${playerColor} (${playerUsername}) played ${san}`);
      voiceObj.move({ san });
    });

    manager.addListener('opening', ({ gameId, name }) => {
      LOG(`We have opening ${name}`);
    });

    const gamesObserver = new GamesObserver(chatElem);
    gamesObserver.addHandler(manager);
    gamesObserver.start();
  }
};

const loadVoiceObj = (callback) => {
  Settings.get(['volume', 'mute', 'voice'], ({ volume, mute, voice }) => {
    voiceObj = VoiceFactory({ voice, mute, volume: volume / 100 });
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
