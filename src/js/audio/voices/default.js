'use strict';

import { AudioSequence, PlayQueue, makeAudioPath } from '../utils';
import { matchSan, pieceCodeToName } from '../../utils';

const basePath = 'sounds/default/mp3/';
const extension = 'mp3';

const getDrawAudioIds = ({ reason }) => {
  return [
    'game_result/draw',
    'misc/by',
    `game_drew_reason/${reason}`,
  ];
}

const getWinAudioIds = ({ winnerColor, reason }) => {
  return [
    `color/${winnerColor}`,
    'game_result/wins',
    reason === 'time' ? 'misc/on' : 'misc/by',
    `game_won_reason/${reason}`,
  ];
}

const getMoveAudioIds = (san) => {
  const match = matchSan(san);

  let seq = [];

  // castle, either short or long
  if (match[1]) {
    seq.push(`full_move/${match[1]}`);
  }

  // piece
  if (match[2]) {
    seq.push(`piece/${pieceCodeToName[match[2]]}`);
  }
  // file and rank or pawn that is moving
  if (match[3] && match[4]) {
    seq.push(`square/${match[3]}${match[4]}`);
  } else if (match[3]) {
    seq.push(`file/${match[3]}`);
  } else if (match[4]) {
    seq.push(`rank/${match[4]}`);
  }

  // takes
  if (match[5]) {
    seq.push('move_modifier/takes');
  }

  // full destination square, mandatory except castling moves
  if (match[6] && match[7]) {
    seq.push(`square/${match[6]}${match[7]}`);
  }

  // promotion to piece
  if (match[8]) {
    const pieceCode = match[8].substring(1);
    const pieceName = pieceCodeToName[pieceCode];
    seq.push('move_modifier/equals');
    seq.push(`piece/${pieceName}`);
  }

  // check
  if (match[9]) {
    seq.push('move_modifier/check');
  }

  // mate
  if (match[10]) {
    seq.push('move_modifier/mate');
  }
  return seq;
}

class DefaultVoice {
  constructor({ volume, mute }) {
    this.volume = volume;
    this.mute = mute;
    this.q = new PlayQueue();
  }

  setMute(value) {
    this.mute = value;
    if (this.mute) {
      this.q.clear();
    }
  }

  setVolume(value) {
    this.volume = value;
  }

  _playIds(ids) {
    if (this.mute) {
      return;
    }
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
