import { KING, QUEEN, KNIGHT, BISHOP, ROOK, PAWN } from '../constants'
import { Piece } from '../piece'

export class Pawn extends Piece {
  get brand() {
    return PAWN;
  }
  get unicode() {
    return this.isWhite ? '♙' : '♟';
  }
  get fenEncoding() {
    return this.isWhite ? 'P' : 'p';
  }
}

export class Rook extends Piece {
  get brand() {
    return ROOK;
  }
  get unicode() {
    return this.isWhite ? '♖' : '♜';
  }
  get fenEncoding() {
    return this.isWhite ? 'R' : 'r';
  }
}

export class Knight extends Piece {
  get brand() {
    return KNIGHT;
  }
  get unicode() {
    return this.isWhite ? '♘' : '♞';
  }
  get fenEncoding() {
    return this.isWhite ? 'N' : 'n';
  }
}

export class Bishop extends Piece {
  get brand() {
    return BISHOP;
  }
  get unicode() {
    return this.isWhite ? '♗' : '♝';
  }
  get fenEncoding() {
    return this.isWhite ? 'B' : 'b';
  }
}

export class King extends Piece {
  get brand() {
    return KING;
  }
  get unicode() {
    return this.isWhite ? '♔' : '♚';
  }
  get fenEncoding() {
    return this.isWhite ? 'K' : 'k';
  }
}

export class Queen extends Piece {
  get brand() {
    return QUEEN;
  }
  get unicode() {
    return this.isWhite ? '♕' : '♛';
  }
  get fenEncoding() {
    return this.isWhite ? 'Q' : 'q';
  }
}
