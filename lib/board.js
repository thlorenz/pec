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

function getPermutationsFlop(turnMax, riverMax) {
  var count = 0
  for (var turn = 0; turn < turnMax; turn++) {
    for (var river = turn + 1; river < riverMax; river++) {
      count++
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

function allPossibleTurnAndRiverBoardCodes(blockers, boardCodes) {
  // assumes that the given boardCodes has exactly 3 cards
  // and that they are already included in the blockers
  const flop1Code = boardCodes[0]
  const flop2Code = boardCodes[1]
  const flop3Code = boardCodes[2]

  const codes = cardsArrayMinusBlockers(blockers)
  const len = codes.length

  const turnMax = len - 1
  const riverMax = len

  const permutations = getPermutationsFlop(turnMax, riverMax)
  const boards = new Uint8Array(permutations * 5)

  var i = 0
  for (var turn = 0; turn < turnMax; turn++) {
    for (var river = turn + 1; river < riverMax; river++) {
      boards[i++] = flop1Code
      boards[i++] = flop2Code
      boards[i++] = flop3Code
      boards[i++] = codes[turn]
      boards[i++] = codes[river]
    }
  }
  return boards
}

function allPossibleRiverBoardCodes(blockers, boardCodes) {
  // assumes that the given boardCodes has exactly 4 cards
  // and that they are already included in the blockers
  const flop1Code = boardCodes[0]
  const flop2Code = boardCodes[1]
  const flop3Code = boardCodes[2]
  const turnCode  = boardCodes[3]

  const codes = cardsArrayMinusBlockers(blockers)
  const len = codes.length
  const permutations = len
  const riverMax = len
  const boards = new Uint8Array(permutations * 5)

  var i = 0
  for (var river = 0; river < riverMax; river++) {
    boards[i++] = flop1Code
    boards[i++] = flop2Code
    boards[i++] = flop3Code
    boards[i++] = turnCode
    boards[i++] = codes[river]
  }
  return boards
}

function allPossiblePostFlopBoardCodes(blockers, boardCodes) {
  const bs = new Set(blockers)
  for (var i = 0; i < boardCodes.length; i++) bs.add(boardCodes[i])

  // only supporting flop and turn cases
  const len = boardCodes.length

  if (len < 3 || len > 5) {
    throw new Error('Only supporting flop(3) or turn(4) or just returning river(5), but given ' + len)
  }

  // River
  if (len === 5) return boardCodes

  return len === 3
    ? allPossibleTurnAndRiverBoardCodes(bs, boardCodes)
    : allPossibleRiverBoardCodes(bs, boardCodes)
}

module.exports = {
    allPossibleFullBoardCodes
  , allPossiblePostFlopBoardCodes
}
