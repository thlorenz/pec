const { cardsArrayMinusBlockers } = require('./common')

function getPermutations(flop1Max, flop2Max, flop3Max, turnMax, riverMax) {
  // I bet there is some sound mathematical way to do this, but am at a loss ATM
  // PRs welcome ;)
  var count = 0
  for (var flop1 = 0; flop1 < flop1Max; flop1++) {
    for (var flop2 = flop1 + 1; flop2 < flop2Max; flop2++) {
      for (var flop3 = flop2 + 1; flop3 < flop3Max; flop3++) {
        for (var turn = flop3 + 1; turn < turnMax; turn++) {
          for (var river = turn + 1; river < riverMax; river++) {
            count++
          }
        }
      }
    }
  }
  return count
}

// order of cards is not important to determine hand strength
function allPossibleFullBoardCodes(blockers) {
  const codes = cardsArrayMinusBlockers(blockers)
  const len = codes.length

  const flop1Max = len - 4
  const flop2Max = len - 3
  const flop3Max = len - 2
  const turnMax = len - 1
  const riverMax = len

  const permutations = getPermutations(flop1Max, flop2Max, flop3Max, turnMax, riverMax)
  const boards = new Uint8Array(permutations * 5)

  var i = 0
  for (var flop1 = 0; flop1 < flop1Max; flop1++) {
    for (var flop2 = flop1 + 1; flop2 < flop2Max; flop2++) {
      for (var flop3 = flop2 + 1; flop3 < flop3Max; flop3++) {
        for (var turn = flop3 + 1; turn < turnMax; turn++) {
          for (var river = turn + 1; river < riverMax; river++) {
            boards[i++] = codes[flop1]
            boards[i++] = codes[flop2]
            boards[i++] = codes[flop3]
            boards[i++] = codes[turn]
            boards[i++] = codes[river]
          }
        }
      }
    }
  }
  return boards
}

module.exports = { allPossibleFullBoardCodes }
