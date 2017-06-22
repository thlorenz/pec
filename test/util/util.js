const { raceCombos, winRate } = require('../../')
const prange = require('prange')
const { detailRange } = require('pdetail')

// 10000 iterations seems minimum to get somewhat reliable results
// Still we use maxDeviation to keep tests from failing too often
const ITER = 1E4

function arryifyCombo(combo) {
  return [ combo[0] + combo[1], combo[2] + combo[3] ]
}

function expandRange(range) {
  const rangeSetArray = prange(range).map(detailRange)
  const rangeArray = []
  rangeSetArray.forEach(x => Array.from(x).forEach(c => {
    rangeArray.push(arryifyCombo(c))
  }))
  return rangeArray
}

function raceSingle(combo1, combo2, times) {
  const arr1 = arryifyCombo(combo1)
  const arr2 = arryifyCombo(combo2)
  const res = raceCombos(arr1, arr2, times)
  return winRate(res)
}

function checkSingle(t, combo1, combo2, expectedWinRate, maxDeviation = 4, times = ITER) {
  const winRate = raceSingle(combo1, combo2, times)
  const msg = `${combo1} wins ${expectedWinRate}% vs.${combo2}, actual ${winRate}%`
  const pass = expectedWinRate - maxDeviation < winRate && winRate < expectedWinRate + maxDeviation
  t.ok(pass, msg)
}

module.exports = {
    raceSingle
  , checkSingle
  , expandRange
}
