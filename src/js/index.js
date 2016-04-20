// Prettify Browser APIs
navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.mediaDevices.getUserMedia ||
  navigator.msGetUserMedia
)
const $ = document.querySelector.bind(document)
const getUserMedia = opts =>
  new Promise((resolve, reject) =>
    navigator.getUserMedia(opts, resolve, reject))

// Browser Compatibility Stuff
if (!navigator.getUserMedia) {
  throw new Error("getUserMedia not supported on your browser!")
}
console.log("getUserMedia supported.")

import yo from "yo-yo"
import { createStore } from "redux"

const context = window.context =
  new (window.AudioContext || window.webkitAudioContext)()

const app = $("#app")

const Store = recorder => {
  const defaultState = {
    tracks: [],
    recording: false,
    monitoring: false
  }
  const stream = context.createMediaStreamSource(recorder.stream)
  const store = createStore(function (state = defaultState, action) {
    switch (action.type) {

      case "MONITOR_MIC":
        state.monitoring = action.data

        if (state.monitoring) stream.connect(context.destination)
        else stream.disconnect(context.destination)

        return state

      case "START_RECORDING":

        recorder.start()
        state.recording = true

        return state

      case "STOP_RECORDING":

        recorder.stop()
        state.recording = false

        return state

      case "ADD_TRACK":

        state.tracks.push(action.data)

        return state

      default:
        return state
    }
  })

  // Events
  recorder.ondataavailable = function ({data}) {
    store.dispatch({type: "ADD_TRACK", data})
  }

  return store
}

const viewTrack = track => yo`
  <audio src=${window.URL.createObjectURL(track)} controls></audio>
`

const view = (dispatch, state) => {
  const start = () => dispatch({type: "START_RECORDING"})
  const stop = () => dispatch({type: "STOP_RECORDING"})

  const monitor = bool => dispatch({type: "MONITOR_MIC", data: bool})

  return yo`
    <div>
      <button onclick=${state.recording ? stop : start }>
        ${state.recording ? "stop recording" : "record" }
      </button>

      <button onclick=${() => monitor(!state.monitoring) }>
        ${state.monitoring ? "stop monitoring" : "monitor" }
      </button>

      <ul>
        ${state.tracks.map(viewTrack).map(a => yo`<div>${a}</div>`)}
      </ul>
    </div>
  `
}

// Start //
// ----- //
getUserMedia({audio: true})
  .then(stream => Store(new MediaRecorder(stream)))
  .then(function (store) {
    window.store = store

    const dispatch = store.dispatch.bind(store)

    store.subscribe(() => {
      yo.update(app, view(dispatch, store.getState()))
    })
    yo.update(app, view(dispatch, store.getState()))
  })
