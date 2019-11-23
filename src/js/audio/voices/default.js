'use strict';

import { AbstractVoice } from './abstract';
import { matchSan, pieceCodeToName, LOG } from '../../utils';

const getIdleAudioIds = ({ playerColor, idleTime }) => {
  const choices = {
    white: [
      'misc_accentuating_whites_helplessness',
      'misc_how_does_white_improve',
      'misc_white_can_try_to_consolidate_position',
      'misc_whites_next_move',
    ],
    black: [
      'misc_asking_black_what_is_he_doing',
      'misc_black_just_suffering',
      'misc_black_is_struggling_in_this_position',
      'misc_why_did_black_allow_that',
    ],
  };

  const seconds = idleTime / 1000;
  // play something every 10 seconds of idle time
  const period = 10;
  if (((seconds < period) && (seconds % period < 4)) || (seconds % period < 1)) {
    const id = choices[playerColor][Math.floor(Math.random()*choices[playerColor].length)];
    return [`idle/${playerColor}/${id}`];
  }
  return null;
};

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

  idle({ idleTime, playerColor }) {
    //TODO: maybe implement something?
    // this is just for showcase
    const ids = getIdleAudioIds({ playerColor, idleTime });
    if (ids !== null) {
      this._playIds(ids, defaultBasePath, 'ogg', 0);
    }
  }
};

export {
  DefaultVoice,
};
