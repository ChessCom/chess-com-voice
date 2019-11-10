'use strict';

import { AudioSequence } from './player';

const getDrawAudio = (reason) => {
  const paths = [
    'sounds/default/game/draw.mp3',
    'sounds/default/game/by.mp3',
    `sounds/default/game/${reason}.mp3`
  ];
  return new AudioSequence(paths);
}

const getWinAudio = ({ winnerColor, reason }) => {
  const paths = [
    `sounds/default/game/${winnerColor}.mp3`,
    'sounds/default/game/wins.mp3',
    'sounds/default/game/by.mp3',
    `sounds/default/game/${reason}.mp3`
  ];
  return new AudioSequence(paths);
}

export { getDrawAudio, getWinAudio };
