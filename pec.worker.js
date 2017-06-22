const { raceRange } = require('./')

class Worker {
  constructor(hub) {
    this._stopped = false
    this._onmessage = this._onmessage.bind(this)
    this._hub = hub
    this._hub.addEventListener('message', this._onmessage)
  }

  _onmessage(e) {
    const { stop = false, combo, range, times, repeat } = JSON.parse(e.data)
    this._stopped = stop
    if (stop) return

    this._combo = combo
    this._range = range
    this._times = times
    this._repeat = repeat
    this._win = 0
    this._loose = 0
    this._tie = 0

    this._run()
  }

  _run() {
    const self = this
    const combo = this._combo
    const range = this._range
    var i = 0
    function dorun() {
      const { win, loose, tie } = raceRange(combo, range, self._times)
      // Did we get a new request and are handling that currently?
      // If so cancel (forget about) the current one.
      // Also if we got stopped entirely we are done.
      if (self._stopped || combo !== self._combo || range !== self._range) return

      // Otherwise update the data and send it up
      self._win += win
      self._loose += loose
      self._tie += tie

      self._hub.postMessage([ self._win, self._loose, self._tie, i * self._times ])

      // give messages a chance to process, so we can be stopped and/or
      // get a new task to do
      if (i++ <= self._repeat) setTimeout(dorun, 0)
    }
    dorun()
  }
}

module.exports = function create(hub) {
  return new Worker(hub)
}
