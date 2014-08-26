# chess view [![Build Status](https://travis-ci.org/humanchimp/chessview.svg?branch=master)](https://travis-ci.org/humanchimp/chessview) [![Coverage Status](https://coveralls.io/repos/humanchimp/chessview/badge.png)](https://coveralls.io/r/humanchimp/chessview)

This is a library for chess positions. It is a work in progress.

# feature overview
_Checked items are implemented_

- [x] FEN
- [ ] PGN
- [ ] UCI
- [x] queryable position model with a simple API
- [x] decoupled views (unopinionated about frontend frameworks, although the ui samples are using mercury)
- [x] easily themeable 2d board
- [x] detect legal moves, checks, checkmates
- [x] compositional approach to piece mobility
- [ ] support for kibitzers
- [ ] support for chess variants:
  - [x] Chess960 (Fischerandom)
  - [ ] fairy pieces
  - [ ] non-standard board sizes (e.g. 8x10 Capablanca chess)
- [ ] support for various use-cases:
  - [x] figures
  - [ ] puzzles
  - [ ] person-vs-person live
  - [ ] person-vs-computer
  - [ ] analysis
  - [ ] lessons
- [x] good test coverage

## license

MIT (See LICENSE)
