'use strict'

const { rates } = require('../')
const backgroundWorker = require('../pec.background')
const { expandRange, arryifyCombo } = require('../test/util/util')

const worker = backgroundWorker(onupdate)

const range = 'TT+, AK+, AQs+'
const combo = 'JhJs'
const expandedRange = expandRange(range)
const expandedCombo = arryifyCombo(combo)
const board = '8s Th 9d'.split(' ')

const div = document.createElement('div')
document.body.append(div)

const trackCombos = false
worker.raceRange(expandedCombo, expandedRange, 1E6, trackCombos, board)

function onupdate({ win, loose, tie, iterations, combos }) {
  const { winRate, looseRate, tieRate } = rates({
      win
    , loose
    , tie
    , combos
  })

  div.innerHTML = `
    <h5>Combo: ${combo} vs. Range: ${range} on Flop: ${board}</h5>
    <table>
      <thead>
        <tr>
          <td>Combo</td>
          <td>Win</td>
          <td>Loose</td>
          <td>Tie</td>
          <td>Iterations</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>All</td>
          <td>${winRate}%</td>
          <td>${looseRate}%</td>
          <td>${tieRate}%</td>
          <td>${iterations}</td>
        </tr>
      </tbody>
    </table>
  `
}
