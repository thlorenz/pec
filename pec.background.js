const work = require('webworkify')
const workerBlob = require('./pec.worker')
const stopMsg = JSON.stringify({ stop: true })

class BackgroundWorker {
  constructor(update) {
    this._update = update
    this._worker = work(workerBlob)
    this._onresult = this._onresult.bind(this)
    this._stopped = true
    this._worker.addEventListener('message', this._onresult)
  }

  /**
  *
  * @name BackgroundWorker.raceRange
  * @function
  * @param {Array.<string>} combo to race i.e. `[ 'As', 'Ad' ]`
  * @param {Array.<Array.<string>> range multiple combos to raise against it, i.e. `[ [ 'Ks', 'Kd' ], [ 'Qs', 'Qd' ] ]`
  * @param {Number} total the total number of times to race, `100` are processed
  * each time and `update` invoked until the `total` is reached
  */
  raceRange(combo, range, total) {
    this._stopped = false
    // let's do 100 at a time to come back with at least some result quickly
    // progress communication is a simple array with 3 elements which shouldn't add too much overload
    const times = Math.min(total, 100)
    const repeat = Math.round(total / times)
    this._worker.postMessage(JSON.stringify({ combo, range, times, repeat }))
  }

  /**
   * Stops any races in progress.
   *
   * @name BackgroundWorker.stop
   * @function
   */
  stop() {
    if (this._stopped) return
    this._stopped = true
    this._worker.postMessage(stopMsg)
  }

  _onresult(e) {
    if (this._stopped) return
    const [ win, loose, tie, iterations ] = e.data
    this._update({ win, loose, tie, iterations })
  }
}

/**
 * Creates a background worker which uses a web worker
 * under the hood to process _race_ requests.
 *
 * @name createBackgroundWorker
 * @function
 * @param {funcion} update will be called with updates: `{ win, loose, tie, iterations }`
 * @return {BackgroundWorker} backgroundWorker
 */
module.exports = function createBackgroundWorker(update) {
  return new BackgroundWorker(update)
}
