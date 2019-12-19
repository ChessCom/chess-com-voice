'use strict';

import { AbstractVoice } from './abstract';
import { matchSan, pieceCodeToName, LOG } from '../../utils';

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

const defaultBasePath = 'sounds/default/mp3/';
const defaultExtension = 'mp3';

class DefaultVoice extends AbstractVoice {

  move({ san }) {
    const ids = getMoveAudioIds(san);
    this._playIds(ids, defaultBasePath, defaultExtension);
  }

  win({ winnerColor, reason }) {
    const ids = [
      `color/${winnerColor}`,
      'game_result/wins',
      reason === 'time' ? 'misc/on' : 'misc/by',
      `game_won_reason/${reason}`,
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }

  draw({ reason }) {
    const ids = [
      'game_result/draw',
      'misc/by',
      `game_drawn_reason/${reason}`,
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }
};

export {
  DefaultVoice,
};
