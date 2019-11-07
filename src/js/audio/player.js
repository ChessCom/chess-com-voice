'use strict';

class Player {
  constructor() {
  }
  play(paths) {
    let audios = [];
    for (const path of paths) {
      const audio = new Audio(path);
      if (audios.length) {
        const prev = audios.length[audios.length-1];
        prev.addEventListener('ended', () => {
          audio.play();
        });
      }
    }
    audios[0].play();
  }
}

export { Player };

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
