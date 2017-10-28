'use strict'

const { rates } = require('../')
const assert = require('assert')
const backgroundWorker = require('../pec.background')
const { expandRange, arryifyCombo } = require('../test/util/util')

const worker = backgroundWorker(onupdate)

const range = 'TT+, AK+, AQs+'
const combo = 'JhJs'
const expandedRange = expandRange(range)
const expandedCombo = arryifyCombo(combo)

const div = document.createElement('div')
document.body.append(div)

const trackCombos = true
const raceId = worker.raceRange(expandedCombo, expandedRange, 1E6, trackCombos)

function onupdate({ win, loose, tie, iterations, combos, uid }) {
  assert.equal(raceId, uid, 'uid in response needs to match id of initiated race')
  const { winRate, looseRate, tieRate, combos: comboRates } = rates({
      win
    , loose
    , tie
    , combos
  })

  var comboRows = ''
  for (const [ k, { winRate, looseRate, tieRate } ] of comboRates) {
    comboRows += (
      `<tr>
        <td>${k}
        <td>${winRate}%</td>
        <td>${looseRate}%</td>
        <td>${tieRate}%</td>
      </tr>`
    )
  }

  div.innerHTML = `
    <h5>Combo: ${combo} vs. Range: ${range}</h5>
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
        ${comboRows}
      </tbody>
    </table>
  `
}
