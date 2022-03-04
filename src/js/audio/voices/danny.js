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
        q.push({ target: target.slice(part.length), parts: [...parts, part] });
      }
    }
  }
  return null;
};

// list generated from available files

const soundVariants = {"5": ["rank/5_1"], "Nxe4": ["full_move/Nxe4_1"], "Nxe7": ["full_move/Nxe7_1"], "R7e4": ["full_move/R7e4_1", "full_move/R7e4_2", "full_move/R7e4_3"], "Raa8": ["full_move/Raa8_2", "full_move/Raa8_3", "full_move/Raa8_1"], "Rxa4": ["full_move/Rxa4_1"], "Rxa1": ["full_move/Rxa1_1"], "d8": ["square/d8_4", "square/d8_1", "square/d8_2"], "c2": ["square/c2_4", "square/c2_2", "square/c2_1"], "d6": ["square/d6_1", "square/d6_2", "square/d6_4"], "d7": ["square/d7_2", "square/d7_1", "square/d7_4"], "d4": ["square/d4_2", "square/d4_1", "square/d4_4"], "d5": ["square/d5_1", "square/d5_2", "square/d5_4"], "d2": ["square/d2_4", "square/d2_2", "square/d2_1"], "d3": ["square/d3_4", "square/d3_1", "square/d3_2", "full_move/d3_1"], "d1": ["square/d1_4", "square/d1_2", "square/d1_1"], "Bxf1": ["full_move/Bxf1_1"], "black_wins": ["game_result/black_wins_1"], "black": ["color/black_2", "color/black_3", "color/black_1"], "4": ["rank/4_1"], "Rxg2": ["full_move/Rxg2_1"], "Qxd2": ["full_move/Qxd2_1"], "Qxd1": ["full_move/Qxd1_1"], "Qxd7": ["full_move/Qxd7_1"], "agreed": ["draw_offer/agreed_1", "draw_offer/agreed_2"], "g7": ["square/g7_4", "square/g7_2", "square/g7_1"], "g6": ["square/g6_4", "square/g6_1", "square/g6_2"], "g5": ["square/g5_4", "square/g5_1", "square/g5_2"], "g4": ["square/g4_4", "square/g4_2", "square/g4_1"], "g3": ["square/g3_1", "square/g3_2", "square/g3_4"], "g2": ["square/g2_2", "square/g2_1", "square/g2_4", "full_move/g2_1"], "g1": ["square/g1_2", "square/g1_1", "square/g1_4"], "Kxc5": ["full_move/Kxc5_1"], "Nxb2": ["full_move/Nxb2_1"], "O-O": ["full_move/O-O_8", "full_move/O-O_4", "full_move/O-O_5", "full_move/O-O_7", "full_move/O-O_6", "full_move/O-O_2", "full_move/O-O_3", "full_move/O-O_1"], "g8": ["square/g8_1", "square/g8_2", "square/g8_4"], "Rxf3": ["full_move/Rxf3_1"], "Rxf6": ["full_move/Rxf6_1"], "E60": ["opening/E60_2", "opening/E60_3", "opening/E60_1", "opening/E60_4", "opening/E60_5", "opening/E60_6"], "50 move-rule": ["game_drawn_reason/50moverule_1"], "drawoffered": ["draw_offer/drawoffered_1", "draw_offer/drawoffered_3", "draw_offer/drawoffered_2", "draw_offer/drawoffered_4"], "Bxg2": ["full_move/Bxg2_1"], "d": ["file/d_1"], "h": ["file/h_1"], "Bxg8": ["full_move/Bxg8_1"], "B23": ["opening/B23_4", "opening/B23_1", "opening/B23_3", "opening/B23_2"], "B22": ["opening/B22_5", "opening/B22_4", "opening/B22_6", "opening/B22_3", "opening/B22_2", "opening/B22_1"], "B21": ["opening/B21_4", "opening/B21_2", "opening/B21_3", "opening/B21_1"], "B20": ["opening/B20_4", "opening/B20_5", "opening/B20_1", "opening/B20_2", "opening/B20_3"], "x": ["move_modifier/takes_2", "move_modifier/takes_3", "move_modifier/takes_1"], "Kxd3": ["full_move/Kxd3_1"], "Kxd4": ["full_move/Kxd4_1"], "C50": ["opening/C50_2", "opening/C50_3", "opening/C50_1", "opening/C50_4", "opening/C50_5", "opening/C50_6"], "Kxb7": ["full_move/Kxb7_1"], "Kxb6": ["full_move/Kxb6_1"], "Kxb5": ["full_move/Kxb5_1"], "A80": ["opening/A80_1", "opening/A80_2"], "Nxc4": ["full_move/Nxc4_1"], "b4": ["square/b4_1", "square/b4_2", "square/b4_4"], "b5": ["square/b5_2", "square/b5_1", "square/b5_4"], "b6": ["square/b6_2", "square/b6_1", "square/b6_4"], "b7": ["square/b7_1", "square/b7_2", "square/b7_4"], "b1": ["square/b1_4", "square/b1_1", "square/b1_2"], "b2": ["square/b2_4", "square/b2_1", "square/b2_2"], "b3": ["square/b3_4", "square/b3_2", "square/b3_1"], "Rxg8": ["full_move/Rxg8_1"], "b8": ["square/b8_4", "square/b8_2", "square/b8_1"], "declined": ["draw_offer/declined_3", "draw_offer/declined_2", "draw_offer/declined_1", "draw_offer/declined_4"], "idle_black": ["idle/idle_black_5", "idle/idle_black_4", "idle/idle_black_1", "idle/idle_black_3", "idle/idle_black_2"], "#": ["move_modifier/mate_10", "move_modifier/mate_8", "move_modifier/mate_9", "move_modifier/mate_1", "move_modifier/mate_2", "move_modifier/mate_3", "move_modifier/mate_7", "move_modifier/mate_6", "move_modifier/mate_4", "move_modifier/mate_5"], "Qxf4": ["full_move/Qxf4_1"], "Qxf7": ["full_move/Qxf7_1"], "+": ["move_modifier/check_10", "move_modifier/check_9", "move_modifier/check_8", "move_modifier/check_6", "move_modifier/check_7", "move_modifier/check_5", "move_modifier/check_4", "move_modifier/check_1", "move_modifier/check_3", "move_modifier/check_2"], "Bxd5": ["full_move/Bxd5_2", "full_move/Bxd5_1"], "C84": ["opening/C84_1"], "C30": ["opening/C30_1", "opening/C30_3", "opening/C30_2", "opening/C30_4"], "3": ["rank/3_1"], "7": ["rank/7_1"], "C45": ["opening/C45_6", "opening/C45_4", "opening/C45_5", "opening/C45_1", "opening/C45_2", "opening/C45_3"], "K": ["piece/king_6", "piece/king_4", "piece/king_5", "piece/king_1", "piece/king_2", "piece/king_3"], "Kxa6": ["full_move/Kxa6_1"], "agreement": ["game_drawn_reason/agreement_1"], "Kxa5": ["full_move/Kxa5_1"], "B01": ["opening/B01_8", "opening/B01_9", "opening/B01_1", "opening/B01_2", "opening/B01_3", "opening/B01_7", "opening/B01_6", "opening/B01_4", "opening/B01_5"], "B00": ["opening/B00_2", "opening/B00_3", "opening/B00_1", "opening/B00_4"], "B02": ["opening/B02_1", "opening/B02_3", "opening/B02_2", "opening/B02_6", "opening/B02_7", "opening/B02_5", "opening/B02_4"], "e8": ["square/e8_4", "square/e8_2", "square/e8_1"], "B07": ["opening/B07_8", "opening/B07_7", "opening/B07_6", "opening/B07_4", "opening/B07_5", "opening/B07_1", "opening/B07_2", "opening/B07_3"], "e5": ["square/e5_2", "square/e5_1", "square/e5_4"], "e4": ["square/e4_1", "square/e4_2", "square/e4_4"], "e7": ["square/e7_1", "square/e7_2", "square/e7_4"], "e6": ["square/e6_2", "square/e6_1", "square/e6_4"], "e1": ["square/e1_4", "square/e1_1", "square/e1_2"], "by": ["misc/by_2", "misc/by_1"], "e3": ["square/e3_4", "square/e3_2", "square/e3_1"], "e2": ["square/e2_4", "square/e2_1", "square/e2_2"], "on": ["misc/on_2", "misc/on_1"], "c": ["file/c_1"], "g": ["file/g_1"], "Rxg4": ["full_move/Rxg4_1"], "Bxe4": ["full_move/Bxe4_1"], "D80": ["opening/D80_2", "opening/D80_3", "opening/D80_1", "opening/D80_4", "opening/D80_5", "opening/D80_6"], "Qxa5": ["full_move/Qxa5_1"], "Qxa7": ["full_move/Qxa7_1"], "idle_white": ["idle/idle_white_2", "idle/idle_white_3", "idle/idle_white_1", "idle/idle_white_4", "idle/idle_white_5"], "checkmate": ["game_won_reason/checkmate_1"], "h8": ["square/h8_4", "square/h8_1", "square/h8_2"], "D10": ["opening/D10_4", "opening/D10_5", "opening/D10_1", "opening/D10_2", "opening/D10_3"], "A40": ["opening/A40_4", "opening/A40_1", "opening/A40_3", "opening/A40_2"], "h2": ["square/h2_4", "square/h2_2", "square/h2_1"], "h3": ["square/h3_4", "square/h3_1", "square/h3_2"], "h1": ["square/h1_4", "square/h1_2", "square/h1_1"], "h6": ["square/h6_1", "square/h6_2", "square/h6_4"], "h7": ["square/h7_2", "square/h7_1", "square/h7_4"], "h4": ["square/h4_2", "square/h4_1", "square/h4_4", "full_move/h4_1"], "h5": ["square/h5_1", "square/h5_2", "square/h5_4"], "resignation": ["game_won_reason/resignation_3", "game_won_reason/resignation_2", "game_won_reason/resignation_1"], "Rxd6": ["full_move/Rxd6_1"], "Kxh8": ["full_move/Kxh8_1"], "B10": ["opening/B10_1", "opening/B10_3", "opening/B10_2", "opening/B10_6", "opening/B10_5", "opening/B10_4"], "low_on_time": ["low_on_time/low_on_time_2", "low_on_time/low_on_time_3", "low_on_time/low_on_time_1", "low_on_time/low_on_time_4", "low_on_time/low_on_time_5", "low_on_time/low_on_time_7", "low_on_time/low_on_time_6", "low_on_time/low_on_time_8", "low_on_time/low_on_time_9", "low_on_time/low_on_time_15", "low_on_time/low_on_time_14", "low_on_time/low_on_time_10", "low_on_time/low_on_time_11", "low_on_time/low_on_time_13", "low_on_time/low_on_time_12"], "Rxe2": ["full_move/Rxe2_1"], "Ne4": ["full_move/Ne4_1"], "Rxe7": ["full_move/Rxe7_1"], "Nxg2": ["full_move/Nxg2_1"], "pawn": ["piece/pawn_4", "piece/pawn_1", "piece/pawn_3", "piece/pawn_2"], "low_on_time_black": ["low_on_time/low_on_time_black_7", "low_on_time/low_on_time_black_6", "low_on_time/low_on_time_black_4", "low_on_time/low_on_time_black_5", "low_on_time/low_on_time_black_1", "low_on_time/low_on_time_black_2", "low_on_time/low_on_time_black_3", "low_on_time/low_on_time_black_12", "low_on_time/low_on_time_black_13", "low_on_time/low_on_time_black_11", "low_on_time/low_on_time_black_10", "low_on_time/low_on_time_black_8", "low_on_time/low_on_time_black_9"], "Nxh4": ["full_move/Nxh4_1"], "Qxh2": ["full_move/Qxh2_1"], "insufficient material": ["game_drawn_reason/insufficient_1"], "E11": ["opening/E11_1", "opening/E11_2", "opening/E11_3", "opening/E11_4", "opening/E11_5"], "2": ["rank/2_1"], "Q": ["piece/queen_4", "piece/queen_5", "piece/queen_2", "piece/queen_3", "piece/queen_1"], "6": ["rank/6_1"], "white": ["color/white_1", "color/white_3", "color/white_2"], "Bxb7": ["full_move/Bxb7_1"], "Bxb1": ["full_move/Bxb1_2", "full_move/Bxb1_1"], "Nxf4": ["full_move/Nxf4_1"], "C80": ["opening/C80_1"], "Nbd2": ["full_move/Nbd2_1", "full_move/Nbd2_2", "full_move/Nbd2_3"], "E12": ["opening/E12_1", "opening/E12_3", "opening/E12_2", "opening/E12_5", "opening/E12_4"], "E20": ["opening/E20_5", "opening/E20_4", "opening/E20_6", "opening/E20_7", "opening/E20_3", "opening/E20_2", "opening/E20_1"], "Bxh7": ["full_move/Bxh7_1"], "Nxf3": ["full_move/Nxf3_1"], "offered": ["draw_offer/offered_1", "draw_offer/offered_2", "draw_offer/offered_3"], "C60": ["opening/C60_5", "opening/C60_4", "opening/C60_3", "opening/C60_2", "opening/C60_1"], "Nxc6": ["full_move/Nxc6_1"], "c8": ["square/c8_4", "square/c8_1", "square/c8_2"], "8": ["rank/8_1"], "stalemate": ["game_drawn_reason/stalemate_1"], "c3": ["square/c3_4", "square/c3_1", "square/c3_2"], "e": ["file/e_1"], "c1": ["square/c1_4", "square/c1_2", "square/c1_1"], "repetition": ["game_drawn_reason/repetition_1"], "c7": ["square/c7_2", "square/c7_1", "square/c7_4"], "c6": ["square/c6_1", "square/c6_2", "square/c6_4"], "c5": ["square/c5_1", "square/c5_2", "square/c5_4"], "c4": ["square/c4_2", "square/c4_1", "square/c4_4", "full_move/c4_1"], "Rxg3": ["full_move/Rxg3_1"], "b": ["file/b_1"], "game_start": ["game_start/game_start_11", "game_start/game_start_10", "game_start/game_start_12", "game_start/game_start_13", "game_start/game_start_16", "game_start/game_start_14", "game_start/game_start_8", "game_start/game_start_9", "game_start/game_start_15", "game_start/game_start_4", "game_start/game_start_5", "game_start/game_start_7", "game_start/game_start_6", "game_start/game_start_2", "game_start/game_start_3", "game_start/game_start_1"], "f": ["file/f_1"], "Kxe2": ["full_move/Kxe2_1"], "Rxb7": ["full_move/Rxb7_1"], "Rxb2": ["full_move/Rxb2_1"], "idle": ["idle/idle_18", "idle/idle_8", "idle/idle_9", "idle/idle_19", "idle/idle_17", "idle/idle_7", "idle/idle_6", "idle/idle_16", "idle/idle_14", "idle/idle_4", "idle/idle_5", "idle/idle_15", "idle/idle_11", "idle/idle_1", "idle/idle_10", "idle/idle_12", "idle/idle_2", "idle/idle_3", "idle/idle_13"], "Qxc1": ["full_move/Qxc1_1"], "Nxa5": ["full_move/Nxa5_1"], "Qxc7": ["full_move/Qxc7_1", "full_move/Qxc7_2"], "Qxc4": ["full_move/Qxc4_1"], "B": ["piece/bishop_4", "piece/bishop_5", "piece/bishop_1", "piece/bishop_2", "piece/bishop_3"], "Rxg6": ["full_move/Rxg6_1"], "f1": ["square/f1_1", "square/f1_2", "square/f1_4"], "f2": ["square/f2_1", "square/f2_2", "square/f2_4"], "f3": ["square/f3_2", "square/f3_1", "square/f3_4"], "f4": ["square/f4_4", "square/f4_1", "square/f4_2"], "f5": ["square/f5_4", "square/f5_2", "square/f5_1"], "f6": ["square/f6_4", "square/f6_2", "square/f6_1"], "f7": ["square/f7_4", "square/f7_1", "square/f7_2"], "f8": ["square/f8_2", "square/f8_1", "square/f8_4"], "A56": ["opening/A56_2", "opening/A56_3", "opening/A56_1", "opening/A56_4", "opening/A56_5"], "low_on_time_white": ["low_on_time/low_on_time_white_11", "low_on_time/low_on_time_white_10", "low_on_time/low_on_time_white_12", "low_on_time/low_on_time_white_13", "low_on_time/low_on_time_white_9", "low_on_time/low_on_time_white_8", "low_on_time/low_on_time_white_3", "low_on_time/low_on_time_white_2", "low_on_time/low_on_time_white_1", "low_on_time/low_on_time_white_5", "low_on_time/low_on_time_white_4", "low_on_time/low_on_time_white_6", "low_on_time/low_on_time_white_7"], "D30": ["opening/D30_2", "opening/D30_3", "opening/D30_1", "opening/D30_4", "opening/D30_5"], "Bxh1": ["full_move/Bxh1_1"], "Kxc8": ["full_move/Kxc8_1"], "R": ["piece/rook_4", "piece/rook_5", "piece/rook_6", "piece/rook_2", "piece/rook_3", "piece/rook_1"], "A57": ["opening/A57_1", "opening/A57_2", "opening/A57_3", "opening/A57_4"], "A10": ["opening/A10_3", "opening/A10_2", "opening/A10_1", "opening/A10_5", "opening/A10_4"], "Rxc8": ["full_move/Rxc8_1"], "Rxc6": ["full_move/Rxc6_1"], "Rxc3": ["full_move/Rxc3_1"], "Rxc1": ["full_move/Rxc1_1"], "drawdeclined": ["draw_offer/drawdeclined_4", "draw_offer/drawdeclined_2", "draw_offer/drawdeclined_3", "draw_offer/drawdeclined_1"], "Kxg4": ["full_move/Kxg4_1"], "Kxg7": ["full_move/Kxg7_1"], "=": ["move_modifier/equals_2", "move_modifier/equals_1"], "Qg5": ["full_move/Qg5_1"], "Nxd2": ["full_move/Nxd2_1"], "Nxd3": ["full_move/Nxd3_1"], "draw": ["game_result/draw_1", "game_result/draw_2"], "A81": ["opening/A81_3", "opening/A81_2", "opening/A81_1"], "O-O-O": ["full_move/O-O-O_1", "full_move/O-O-O_3", "full_move/O-O-O_2", "full_move/O-O-O_6", "full_move/O-O-O_7", "full_move/O-O-O_5", "full_move/O-O-O_4"], "a1": ["square/a1_1", "square/a1_2", "square/a1_4"], "a3": ["square/a3_2", "square/a3_1", "square/a3_4"], "a2": ["square/a2_1", "square/a2_2", "square/a2_4"], "a5": ["square/a5_4", "square/a5_2", "square/a5_1"], "a4": ["square/a4_4", "square/a4_1", "square/a4_2"], "a7": ["square/a7_4", "square/a7_1", "square/a7_2"], "a6": ["square/a6_4", "square/a6_2", "square/a6_1"], "C00": ["opening/C00_4", "opening/C00_5", "opening/C00_1", "opening/C00_2", "opening/C00_3"], "a8": ["square/a8_2", "square/a8_1", "square/a8_4"], "N": ["piece/knight_6", "piece/knight_4", "piece/knight_5", "piece/knight_1", "piece/knight_2", "piece/knight_3"], "Ke5": ["full_move/Ke5_1"], "a": ["file/a_1"], "Bxa6": ["full_move/Bxa6_1"], "white_wins": ["game_result/white_wins_1"], "Bxa2": ["full_move/Bxa2_1"], "A02": ["opening/A02_3", "opening/A02_2", "opening/A02_1", "opening/A02_5", "opening/A02_4", "opening/A02_6"], "wins": ["game_result/wins_1"], "A00": ["opening/A00_1", "opening/A00_2", "opening/A00_3", "opening/A00_7", "opening/A00_6", "opening/A00_4", "opening/A00_5"], "A01": ["opening/A01_8", "opening/A01_9", "opening/A01_2", "opening/A01_3", "opening/A01_1", "opening/A01_10", "opening/A01_4", "opening/A01_5", "opening/A01_7", "opening/A01_6"], "A07": ["opening/A07_4", "opening/A07_5", "opening/A07_2", "opening/A07_3", "opening/A07_1"], "A04": ["opening/A04_5", "opening/A04_4", "opening/A04_3", "opening/A04_2", "opening/A04_1"], "Kxf3": ["full_move/Kxf3_1"], "1": ["rank/1_1"], "time": ["game_won_reason/time_1", "game_won_reason/time_2"]};

const soundExists = id => id in soundVariants;
const choice = lst => lst[Math.floor(Math.random()*lst.length)];
const getRandomForIds = (...ids) => choice(soundVariants[choice(ids)]);
const defaultBasePath = 'sounds/danny/mp3/';
const defaultExtension = 'mp3';

class DannyVoice extends AbstractVoice {

  start() {
    const ids = [
      getRandomForIds('game_start'),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }

  move({ san }) {
    const parts = shortestStringCover({
      target: san,
      choices: Object.keys(soundVariants),
    });
    if (parts) {
      const ids = parts.map(id => getRandomForIds(id));
      this._playIds(ids, defaultBasePath, defaultExtension);
    }
  }

  win({ winnerColor, reason }) {
    const ids = [
      getRandomForIds(winnerColor),
      getRandomForIds('wins'),
      getRandomForIds(reason === 'time' ? 'on' : 'by'),
      getRandomForIds(reason),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }

  draw({ reason }) {
    const ids = [
      getRandomForIds('draw'),
      getRandomForIds('by'),
      getRandomForIds(reason),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }

  time({ playerColor, seconds }) {
    const ids = [
      getRandomForIds('low_on_time', `low_on_time_${playerColor}`),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension, 1);
  }

  idle({ playerColor, seconds }) {
    const ids = [
      getRandomForIds('idle', `idle_${playerColor}`),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension, 0);
  }

  drawOffered({ playerColor, playerUsername }) {
    const ids = [
      getRandomForIds(playerColor),
      getRandomForIds('offered'),
      getRandomForIds('draw'),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }

  drawDeclined({ playerColor, playerUsername }) {
    const ids = [
      getRandomForIds(playerColor),
      getRandomForIds('declined'),
      getRandomForIds('draw'),
    ];
    this._playIds(ids, defaultBasePath, defaultExtension);
  }

  opening({ name }) {
    const openingId = name.split(':')[0];
    if (soundExists(openingId)) {
      const ids = [
        getRandomForIds(openingId),
      ];
      this._playIds(ids, defaultBasePath, defaultExtension);
    }
  }
};

export {
  DannyVoice,
};
