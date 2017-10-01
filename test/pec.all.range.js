'use strict'

const test = require('tape')
const { checkRangeAll } = require('./util/util')

test('\npreflop:all:range: pair vs. other pairs', function(t) {
  [ [ 'AsAh', 'KK, QQ, JJ', 81, 18 ]
  , [ 'AsAh', 'JJ+', 59, 13 ]
  ].forEach(x => checkRangeAll.apply(null, [ t ].concat(x)))
  t.end()
})
