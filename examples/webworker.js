const { rates } = require('../')
const backgroundWorker = require('../pec.background')
const { expandRange, arryifyCombo } = require('../test/util/util')

const worker = backgroundWorker(onupdate)

const range = 'TT+, AK+, AQs+'
const combo = 'JhJs'
const expandedRange = expandRange(range)
const expandedCombo = arryifyCombo(combo)

const div = document.createElement('div')
document.body.append(div)

worker.raceRange(expandedCombo, expandedRange, 1E6)

function onupdate({ win, loose, tie, iterations }) {
  const { winRate, looseRate, tieRate } = rates({ win, loose, tie })
  div.innerHTML = `
    <h5>Combo: ${combo} vs. Range: ${range}</h5>
    <table>
      <thead>
        <tr>
          <td>Win</td>
          <td>Loose</td>
          <td>Tie</td>
          <td>Iterations</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${winRate}%</td>
          <td>${looseRate}%</td>
          <td>${tieRate}%</td>
          <td>${iterations}</td>
        </tr>
      </tbody>
    </table>
  `
}
