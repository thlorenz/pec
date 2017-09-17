const {
    raceCombos
  , raceCombosForBoard
  , raceRange
  , raceRangeForBoard
  , rates
} = require('../../')
const prange = require('prange')
const { detailRange } = require('pdetail')
const spok = require('spok')
const ocat = require('./ocat')

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

function raceSingleForBoard(combo1, combo2, times, board) {
  const arr1 = arryifyCombo(combo1)
  const arr2 = arryifyCombo(combo2)
  const res = raceCombosForBoard(arr1, arr2, times, board)
  return rates(res)
}

function checkSingle(t, combo1, combo2, expectedWinRate, maxDeviation = 4, times = ITER) {
  const { winRate: win, looseRate: loose, tieRate: tie } = raceSingle(combo1, combo2, times)
  const msg = `${combo1} wins ${expectedWinRate}% vs.${combo2}, actual ${win}% vs ${loose}%, tie: ${tie}%`
  const pass = expectedWinRate - maxDeviation < win && win < expectedWinRate + maxDeviation
  t.ok(pass, msg)
}

function checkSingleForBoard(t, combo1, combo2, board, win, loose, tie, times = ITER) {
  const res = raceSingleForBoard(combo1, combo2, ITER, board.split(' '))
  if (win == null) {
    ocat.log(res)
    return
  }
  spok(t, res,
    { $topic    : `${combo1} vs ${combo2} on ${board}`
    , winRate   : spok.range(win[0], win[1])
    , looseRate : spok.range(loose[0], loose[1])
    , tieRate   : spok.range(tie[0], tie[1])
    }
  )
}

function checkSingleAll(t, combo1, combo2, expectedWinRate, maxDeviation = 4) {
  const { winRate: win, looseRate: loose, tieRate: tie } = raceSingle(combo1, combo2, null)
  const msg = `${combo1} wins ${expectedWinRate}% vs.${combo2}, actual ${win}% vs ${loose}%, tie: ${tie}%`
  const pass = expectedWinRate - maxDeviation < win && win < expectedWinRate + maxDeviation
  t.ok(pass, msg)
}

function checkSingleAllForBoard(t, combo1, combo2, board, win, loose, tie) {
  const res = raceSingleForBoard(combo1, combo2, null, board.split(' '))
  if (win == null) {
    ocat.log(res)
    return
  }
  spok(t, res,
    { $topic    : `${combo1} vs ${combo2} on ${board}`
    , winRate   : spok.range(win[0], win[1])
    , looseRate : spok.range(loose[0], loose[1])
    , tieRate   : spok.range(tie[0], tie[1])
    }
  )
}

function raceComboVsRange(combo, range, times, trackCombos) {
  const arr = arryifyCombo(combo)
  const expanded = expandRange(range)
  return raceRange(arr, expanded, times, trackCombos)
}

function raceComboVsRangeForBoard(combo, range, times, trackCombos, board) {
  const arr = arryifyCombo(combo)
  const expanded = expandRange(range)
  return raceRangeForBoard(arr, expanded, times, trackCombos, board)
}

function rateComboVsRange(combo, range, times, trackCombos) {
  const res = raceComboVsRange(combo, range, times, trackCombos)
  return rates(res)
}

function rateComboVsRangeForBoard(combo, range, times, trackCombos, board) {
  const res = raceComboVsRangeForBoard(combo, range, times, trackCombos, board)
  return rates(res)
}

function checkRange(t, combo, range, expectedWin, expectedLoose, maxDeviation = 4, times = ITER) {
  const { winRate: win, looseRate: loose, tieRate: tie } = rateComboVsRange(combo, range, times)
  const msg = `${combo} wins ${expectedWin}% and looses ${expectedLoose}% vs ${range}, actual ${win}% vs ${loose}%, tie: ${tie}`
  const pass = expectedWin - maxDeviation < win && win < expectedWin + maxDeviation &&
               expectedLoose - maxDeviation < loose && loose < expectedLoose + maxDeviation
  t.ok(pass, msg)
}

function checkRangeAll(t, combo, range, expectedWin, expectedLoose, maxDeviation = 4) {
  const { winRate: win, looseRate: loose, tieRate: tie } = rateComboVsRange(combo, range, null)
  const msg = `${combo} wins ${expectedWin}% and looses ${expectedLoose}% vs ${range}, actual ${win}% vs ${loose}%, tie: ${tie}`
  const pass = expectedWin - maxDeviation < win && win < expectedWin + maxDeviation &&
               expectedLoose - maxDeviation < loose && loose < expectedLoose + maxDeviation
  t.ok(pass, msg)
}

module.exports = {
    checkSingle
  , checkSingleForBoard
  , checkSingleAll
  , checkSingleAllForBoard
  , checkRange
  , checkRangeAll
  , expandRange
  , arryifyCombo
  , raceComboVsRange
  , rateComboVsRange
  , raceComboVsRangeForBoard
  , rateComboVsRangeForBoard
  , raceSingleForBoard
}
