'use strict';

import { AudioSequence, PlayQueue, makeAudioPath } from '../utils';
import { matchSan, pieceCodeToName } from '../../utils';

const basePath = 'sounds/default/';
const extension = 'mp3';

const getDrawAudioIds = ({ reason }) => {
  return [
    'game/draw',
    'game/by',
    `game/${reason}`,
  ];
}

const getWinAudioIds = ({ winnerColor, reason }) => {
  return [
    `game/${winnerColor}`,
    'game/wins',
    'game/by',
    `game/${reason}`,
  ];
}

const getMoveAudioIds = (san) => {
  const match = matchSan(san);

  let seq = [];
  // castle, either short or long
  if (match[1]) {
    seq.push(`action/${match[1]}`);
  }

  // piece
  if (match[2]) {
    seq.push(`piece/${pieceCodeToName[match[2]]}`);
  }
  // file and rank or pawn that is moving
  if (match[3] && match[4]) {
    seq.push(`square/${match[3]}${match[4]}`);
  } else if (match[3]) {
  //TODO: sounds not existing yet
    seq.push(`file/${match[3]}`);
  } else if (match[4]) {
  //TODO: sounds not existing yet
    seq.push(`rank/${match[4]}`);
  }

  // takes
  if (match[5]) {
    seq.push('action/takes');
  }

  // full destination square, mandatory except castling moves
  if (match[6] && match[7]) {
    seq.push(`square/${match[6]}${match[7]}`);
  }

  //TODO: sounds not existing yet
  // promotion to piece
  if (match[8]) {
    seq.push(`promotion/pieceCodeToName[${match[8]}]`);
  }

  // check
  if (match[9]) {
    seq.push('action/check');
  }

  // mate
  if (match[10]) {
    seq.push('action/mate');
  }
  return seq;
}

class DefaultVoice {
  constructor(volume) {
    this.volume = volume;
    this.q = new PlayQueue();
  }

  _playIds(ids) {
    const audios = ids.map(id => makeAudioPath({ basePath, identifierPath: id, extension }));
    const seq = new AudioSequence(audios, this.volume);
    this.q.enqueue(seq);
  }

  move({ san }) {
    const ids = getMoveAudioIds(san);
    this._playIds(ids);
  }

  win({ winnerColor, reason }) {
    const ids = getWinAudioIds({ winnerColor, reason });
    this._playIds(ids);
  }

  draw({ reason }) {
    const ids = getDrawAudioIds({ reason });
    this._playIds(ids);
  }
};

export {
  DefaultVoice,
};
