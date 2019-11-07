'use strict';

import { LOG } from './utils';
import { GamesObserver } from './observers';
import { GamesManager } from './games';

// const playSound = (sound) => {
//   const path = chrome.extension.getURL(`sounds/${sound}.ogg`);
//   const audio = new Audio(path);
//   chrome.storage.sync.get(['volume', 'mute'], ({ volume, mute }) => {
//     if (!mute) {
//       audio.volume = volume / 100;
//       audio.play();
//     }
//   });
// }
//
// const playMoveSound = (san) => {
//   playSound(san+'_1');
// }
//

import { Player } from './audio/player';

alert('1');
// import mp3 from '../sounds/default/squares/a1.mp3';
// alert(mp3);
const audio = new Audio('./sounds/default/squares/a1.mp3');
audio.volume = 0.6;
audio.play();

const audio = new Audio('../sounds/default/squares/a1.mp3');
audio.volume = 0.6;
audio.play();

alert('2');

const app = () => {
  let chatElem = document.querySelector('.sidebar-tabsetBottom');
  if (chatElem !== null) {
    const manager = new GamesManager();
    manager.addListener('start', ({ gameId, whiteUsername, blackUsername }) => {
      LOG(`new game started, gameId=${gameId} whiteUsername=${whiteUsername} blackUsername=${blackUsername}`);
      //playSound('start_just');
    });
    manager.addListener('end', ({ gameId, ...params }) => {
      if (params.draw) {
        LOG(`game ended in a draw, reason=${params.drawnBy}`);
      } else {
        LOG(`game ended, winnerColor=${params.winnerColor}, winnerUsername=${params.winnerUsername} wonBy=${params.wonBy}`);
      }
    });

    manager.addListener('move', ({ gameId, playerUsername, playerColor, san, ...params }) => {
      LOG(`${playerColor} (${playerUsername}) played ${san}`);
      //playMoveSound(san);
    });

    manager.addListener('opening', ({ gameId, name }) => {
      LOG(`We have opening ${name}`);
    });


    const gamesObserver = new GamesObserver(chatElem);
    gamesObserver.addHandler(manager);
    gamesObserver.start();
  }
};

export { app };
