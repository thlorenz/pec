const test = require('tape')
const { rateComboVsRangeForBoard, expandRange } = require('./util/util')
const { cardCodes } = require('phe')
const { raceRangeCodesForBoard, rates } = require('../')
const spok = require('spok')
/* eslint-disable no-unused-vars */
const ocat = require('./util/ocat')

const ITER = 1E4

test('\nflop: race combo vs range not tracking combos', function(t) {
  const combo = 'AsAh'
  const range = 'KK, QQ, JJ'
  const board = 'Ad Ts 9h'.split(' ')
  const res = rateComboVsRangeForBoard(combo, range, ITER, false, board)
  spok(t, res,
    { winRate: spok.range(95, 98)
    , looseRate: spok.range(2, 5)
    , tieRate: 0
    , combos: spok.notDefined
  })

  t.end()
})

test('\nflop:single: race combo codes vs range codes not tracking combos', function(t) {
  const combo = [ 'As', 'Ah' ]
  const range = expandRange('KK, QQ, JJ')
  const board  = 'Ad Ts 9h'.split(' ')

  const comboCodes = cardCodes(combo)
  const boardCodes = cardCodes(board)
  const rangeCodes = range.map(cardCodes)
  const counts = raceRangeCodesForBoard(comboCodes, rangeCodes, ITER, false, boardCodes)
  const res = rates(counts)

  spok(t, res,
    { winRate: spok.range(95, 98)
    , looseRate: spok.range(2, 5)
    , tieRate: 0 })

  t.end()
})

test('\nturn: race combo vs range not tracking combos', function(t) {
  const combo = 'AsAh'
  const range = 'KK, QQ, JJ'
  const board = 'Ad Ts 9h 8h'.split(' ')
  const res = rateComboVsRangeForBoard(combo, range, ITER, false, board)
  spok(t, res,
    { winRate: spok.range(88, 92)
    , looseRate: spok.range(8, 12)
    , tieRate: 0
    , combos: spok.notDefined
  })

  t.end()
})

test('\nturn: race combo codes vs range codes not tracking combos', function(t) {
  const combo = [ 'As', 'Ah' ]
  const range = expandRange('KK, QQ, JJ')
  const board = 'Ad Ts 9h 8h'.split(' ')

  const comboCodes = cardCodes(combo)
  const boardCodes = cardCodes(board)
  const rangeCodes = range.map(cardCodes)
  const counts = raceRangeCodesForBoard(comboCodes, rangeCodes, ITER, false, boardCodes)
  const res = rates(counts)
  spok(t, res,
    { winRate: spok.range(88, 92)
    , looseRate: spok.range(8, 12)
    , tieRate: 0
    , combos: spok.notDefined
  })

  t.end()
})

test('\nturn: 4 street on board, race combo vs range not tracking combos', function(t) {
  const combo = 'AsAh'
  const range = 'KK, QQ, JJ'
  const board = 'Qh Ts 9h 8h'.split(' ')
  const res = rateComboVsRangeForBoard(combo, range, ITER, false, board)
  spok(t, res,
    { winRate: spok.range(38, 42)
    , looseRate: spok.range(52, 60)
    , tieRate: spok.range(2, 6)
    , combos: spok.notDefined
  })

  t.end()
})

test('\nflop: race combo vs range tracking combos', function(t) {
  const combo = 'AsAh'
  const range = 'KK, QQ, JJ'
  const board = 'Ad Ts 9h'.split(' ')
  const res = rateComboVsRangeForBoard(combo, range, ITER, true, board)

  const winRate = spok.range(89, 99)
  const looseRate = spok.range(1, 11)
  const tieRate = 0

  spok(t, Array.from(res.combos),
    [ [ 'KhKs', { winRate, looseRate, tieRate } ]
    , [ 'KhKd', { winRate, looseRate, tieRate } ]
    , [ 'KhKc', { winRate, looseRate, tieRate } ]
    , [ 'KsKd', { winRate, looseRate, tieRate } ]
    , [ 'KsKc', { winRate, looseRate, tieRate } ]
    , [ 'KdKc', { winRate, looseRate, tieRate } ]
    , [ 'QhQs', { winRate, looseRate, tieRate } ]
    , [ 'QhQd', { winRate, looseRate, tieRate } ]
    , [ 'QhQc', { winRate, looseRate, tieRate } ]
    , [ 'QsQd', { winRate, looseRate, tieRate } ]
    , [ 'QsQc', { winRate, looseRate, tieRate } ]
    , [ 'QdQc', { winRate, looseRate, tieRate } ]
    , [ 'JhJs', { winRate, looseRate, tieRate } ]
    , [ 'JhJd', { winRate, looseRate, tieRate } ]
    , [ 'JhJc', { winRate, looseRate, tieRate } ]
    , [ 'JsJd', { winRate, looseRate, tieRate } ]
    , [ 'JsJc', { winRate, looseRate, tieRate } ]
    , [ 'JdJc', { winRate, looseRate, tieRate } ] ])
  t.end()
})
