'use strict'

const test = require('tape')
const { checkSingleAll } = require('./util/util')

test('\npreflop:all:single: pair vs. pair', function(t) {
  [ [ 'AsAh', 'KsKh', 82 ]
  , [ 'JsJh', '7s7h', 81 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: pair vs. overcards', function(t) {
  [ [ 'JsJh', 'KsQh', 56 ]
  , [ 'JsJh', 'AsQh', 56 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: pair vs. undercards', function(t) {
  [ [ 'JsJh', 'Ts9h', 86 ]
  , [ 'JsJh', '6s2h', 88 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: pair vs. overcard and undercard', function(t) {
  [ [ 'JsJh', 'Ks9h', 72 ]
  , [ 'JsJh', 'Qs6h', 72 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: pair vs. overcard and card match', function(t) {
  [ [ 'JsJh', 'KsJh', 70 ]
  , [ 'JsJh', 'QsJh', 69 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: pair vs. undercard and card match', function(t) {
  [ [ 'JsJh', 'Js9h', 89 ]
  , [ 'JsJh', 'Js6h', 93 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: two high cards vs. two undercards', function(t) {
  [ [ 'KsTh', '7s4h', 66 ]
  , [ 'AsQh', 'Js6h', 68 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: high low card vs. two cards in between', function(t) {
  [ [ 'Ks3h', 'Js4h', 59 ]
  , [ 'As8h', 'Js9h', 57 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: high and mid card vs. one between and one below', function(t) {
  [ [ 'Ks8h', 'Ts6h', 63 ]
  , [ 'As8h', 'Js6h', 64 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: high and low, matched low card', function(t) {
  [ [ 'Ks8h', 'Ts8d', 69 ]
  , [ 'As8h', 'Js8d', 71 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})

test('\npreflop:all:single: high vs. matched high and low', function(t) {
  [ [ 'Ks8h', 'Kd6h', 56 ]
  , [ 'As8h', 'Ad6h', 56 ]
  , [ 'AsKh', 'Ad9c', 72 ]
  ].forEach(x => checkSingleAll.apply(null, [ t ].concat(x)))
  t.end()
})
