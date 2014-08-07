import { Piece } from '../piece'

export class Pawn extends Piece {
  get unicode() {
    return this.isWhite ? '♙' : '♟';
  }
  get fenEncoding() {
    return this.isWhite ? 'P' : 'p';
  }
}

export class Rook extends Piece {
  get unicode() {
    return this.isWhite ? '♖' : '♜';
  }
  get fenEncoding() {
    return this.isWhite ? 'R' : 'r';
  }
}

export class Knight extends Piece {
  get unicode() {
    return this.isWhite ? '♘' : '♞';
  }
  get fenEncoding() {
    return this.isWhite ? 'N' : 'n';
  }
}

export class Bishop extends Piece {
  get unicode() {
    return this.isWhite ? '♗' : '♝';
  }
  get fenEncoding() {
    return this.isWhite ? 'B' : 'b';
  }
}

export class King extends Piece {
  get unicode() {
    return this.isWhite ? '♔' : '♚';
  }
  get fenEncoding() {
    return this.isWhite ? 'K' : 'k';
  }
}

export class Queen extends Piece {
  get unicode() {
    return this.isWhite ? '♕' : '♛';
  }
  get fenEncoding() {
    return this.isWhite ? 'Q' : 'q';
  }
}
