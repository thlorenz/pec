const test = require('tape')
const { rateComboVsRangeForBoard } = require('./util/util')
const spok = require('spok')
/* eslint-disable no-unused-vars */
const ocat = require('./util/ocat')

test('\nflop:all race combo vs range not tracking combos', function(t) {
  const combo = 'AsAh'
  const range = 'KK, QQ, JJ'
  const board = 'Ad Ts 9h'.split(' ')
  const res = rateComboVsRangeForBoard(combo, range, null, false, board)

  spok(t, res,
    { winRate: 96.67, looseRate: 3.33, tieRate: 0 })

  t.end()
})

test('\nflop:all race combo vs range tracking combos', function(t) {
  const combo = 'AsAh'
  const range = 'KK, QQ, JJ'
  const board = 'Ad Ts 9h'.split(' ')
  const res = rateComboVsRangeForBoard(combo, range, null, true, board)

  spok(t, res,
    { winRate: 96.67, looseRate: 3.33, tieRate: 0 })

  spok(t, Array.from(res.combos),
    [ [ 'KhKs', { winRate: 98.28, looseRate: 1.72, tieRate: 0 } ]
    , [ 'KhKd', { winRate: 98.28, looseRate: 1.72, tieRate: 0 } ]
    , [ 'KhKc', { winRate: 98.28, looseRate: 1.72, tieRate: 0 } ]
    , [ 'KsKd', { winRate: 98.28, looseRate: 1.72, tieRate: 0 } ]
    , [ 'KsKc', { winRate: 98.28, looseRate: 1.72, tieRate: 0 } ]
    , [ 'KdKc', { winRate: 98.28, looseRate: 1.72, tieRate: 0 } ]
    , [ 'QhQs', { winRate: 96.67, looseRate: 3.33, tieRate: 0 } ]
    , [ 'QhQd', { winRate: 96.67, looseRate: 3.33, tieRate: 0 } ]
    , [ 'QhQc', { winRate: 96.67, looseRate: 3.33, tieRate: 0 } ]
    , [ 'QsQd', { winRate: 96.67, looseRate: 3.33, tieRate: 0 } ]
    , [ 'QsQc', { winRate: 96.67, looseRate: 3.33, tieRate: 0 } ]
    , [ 'QdQc', { winRate: 96.67, looseRate: 3.33, tieRate: 0 } ]
    , [ 'JhJs', { winRate: 95.05, looseRate: 4.95, tieRate: 0 } ]
    , [ 'JhJd', { winRate: 95.05, looseRate: 4.95, tieRate: 0 } ]
    , [ 'JhJc', { winRate: 95.05, looseRate: 4.95, tieRate: 0 } ]
    , [ 'JsJd', { winRate: 95.05, looseRate: 4.95, tieRate: 0 } ]
    , [ 'JsJc', { winRate: 95.05, looseRate: 4.95, tieRate: 0 } ]
    , [ 'JdJc', { winRate: 95.05, looseRate: 4.95, tieRate: 0 } ] ])

  t.end()
})
