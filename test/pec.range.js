'use strict'

const test = require('tape')
const { checkRange, rateComboVsRange } = require('./util/util')

test('\npreflop:range: pair vs. other pairs', function(t) {
  [ [ 'AsAh', 'KK, QQ, JJ', 81, 18 ]
  , [ 'AsAh', 'JJ+', 59, 13 ]
  , [ 'JsJh', 'QQ+', 18, 81 ]
  , [ 'JsJh', '88+', 43, 43 ]
  ].forEach(x => checkRange.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:range: ensuring per combo data', function(t) {
  const {
      winRate
    , looseRate
    , tieRate
    , combos
  } = rateComboVsRange('AsAh', 'KK, QQ, JJ', 10000, true)

  /* eslint-disable yoda */
  t.ok(80 < winRate && winRate < 85, 'winrate')
  t.ok(15 < looseRate && looseRate < 20, 'looserate')
  t.ok(0.1 < tieRate && tieRate < 1, 'tierate')

  ;['KhKs', 'KhKd', 'KhKc', 'KsKd', 'KsKc', 'KdKc',
    'QhQs', 'QhQd', 'QhQc', 'QsQd', 'QsQc', 'QdQc',
    'JhJs', 'JhJd', 'JhJc', 'JsJd', 'JsJc', 'JdJc' ]
  .forEach(x => {
    t.ok(combos.has(x), 'combos include ' + x)
    const { winRate, looseRate, tieRate } = combos.get(x)
    t.ok(75 < winRate && winRate < 85, 'combo ' + x + ' winrate')
    t.ok(12 < looseRate && looseRate < 22, 'combo ' + x + ' looserate')
    t.ok(0.01 < tieRate && tieRate < 1, 'combo ' + x + ' tierate')
  })
  t.end()
})
