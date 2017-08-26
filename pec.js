const { cardCodes } = require('phe')
const evaluate7Cards = require('phe/lib/evaluator7')

const { allPossibleFullBoardCodes } = require('./lib/board')
const { cardsArrayMinusBlockers } = require('./lib/common')

function compareTwoWithBoardExpanded(combo1First, combo1Second, combo2First, combo2Second, b1, b2, b3, b4, b5) {
  const strength1 = evaluate7Cards(b1, b2, b3, b4, b5, combo1First, combo1Second)
  const strength2 = evaluate7Cards(b1, b2, b3, b4, b5, combo2First, combo2Second)
  return (
      strength1 === strength2 ?  0
    : strength1 < strength2   ? -1
    : 1
  )
}
function compareTwoWithBoard(combo1First, combo1Second, combo2First, combo2Second, board) {
  return compareTwoWithBoardExpanded(
    combo1First, combo1Second, combo2First, combo2Second,
    board[0], board[1], board[2], board[3], board[4])
}

// allow excluding up to 4 (flop + turn)
function randomCardIdx(max, a, b, c, d) {
  while (true) {
    const n =  Math.floor(Math.random() * max)
    if (a < 0) return n
    if (n === a) continue

    if (b < 0) return n
    if (n === b) continue

    if (c < 0) return n
    if (n === c) continue

    if (d < 0) return n
    if (n !== d) return n
  }
}

function randomBoard(cardArray, max) {
  const flop1 = randomCardIdx(max, -1, -1, -1, -1)
  const flop2 = randomCardIdx(max, flop1, -1, -1, -1)
  const flop3 = randomCardIdx(max, flop1, flop2, -1, -1)
  const turn  = randomCardIdx(max, flop1, flop2, flop3, -1)
  const river = randomCardIdx(max, flop1, flop2, flop3, turn)
  // avoiding slower array.map
  const flopCode1 = cardArray[flop1]
  const flopCode2 = cardArray[flop2]
  const flopCode3 = cardArray[flop3]
  const turnCode = cardArray[turn]
  const riverCode = cardArray[river]

  return [ flopCode1, flopCode2, flopCode3, turnCode, riverCode ]
}

function raceCodesAll(combo1, combo2) {
  const [ combo1First, combo1Second ] = combo1
  const [ combo2First, combo2Second ] = combo2
  const blockers = new Set([ combo1First, combo1Second, combo2First, combo2Second ])
  const boards = allPossibleFullBoardCodes(blockers)

  var win = 0
  var loose = 0
  var tie = 0

  // Evaluate all
  for (var b = 0; b < boards.length; b += 5) {
    const res = compareTwoWithBoardExpanded(
      combo1First, combo1Second, combo2First, combo2Second,
      boards[b], boards[b + 1], boards[b + 2], boards[b + 3], boards[b + 4])

    if (res === 0) tie++
    else if (res < 0) win++
    else loose++
  }

  return { win, loose, tie }
}

function raceCodesRandom(combo1, combo2, times) {
  const combo1First  = combo1[0]
  const combo1Second = combo1[1]
  const combo2First  = combo2[0]
  const combo2Second = combo2[1]

  const blockers = new Set([ combo1First, combo1Second, combo2First, combo2Second ])

  const cardArray = cardsArrayMinusBlockers(blockers)
  const cardArrayLen = cardArray.length

  var win = 0
  var loose = 0
  var tie = 0

  for (var i = 0; i < times; i++) {
    const board = randomBoard(cardArray, cardArrayLen)
    const res = compareTwoWithBoard(combo1First, combo1Second, combo2First, combo2Second, board)
    if (res === 0) tie++
    else if (res < 0) win++
    else loose++
  }

  return { win, loose, tie }
}

/**
 * Same as @see raceCombos, except that the combo cards are given
 * as their codes obtained via [phe](https://github.com/thlorenz/phe) `cardCodes`.
 */
function raceCodes(combo1, combo2, times) {
  return times == null ? raceCodesAll(combo1, combo2) : raceCodesRandom(combo1, combo2, times)
}

/**
 * Same as @see raceRange, except that the combo and range cards are given
 * as their codes obtained via [phe](https://github.com/thlorenz/phe) `cardCodes`.
 */
function raceRangeCodes(combo1, range, times) {
  var winCombo = 0
  var winRange = 0
  var tieBoth = 0
  for (var ci = 0; ci < range.length; ci++) {
    const combo2 = range[ci]
    const { win, loose, tie } = raceCodes(combo1, combo2, times)
    winCombo += win
    winRange += loose
    tieBoth += tie
  }
  return { win: winCombo, loose: winRange, tie: tieBoth }
}

/**
 * Races two combos against each other.
 *
 * @name raceCombos
 * @function
 * @param {Array.<string>} combo1 first combo to race i.e. `[ 'As', 'Ad' ]`
 * @param {Array.<string>} combo2 second combo to race i.e. `[ 'As', 'Ad' ]`
 * @param {Number} [times=null] the number of times to race, if not supplied combos are races against all possible boards
 * @return count of how many times combo1 wins, looses or ties, i.e. `{ win, loose, tie }`
 */
function raceCombos(combo1, combo2, times) {
  const comboCodes1 = cardCodes(combo1)
  const comboCodes2 = cardCodes(combo2)
  return raceCodes(comboCodes1, comboCodes2, times)
}

/**
 * Race the given combo vs. the given combo to count number of wins, losses and ties.
 *
 * @name raceRange
 * @function
 * @param {Array.<string>} combo to race i.e. `[ 'As', 'Ad' ]`
 * @param {Array.<Array.<string>> range multiple combos to raise against it, i.e. `[ [ 'Ks', 'Kd' ], [ 'Qs', 'Qd' ] ]`
 * @param {Number} [times=null] the number of times to race, if not supplied combos are races against all possible boards
 * @return count of how many times the combo wins, looses or ties, i.e. `{ win, loose, tie }`
 */
function raceRange(combo, range, times) {
  const comboCodes = cardCodes(combo)
  const rangeCodes = range.map(cardCodes)
  return raceRangeCodes(comboCodes, rangeCodes, times)
}

/**
 * Given win, loose and tie count it converts those to winning rates
 * in percent.
 *
 * @name rates
 * @function
 * @param {Object} $0
 * @param {Number} $0.win number of wins
 * @param {Number} $0.loose number of losses
 * @param {Number} $0.tie number of ties
 * @return {Object} win rates `{ winRate, looseRate, tieRate }
 */
function rates({ win, loose, tie }) {
  const total = win + loose + tie
  const winRate = Math.round(win / total * 100 * 100) / 100
  const looseRate = Math.round(loose / total * 100 * 100) / 100
  const tieRate = Math.round(tie / total * 100 * 100) / 100
  return { winRate, looseRate, tieRate }
}

module.exports = {
    raceCodes
  , raceRangeCodes
  , raceCombos
  , raceRange
  , rates
}
