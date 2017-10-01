'use strict'

const { raceRange, rates } = require('../')

const combo = [ 'Jh', 'Js' ]
const range = [
  [ 'Kh', 'Ks' ], [ 'Kh', 'Kd' ], [ 'Kh', 'Kc' ],
  [ 'Ks', 'Kd' ], [ 'Ks', 'Kc' ], [ 'Kd', 'Kc' ],
  [ 'Qh', 'Qs' ], [ 'Qh', 'Qd' ], [ 'Qh', 'Qc' ],
  [ 'Qs', 'Qd' ], [ 'Qs', 'Qc' ], [ 'Qd', 'Qc' ]
]

const { win, loose, tie } = raceRange(combo, range, 1E4)
const { winRate, looseRate, tieRate } = rates({ win, loose, tie })

console.log('JJ performs as follows vs. [ KK, QQ ]')
console.log('win: %d%% (%d times)', winRate, win)
console.log('loose: %d%% (%d times)', looseRate, loose)
console.log('tie: %d%% (%d times)', tieRate, tie)
