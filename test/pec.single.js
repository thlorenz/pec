const test = require('tape')
const { checkSingle } = require('./util/util')

test('\npreflop:single: pair vs. pair', function(t) {
  [ [ 'AsAh', 'KsKh', 82 ]
  , [ 'JsJh', '7s7h', 81 ]
  , [ 'JsJh', 'TsTh', 82 ]
  , [ 'AsAh', '2s2h', 83 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: pair vs. overcards', function(t) {
  [ [ 'JsJh', 'KsQh', 56 ]
  , [ 'JsJh', 'AsQh', 55 ]
  , [ 'JsJh', 'AcQc', 54 ]
  , [ 'JsJh', 'KcQc', 53 ]
  , [ '2s2h', 'KcQc', 48 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: pair vs. undercards', function(t) {
  [ [ 'JsJh', 'Ts9h', 86 ]
  , [ 'JsJh', '6s2h', 87 ]
  , [ 'JsJh', 'Tc9c', 81 ]
  , [ 'JsJh', '6c2c', 82 ]
  , [ '6s6h', '2c3c', 79 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: pair vs. overcard and undercard', function(t) {
  [ [ 'JsJh', 'Ks9h', 72 ]
  , [ 'JsJh', 'Qs6h', 72 ]
  , [ 'JsJh', 'Kc9c', 68 ]
  , [ 'JsJh', 'Kc6c', 68 ]
  , [ '6s6h', 'Tc3c', 65 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: pair vs. overcard and card match', function(t) {
  [ [ 'JsJh', 'KsJh', 68 ]
  , [ 'JsJh', 'QsJh', 67 ]
  , [ 'JsJh', 'KcJc', 63 ]
  , [ 'JsJh', 'KcJc', 63 ]
  , [ '6s6h', 'Tc6c', 61 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: pair vs. undercard and card match', function(t) {
  [ [ 'JsJh', 'Js9h', 86 ]
  , [ 'JsJh', 'Js6h', 90 ]
  , [ 'JsJh', 'Jc9c', 81 ]
  , [ 'JsJh', 'Jc6c', 85 ]
  , [ '6s6h', '6c3c', 79 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: two high cards vs. two undercards', function(t) {
  [ [ 'KsTh', '7s4h', 65 ]
  , [ 'AsQh', 'Js6h', 68 ]
  , [ 'KsTh', '7c4c', 60 ]
  , [ 'AsQh', 'Jc6c', 63 ]
  , [ 'Js8h', '6c3c', 60 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: high low card vs. two cards in between', function(t) {
  [ [ 'Ks3h', 'Js4h', 59 ]
  , [ 'As8h', 'Js9h', 57 ]
  , [ 'Ks3h', '7c4c', 53 ]
  , [ 'As8h', 'JcTc', 52 ]
  , [ 'Js3h', '6c4c', 52 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: high and mid card vs. one between and one below', function(t) {
  [ [ 'Ks8h', 'Ts6h', 62 ]
  , [ 'As8h', 'Js6h', 64 ]
  , [ 'Ks3h', '7c2c', 59 ]
  , [ 'As8h', 'Jc5c', 59 ]
  , [ 'Js3h', '6c2c', 57 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: high and low, matched low card', function(t) {
  [ [ 'Ks8h', 'Ts8d', 67 ]
  , [ 'As8h', 'Js8d', 70 ]
  , [ 'Ks3h', '7c3c', 65 ]
  , [ 'As8h', 'Jc8c', 65 ]
  , [ 'Js3h', '6c3c', 61 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:single: high vs. matched high and low', function(t) {
  [ [ 'Ks8h', 'Kd6h', 46 ]
  , [ 'As8h', 'Ad6h', 47 ]
  , [ 'Ks3h', 'Kc2c', 18 ]
  , [ 'As8h', 'Ac5c', 42 ]
  , [ 'Js3h', 'Jd2c', 19 ]
  , [ 'AsKh', 'Ad9c', 68 ]
  ].forEach(x => checkSingle.apply(null, [ t ].concat(x)))
  t.end()
})
