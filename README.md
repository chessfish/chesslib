# chesslib [![Build Status](https://travis-ci.org/humanchimp/chesslib.svg?branch=master)](https://travis-ci.org/humanchimp/chesslib) [![Coverage Status](https://coveralls.io/repos/humanchimp/chesslib/badge.png)](https://coveralls.io/r/humanchimp/chesslib)

This is a library for chess positions. It is a work in progress.

# api

_Note:_ the below is partial documentation of the chessview API. Like the project itself, it is a work in progress. I hope to fully document the API eventually.

## FEN

### `FEN.parse(fenSource)`
returns the `Position` object represented by the [FEN](http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)-encoded `fenSource`

### `FEN.stringify(position)`
returns the FEN-encoded string representing the given `Position` object

### `FEN.standard`
a string encoding of the standard starting position.

### `FEN.standardPosition`
the `Position` object obtained by calling `FEN.parse(FEN.standard)`.

## PGN

### `PGN.parse(pgnSource)`
returns an array of `Game` objects.

PGNs can contain a single game, or a collection of many games. This method always returns an array of the one or more `Game` objects represented by that PGN.

## Algebraic

### `Algebraic.parse(moveNotation)`

returns a `{ piece, move }` literal with the piece and "move" (coordinates) described by the [algebraic notation](http://en.wikipedia.org/wiki/Algebraic_notation_(chess))-encoded `moveNotation`.

## Position

This class represents a given position of chess. It doesn't necessarily represent a legal position, although it can only beget positions which follow from legal moves. Each position is immutable.

### `new Position(options)`
_Where:_
- `ranks=8`
- `files=8`
- `activeColor=WHITE`
- `castling=null`
- `enPassantTarget=null`
- `halfmoveClock=null`
- `fullmoveCounter=0`
- `board=new Board(ranks, files)`

This constructor is generally not used directly. Instead, you'd usually come about a new `Position` object by calling `FEN.parse()` or `position.move()`.

### `position.beget(overrides)`
Return a new `Position` that is exactly the same as the current position, except for the properties of `overrides`. This method is not generally used directly. Instead, you'd normally use `position.move()`

### `position.move(moveNotation)`
returns a new `Position` object representing the position after the give `moveNotation`, which is a string of

throws a `MobilityError` if the move is illegal because a piece would be blocked, because the target square is occupied by a friendly piece, or because there is no suitable piece on the board able to move to that square by definition.

throws a `CheckError` if the move is illegal because it would leave the King in check.

### `position.movePiece(piece, target)`
like `position.move()`, but lower level, and handier for UI programming. Instead of taking the move in algebraic notation, it takes the piece and the coordinates of the target square.

### `position.tryMovePiece(piece, target)`
like `position.movePiece()`, except it doesn't throw, and instead returns the position itself upon error. This makes it even handier for UI programming (pieces snap back home on an illegal move), but worthless for analysis, where the question of move legality is important, since that information will be silenced.

### `position.moves()`
returns an iterator of every legal move in the given position.

### `position.checks(color=activeColor,loc=activeKingLoc)`
returns an iterator of every check in the given position. This can also be used speculatively, to wonder what checks _would exist_ if the king were on a given square.

### `position.pieces(selector)`
returns an iterator of all the pieces matching the `selector`, where the `selector` describes the color and/or brand of the pieces in question.

### `position.piece(selector)`
returns the first piece matching the selector.

### `position.all(selector)`
returns an array of all the pieces matching the selector.

## Line

A line is an accumalator of moves and corresponding immutable positions.

### `new Line(position=FEN.standardPosition)`
instantiates a new `Line` object.

### `line.move(moveNotation)`
accumulate a new `{ position, move, note }` literal, where `position` is the `Position` object obtained by calling `position.move(move)` on the line's current position, and `note` is an optional annotation.

### `line.annotate(note)`
add a note to, or replace the existing note of, the current `{ position, move }` literal.

### `line.plyLength`
the length of the line, measured by ply.

### `line.length`
the length of the line, measured by moves.

### Game

A `Game` object is a `Line`, accompanied by some optional tags.

### `new Game(position=FEN.standardPosition, tags)`
instantiates a new `Game` object.

### `game.addTag(tag)`
add a tag to the game's collection of tags.

# feature roadmap
_Checked items are implemented_

- [x] FEN
- [x] PGN
- [ ] UCI
- [x] queryable position model with a simple API
- [x] detect legal moves, checks, checkmates
- [x] compositional approach to piece mobility
- [ ] support for chess variants:
  - [x] Chess960 (Fischerandom)
  - [ ] fairy pieces
  - [ ] non-standard board sizes (e.g. 8x10 Capablanca chess)
- [x] good test coverage

# license

MIT (See LICENSE)
