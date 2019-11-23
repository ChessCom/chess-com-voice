'use strict';

import { AbstractVoice } from './abstract';
import { LOG } from '../../utils';

const shortestStringCover = ({ target, choices }) => {
  // finds the shortest sequence of strings from choices that cover target string
  // uses simple BFS to do that

  let q = [{target, parts: []}];
  let bestParts = [];
  while (q.length) {
    const { target, parts } = q.shift();
    if (target === '') {
      return parts;
      break;
    }
    for (const part of choices) {
      if (target.startsWith(part)) {
        q.push({ target: target.substr(part.length), parts: [...parts, part] });
      }
    }
  }
  return null;
};

// list generated from available files
const soundVariants = {"agreed": ["draw_offer/agreed_1", "draw_offer/agreed_2"], "drawdeclined": ["draw_offer/drawdeclined_4", "draw_offer/drawdeclined_2", "draw_offer/drawdeclined_3", "draw_offer/drawdeclined_1"], "d8": ["square/d8_4", "square/d8_1", "square/d8_2", "square/d8_3"], "blackwins": ["game_result/blackwins_1"], "d6": ["square/d6_1", "square/d6_2", "square/d6_3", "square/d6_4"], "d7": ["square/d7_2", "square/d7_3", "square/d7_1", "square/d7_4"], "d4": ["square/d4_3", "square/d4_2", "square/d4_1", "square/d4_4"], "d5": ["square/d5_1", "square/d5_3", "square/d5_2", "square/d5_4"], "d2": ["square/d2_4", "square/d2_3", "square/d2_2", "square/d2_1"], "d3": ["square/d3_4", "square/d3_1", "square/d3_3", "square/d3_2"], "d1": ["square/d1_4", "square/d1_2", "square/d1_3", "square/d1_1"], "black": ["color/black_2", "color/black_3", "color/black_1"], "4": ["rank/4_1"], "stalemate": ["game_drawn_reason/stalemate_1"], "g7": ["square/g7_4", "square/g7_3", "square/g7_2", "square/g7_1"], "g6": ["square/g6_4", "square/g6_1", "square/g6_3", "square/g6_2"], "g5": ["square/g5_4", "square/g5_1", "square/g5_2", "square/g5_3"], "g4": ["square/g4_4", "square/g4_2", "square/g4_3", "square/g4_1"], "g3": ["square/g3_1", "square/g3_2", "square/g3_3", "square/g3_4"], "g2": ["square/g2_2", "square/g2_3", "square/g2_1", "square/g2_4"], "g1": ["square/g1_3", "square/g1_2", "square/g1_1", "square/g1_4"], "O-O": ["full_move/O-O_8", "full_move/O-O_4", "full_move/O-O_5", "full_move/O-O_7", "full_move/O-O_6", "full_move/O-O_2", "full_move/O-O_3", "full_move/O-O_1"], "g8": ["square/g8_1", "square/g8_3", "square/g8_2", "square/g8_4"], "50 move-rule": ["game_drawn_reason/50moverule_1"], "whitewins": ["game_result/whitewins_1"], "drawoffered": ["draw_offer/drawoffered_1", "draw_offer/drawoffered_3", "draw_offer/drawoffered_2", "draw_offer/drawoffered_4"], "d": ["file/d_1"], "h": ["file/h_1"], "x": ["move_modifier/takes_1"], "b4": ["square/b4_1", "square/b4_2", "square/b4_3", "square/b4_4"], "b5": ["square/b5_2", "square/b5_3", "square/b5_1", "square/b5_4"], "b6": ["square/b6_3", "square/b6_2", "square/b6_1", "square/b6_4"], "b7": ["square/b7_1", "square/b7_3", "square/b7_2", "square/b7_4"], "b1": ["square/b1_4", "square/b1_1", "square/b1_3", "square/b1_2"], "b2": ["square/b2_4", "square/b2_1", "square/b2_2", "square/b2_3"], "b3": ["square/b3_4", "square/b3_2", "square/b3_3", "square/b3_1"], "b8": ["square/b8_4", "square/b8_3", "square/b8_2", "square/b8_1"], "declined": ["draw_offer/declined_3", "draw_offer/declined_2", "draw_offer/declined_1", "draw_offer/declined_4"], "#": ["move_modifier/mate_10", "move_modifier/mate_8", "move_modifier/mate_9", "move_modifier/mate_1", "move_modifier/mate_2", "move_modifier/mate_3", "move_modifier/mate_7", "move_modifier/mate_6", "move_modifier/mate_4", "move_modifier/mate_5"], "+": ["move_modifier/check_10", "move_modifier/check_9", "move_modifier/check_8", "move_modifier/check_6", "move_modifier/check_7", "move_modifier/check_5", "move_modifier/check_4", "move_modifier/check_1", "move_modifier/check_3", "move_modifier/check_2"], "3": ["rank/3_1"], "7": ["rank/7_1"], "K": ["piece/king_6", "piece/king_4", "piece/king_5", "piece/king_1", "piece/king_2", "piece/king_3"], "agreement": ["game_drawn_reason/agreement_1"], "e8": ["square/e8_4", "square/e8_3", "square/e8_2", "square/e8_1"], "e5": ["square/e5_2", "square/e5_3", "square/e5_1", "square/e5_4"], "e4": ["square/e4_1", "square/e4_2", "square/e4_3", "square/e4_4"], "e7": ["square/e7_1", "square/e7_3", "square/e7_2", "square/e7_4"], "e6": ["square/e6_3", "square/e6_2", "square/e6_1", "square/e6_4"], "e1": ["square/e1_4", "square/e1_1", "square/e1_3", "square/e1_2"], "by": ["misc/by_2", "misc/by_1"], "e3": ["square/e3_4", "square/e3_2", "square/e3_3", "square/e3_1"], "e2": ["square/e2_4", "square/e2_1", "square/e2_2", "square/e2_3"], "on": ["misc/on_2", "misc/on_1"], "c": ["file/c_1"], "g": ["file/g_1"], "checkmate": ["game_won_reason/checkmate_1"], "h8": ["square/h8_4", "square/h8_1", "square/h8_2", "square/h8_3"], "h2": ["square/h2_4", "square/h2_3", "square/h2_2", "square/h2_1"], "h3": ["square/h3_4", "square/h3_1", "square/h3_3", "square/h3_2"], "h1": ["square/h1_4", "square/h1_2", "square/h1_3", "square/h1_1"], "h6": ["square/h6_1", "square/h6_2", "square/h6_3", "square/h6_4"], "h7": ["square/h7_2", "square/h7_3", "square/h7_1", "square/h7_4"], "h4": ["square/h4_3", "square/h4_2", "square/h4_1", "square/h4_4"], "h5": ["square/h5_1", "square/h5_3", "square/h5_2", "square/h5_4"], "resignation": ["game_won_reason/resignation_3", "game_won_reason/resignation_2", "game_won_reason/resignation_1"], "pawn": ["piece/pawn_4", "piece/pawn_1", "piece/pawn_3", "piece/pawn_2"], "insufficient material": ["game_drawn_reason/insufficient_1"], "2": ["rank/2_1"], "Q": ["piece/queen_4", "piece/queen_5", "piece/queen_2", "piece/queen_3", "piece/queen_1"], "6": ["rank/6_1"], "white": ["color/white_1", "color/white_3", "color/white_2"], "B": ["piece/bishop_4", "piece/bishop_5", "piece/bishop_1", "piece/bishop_2", "piece/bishop_3"], "offered": ["draw_offer/offered_1", "draw_offer/offered_2", "draw_offer/offered_3"], "N": ["piece/knight_6", "piece/knight_4", "piece/knight_5", "piece/knight_1", "piece/knight_2", "piece/knight_3"], "c8": ["square/c8_4", "square/c8_1", "square/c8_2", "square/c8_3"], "8": ["rank/8_1"], "c3": ["square/c3_4", "square/c3_1", "square/c3_3", "square/c3_2"], "c2": ["square/c2_4", "square/c2_3", "square/c2_2", "square/c2_1"], "c1": ["square/c1_4", "square/c1_2", "square/c1_3", "square/c1_1"], "repetition": ["game_drawn_reason/repetition_1"], "c7": ["square/c7_2", "square/c7_3", "square/c7_1", "square/c7_4"], "c6": ["square/c6_1", "square/c6_2", "square/c6_3", "square/c6_4"], "c5": ["square/c5_1", "square/c5_3", "square/c5_2", "square/c5_4"], "c4": ["square/c4_3", "square/c4_2", "square/c4_1", "square/c4_4"], "b": ["file/b_1"], "f": ["file/f_1"], "f1": ["square/f1_1", "square/f1_2", "square/f1_3", "square/f1_4"], "f2": ["square/f2_1", "square/f2_3", "square/f2_2", "square/f2_4"], "f3": ["square/f3_3", "square/f3_2", "square/f3_1", "square/f3_4"], "f4": ["square/f4_4", "square/f4_1", "square/f4_3", "square/f4_2"], "f5": ["square/f5_4", "square/f5_3", "square/f5_2", "square/f5_1"], "f6": ["square/f6_4", "square/f6_2", "square/f6_3", "square/f6_1"], "f7": ["square/f7_4", "square/f7_1", "square/f7_2", "square/f7_3"], "f8": ["square/f8_2", "square/f8_3", "square/f8_1", "square/f8_4"], "1": ["rank/1_1"], "5": ["rank/5_1"], "=": ["move_modifier/equals_2", "move_modifier/equals_1"], "draw": ["game_result/draw_1", "game_result/draw_2"], "O-O-O": ["full_move/O-O-O_1", "full_move/O-O-O_3", "full_move/O-O-O_2", "full_move/O-O-O_6", "full_move/O-O-O_7", "full_move/O-O-O_5", "full_move/O-O-O_4"], "a1": ["square/a1_1", "square/a1_2", "square/a1_3", "square/a1_4"], "a3": ["square/a3_3", "square/a3_2", "square/a3_1", "square/a3_4"], "a2": ["square/a2_1", "square/a2_3", "square/a2_2", "square/a2_4"], "a5": ["square/a5_4", "square/a5_3", "square/a5_2", "square/a5_1"], "a4": ["square/a4_4", "square/a4_1", "square/a4_3", "square/a4_2"], "a7": ["square/a7_4", "square/a7_1", "square/a7_2", "square/a7_3"], "a6": ["square/a6_4", "square/a6_2", "square/a6_3", "square/a6_1"], "a8": ["square/a8_2", "square/a8_3", "square/a8_1", "square/a8_4"], "a": ["file/a_1"], "e": ["file/e_1"], "wins": ["game_result/wins_1"], "R": ["piece/rook_4", "piece/rook_5", "piece/rook_6", "piece/rook_2", "piece/rook_3", "piece/rook_1"], "time": ["game_won_reason/time_1", "game_won_reason/time_2"]};

const getRandomForId = id => soundVariants[id][Math.floor(Math.random()*soundVariants[id].length)];
const defaultBasePath = 'sounds/danny/mp3/';
const defaultExtension = 'mp3';

class DannyVoice extends AbstractVoice {

  move({ san }) {
    const parts = shortestStringCover({
      target: san,
      choices: Object.keys(soundVariants),
    });
    if (parts) {
      const ids = parts.map(id => getRandomForId(id));
      this._playIds(ids, defaultBasePath, defaultExtension);
    }
  }

  win({ winnerColor, reason }) {
    const ids = [
      getRandomForId(winnerColor),
      getRandomForId('wins'),
      getRandomForId(reason === 'time' ? 'on' : 'by'),
      getRandomForId(reason),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }

  draw({ reason }) {
    const ids = [
      getRandomForId('draw'),
      getRandomForId('by'),
      getRandomForId(reason),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }
};

export {
  DannyVoice,
};
