const { raceRange, raceRangeForBoard } = require('./')

function createMessage(win, loose, tie, iterations, combos, trackCombos) {
  // prefer numeric array message when possible
  if (!trackCombos) return [ win, loose, tie, iterations ]
  return {
      win: win
    , loose: loose
    , tie: tie
    , iterations
    , combos: Array.from(combos)
  }
}

function Worker(hub) {
  this._stopped = false
  this._onmessage = this._onmessage.bind(this)
  this._hub = hub
  this._hub.addEventListener('message', this._onmessage)
}

const proto = Worker.prototype

proto._onmessage = function _onmessage(e) {
  const {
      stop = false
    , combo
    , range
    , runAll
    , times
    , repeat
    , trackCombos
    , board = null
  } = JSON.parse(e.data)

  this._stopped = stop
  if (stop) return

  this._combo = combo
  this._range = range
  this._trackCombos = trackCombos
  this._board = board

  if (runAll) return this._runAll()

  this._win = 0
  this._loose = 0
  this._tie = 0
  if (trackCombos) this._combos = new Map()

  this._times = times
  this._repeat = repeat
  this._run()
}

proto._runAll = function _runAll() {
  const hasBoard = this._board != null

  const { win, loose, tie, combos } = hasBoard
    ? raceRangeForBoard(this._combo, this._range, null, this._trackCombos, this._board)
    : raceRange(this._combo, this._range, null, this._trackCombos)
  const msg = createMessage(win, loose, tie, 1, combos, this._trackCombos)
  this._hub.postMessage(msg)
}

proto._updateCombos = function _updateCombos(combos) {
  for (const combo of combos) {
    const k = combo[0]
    const v = combo[1]

    if (!this._combos.has(k)) this._combos.set(k, { win: 0, loose: 0, tie: 0 })
    const val = this._combos.get(k)
    val.win += v.win
    val.loose += v.loose
    val.tie += v.tie
  }
}

proto._run = function _run() {
  const self = this
  const combo = this._combo
  const range = this._range
  const board = this._board
  const hasBoard = board != null
  var i = 0
  function dorun() {
    const { win, loose, tie, combos } = hasBoard
      ? raceRangeForBoard(combo, range, self._times, self._trackCombos, board)
      : raceRange(combo, range, self._times, self._trackCombos)

    // Did we get a new request and are handling that currently?
    // If so cancel (forget about) the current one.
    // Also if we got stopped entirely we are done.
    if (self._stopped || combo !== self._combo || range !== self._range || board !== self._board) return

    // Otherwise update the data and send it up
    self._win += win
    self._loose += loose
    self._tie += tie
    if (self._trackCombos) self._updateCombos(combos)

    const msg = createMessage(
        self._win
      , self._loose
      , self._tie
      , i * self._times
      , self._combos
      , self._trackCombos
    )
    self._hub.postMessage(msg)

    // give messages a chance to process, so we can be stopped and/or
    // get a new task to do
    if (i++ <= self._repeat) setTimeout(dorun, 0)
  }
  dorun()
}

module.exports = function create(hub) {
  return new Worker(hub)
}
