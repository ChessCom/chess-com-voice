'use strict';

const sanToDefaultSoundsPaths = (san) => {

  const pieceCodeToName = {
    'K': 'king',
    'Q': 'queen',
    'R': 'rook',
    'B': 'bishop',
    'N': 'knight',
  };

  // pattern for SAN based on this thread https://stackoverflow.com/questions/40007937/regex-help-for-chess-moves-san
  // with modifications
  const pattern = /(?:(O-O(?:-O)?)|(?:([NBRQK])?([a-h])?([1-8])?(x)?([a-h])([1-8])(=[NBRQK])?))(\+)?(#)?/;

  const match = san.match(pattern);

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

  seq = seq.map(path => `sounds/default/${path}.mp3`);
  return seq;
}

export { sanToDefaultSoundsPaths };
