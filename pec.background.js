'use strict'

const work = require('webworkify')
const now = Date.now
const workerBlob = require('./pec.worker')
const stopMsg = JSON.stringify({ stop: true })

function readMessage(msg, trackCombos) {
  if (!trackCombos) {
    const [ win, loose, tie, iterations, uid ] = msg
    return { win, loose, tie, iterations, uid }
  }
  const { win, loose, tie, iterations, combos, uid } = msg
  return { win, loose, tie, iterations, combos: new Map(combos), uid }
}

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
  * @param {Boolean} [trackCombos=false] if `true` the counts for each combos are tracked
  * @param {Array.<string>} [board=null] if supplied the range will be raced
  * against subsets boards that include all cards of the given board
  * @return {Number} the uid generated to identify this background job,
  * the same uid will be included in the message the result to identify it with the job
  */
  raceRange(combo, range, total, trackCombos, board) {
    this._trackCombos = !!trackCombos
    this._stopped = false
    const runAll = total == null
    const uid = now()
    if (runAll) {
      const msg = JSON.stringify({ combo, range, runAll, trackCombos: this._trackCombos, board, uid })
      this._worker.postMessage(msg)
    } else {
      // let's do 100 at a time to come back with at least some result quickly
      // progress communication is a simple array with 3 elements which shouldn't add too much overload
      const times =  Math.min(total, 100)
      const repeat = Math.round(total / times)
      const msg = JSON.stringify({
          combo
        , range
        , runAll
        , times
        , repeat
        , trackCombos: this._trackCombos
        , board
        , uid
      })
      this._worker.postMessage(msg)
    }
    return uid
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
    const res = readMessage(e.data, this._trackCombos)
    this._update(res)
  }
}

/**
 * Creates a background worker which uses a web worker
 * under the hood to process _race_ requests.
 *
 * @name createBackgroundWorker
 * @function
 * @param {funcion} update will be called with updates: `{ win, loose, tie, iterations, uid }`
 * @return {BackgroundWorker} backgroundWorker
 */
module.exports = function createBackgroundWorker(update) {
  return new BackgroundWorker(update)
}
