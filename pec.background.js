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

  raceRange(combo, range, total) {
    this._stopped = false
    // let's do 100 at a time to come back with at least some result quickly
    // progress communication is a simple array with 3 elements which shouldn't add too much overload
    const times = Math.min(total, 100)
    const repeat = Math.round(total / times)
    this._worker.postMessage(JSON.stringify({ combo, range, times, repeat }))
  }

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

module.exports = function create(update) {
  return new BackgroundWorker(update)
}
