'use strict'

const test = require('tape')
const { checkSingleForBoard } = require('./util/util')

const { raceCodesForBoard, rates } = require('../')
const { cardCodes } = require('phe')

const spok = require('spok')

// There are a total of 49 * 48 (2,352) boards for a given flop
// However we're running randomly, so 1E4 (default ITER) should cover us

test('\nflop:single: various samples', function(t) {
  [ [ 'AsAh', 'KsKh', 'Kd Td 9h', [ 9, 12 ], [ 88, 91 ], [ 0, 0 ] ]
  , [ 'AsAh', 'KsKh', 'Ad Td 9h', [ 97, 99 ], [ 1, 3 ], [ 0, 0 ] ]
  , [ 'AsAh', 'KsKh', 'Kd Jd Th', [ 19, 24 ], [ 76, 80 ], [ 0.2, 1 ] ]
  , [ 'As8h', 'Js6h', '4s 5s 5h', [ 73, 76 ], [ 23, 27 ], [ 0.7, 1.2 ] ]
  ].forEach(x => checkSingleForBoard.apply(null, [ t ].concat(x)))
  t.end()
})

test('\nturn:single: various samples', function(t) {
  [ [ 'AsAh', 'KsKh', 'Kd Td 9h 4s', [ 4.0, 5.2 ], [ 94.5, 96 ], [ 0, 0 ] ]
  , [ 'As8h', 'Js6d', '4d 5s 5d 2d', [ 60, 64 ], [ 38, 39.5 ], [ 0, 0 ] ]
  ].forEach(x => checkSingleForBoard.apply(null, [ t ].concat(x)))

  t.end()
})

const ITER = 1E4
test('\nflop:single: racing codes', function(t) {
  const combo1 = cardCodes([ 'As', 'Ah' ])
  const combo2 = cardCodes([ 'Ks', 'Kh' ])
  const board = cardCodes('Kd Td 9h 4s'.split(' '))
  const counts = raceCodesForBoard(combo1, combo2, ITER, board)
  const res = rates(counts)

  spok(t, res,
    { winRate: spok.range(4.0, 5.2)
    , looseRate: spok.range(94.5, 96)
    , tieRate: 0 })
  t.end()
})
