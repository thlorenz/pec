'use strict'

const { cardCode } = require('phe')

const ranks = [ 'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2' ]
const suits = [ 'h', 's', 'd', 'c' ]

const allCardCodes = new Set()
for (var ri = 0; ri < ranks.length; ri++) {
  for (var si = 0; si < suits.length; si++) {
    allCardCodes.add(cardCode(ranks[ri], suits[si]))
  }
}

function cardsArrayMinusBlockers(blockers) {
  const cardCodes = new Set(allCardCodes)
  if (blockers != null && blockers.size > 0) {
    for (const v of blockers) cardCodes.delete(v)
  }
  return Array.from(cardCodes)
}

module.exports = { ranks, suits, allCardCodes, cardsArrayMinusBlockers }
