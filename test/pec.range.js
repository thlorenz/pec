const test = require('tape')
const { checkRange } = require('./util/util')

test('\npreflop:range: pair vs. other pairs', function(t) {
  [ [ 'AsAh', 'KK, QQ, JJ', 81, 19 ]
  , [ 'AsAh', 'JJ+', 49, 31 ]
  , [ 'JsJh', 'QQ+', 18, 81 ]
  , [ 'JsJh', '88+', 37, 50 ]
  ].forEach(x => checkRange.apply(null, [ t ].concat(x)))
  t.end()
})
