const test = require('tape')
const { checkRangeAll } = require('./util/util')

test('\npreflop:all:range: pair vs. other pairs', function(t) {
  [ [ 'AsAh', 'KK, QQ, JJ', 81, 19 ]
  , [ 'AsAh', 'JJ+', 49, 31 ]
  ].forEach(x => checkRangeAll.apply(null, [ t ].concat(x)))
  t.end()
})
