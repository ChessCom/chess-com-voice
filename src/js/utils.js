'use strict';

const LOG = (msg) => {
  chrome.runtime.sendMessage({ type: 'log', message: msg });
};

const pieceCodeToName = {
  'K': 'king',
  'Q': 'queen',
  'R': 'rook',
  'B': 'bishop',
  'N': 'knight',
};

const matchSan = (san) => {
  // pattern for SAN based on this thread https://stackoverflow.com/questions/40007937/regex-help-for-chess-moves-san
  // with modifications
  const pattern = /(?:(O-O(?:-O)?)|(?:([NBRQK])?([a-h])?([1-8])?(x)?([a-h])([1-8])(=[NBRQK])?))(\+)?(#)?/;
  return san.match(pattern);
}

export {
  LOG,
  pieceCodeToName,
  matchSan,
 };
