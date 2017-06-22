const { raceCombos, raceRange, rates } = require('../../')
const prange = require('prange')
const { detailRange } = require('pdetail')

// 10,000 iterations seems minimum to get somewhat reliable results
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
  return rates(res)
}

function checkSingle(t, combo1, combo2, expectedWinRate, maxDeviation = 4, times = ITER) {
  const { win, loose, tie } = raceSingle(combo1, combo2, times)
  const msg = `${combo1} wins ${expectedWinRate}% vs.${combo2}, actual ${win}% vs ${loose}%, tie: ${tie}%`
  const pass = expectedWinRate - maxDeviation < win && win < expectedWinRate + maxDeviation
  t.ok(pass, msg)
}

function raceComboVsRange(combo, range, times) {
  const arr = arryifyCombo(combo)
  const expanded = expandRange(range)
  const res = raceRange(arr, expanded, times)
  return rates(res)
}

function checkRange(t, combo, range, expectedWin, expectedLoose, maxDeviation = 4, times = ITER) {
  const { win, loose, tie } = raceComboVsRange(combo, range, times)
  const msg = `${combo} wins ${expectedWin}% and looses ${expectedLoose}% vs.${range}, actual ${win}% vs ${loose}%, tie: ${tie}`
  const pass = expectedWin - maxDeviation < win && win < expectedWin + maxDeviation &&
               expectedLoose - maxDeviation < loose && loose < expectedLoose + maxDeviation
  t.ok(pass, msg)
}

module.exports = { checkSingle, checkRange }
