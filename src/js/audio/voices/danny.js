'use strict';

import { AudioSequence, PlayQueue, makeAudioPath } from '../utils';
import { matchSan, pieceCodeToName, LOG } from '../../utils';

const defaultBasePath = 'sounds/danny/wav/parts/';
const defaultExtension = 'wav';

const getMoveAudioIds = (san) => {
  // finds the shortest set of audios covering the whole san

  const variants = {
    "Rf4": ["Rf4"], "d8": ["d8"], "d6": ["d6"], "d4": ["d4"], "d5": ["d5"], "d2": ["d2"], "d3": ["d3"], "g7": ["g7"], "g6": ["g6"], "g5": ["g5"], "g4": ["g4"], "g3": ["g3"], "Rg5": ["Rg5"], "g1": ["g1"], "Rg7": ["Rg7"], "Rg8": ["Rg8"], "Qg4": ["Qg4", "Qg4_1"], "g8": ["g8"], "Qh4": ["Qh4"], "Kc2": ["Kc2"], "Qf5": ["Qf5"], "Nxc6": ["Nxc6"], "b4": ["b4"], "b5": ["b5_1", "b5"], "b6": ["b6"], "b7": ["b7"], "b1": ["b1"], "b2": ["b2"], "b3": ["b3"], "b8": ["b8"], "Nd7": ["Nd7"], "#": ["#"], "Qxf7": ["Qxf7"], "Qxf6": ["Qxf6"], "+": ["+"], "Kb1": ["Kb1"], "Bd3": ["Bd3"], "e5": ["e5_1", "e5"], "e4": ["e4"], "e7": ["e7"], "e6": ["e6_1", "e6"], "e1": ["e1"], "e3": ["e3"], "e2": ["e2"], "Q": ["Q"], "Ke6": ["Ke6"], "h8": ["h8"], "Na4": ["Na4"], "h3": ["h3"], "h1": ["h1"], "h6": ["h6_1", "h6"], "h4": ["h4"], "h5": ["h5"], "Qb4": ["Qb4", "Qb4_1"], "Qb5": ["Qb5_1", "Qb5"], "Ne5": ["Ne5"], "Qc1": ["Qc1"], "B": ["B"], "R": ["R"], "c3": ["c3"], "c7": ["c7"], "c5": ["c5"], "c4": ["c4"], "Kg2": ["Kg2"], "Nc3": ["Nc3"], "Nc4": ["Nc4_1", "Nc4_2", "Nc4"], "Nc5": ["Nc5"], "Qd5": ["Qd5"], "f2": ["f2"], "f3": ["f3", "f3_1"], "f4": ["f4"], "f5": ["f5"], "f6": ["f6", "f6_1"], "f7": ["f7"], "f8": ["f8"], "g2": ["g2"], "Nh5": ["Nh5"], "O-O-O": ["O-O-O"], "a1": ["a1"], "a2": ["a2"], "a5": ["a5"], "a4": ["a4"], "a7": ["a7"], "a6": ["a6"], "Rh3": ["Rh3"], "Rh4": ["Rh4"], "Rh6": ["Rh6"], "Ka2": ["Ka2"], "c8": ["c8", "c8_1"]
  };

  const choices = Object.keys(variants);

  let q = [{san, parts: []}];
  let best_parts = [];
  while (q.length) {
    const { san, parts } = q.shift();
    if (san === '') {
      best_parts = parts;
      break;
    }
    for (const part of choices) {
      if (san.startsWith(part)) {
        q.push({ san: san.substr(part.length), parts: [...parts, part] });
      }
    }
  }
  const ids = best_parts.map(part => variants[part][Math.floor(Math.random()*variants[part].length)]);
  return ids;
}

class DannyVoice {
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

  _playIds(ids, basePath = defaultBasePath, extension = defaultExtension, priority = 5) {
    if (this.mute) {
      return;
    }
    const audios = ids.map(id => makeAudioPath({ basePath, identifierPath: id, extension }));
    const seq = new AudioSequence(audios, this.volume);
    this.q.enqueue(seq, priority);
  }

  move({ san }) {
    LOG('about to play ' + san);
    const ids = getMoveAudioIds(san);
    LOG(ids);
    // TODO: sound files should always assure that ids are not empty
    if (ids) {
      this._playIds(ids);
    }
  }

  win({ winnerColor, reason }) {
    // TODO: not existing yet
    return;
  }

  draw({ reason }) {
    // TODO: not existing yet
    return;
  }

  idle({ idleTime, playerColor }) {
    //TODO: maybe implement something?
  }
};

export {
  DannyVoice,
};
