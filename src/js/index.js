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
import { createStore } from 'redux'

window.context = new (window.AudioContext || window.webkitAudioContext)()

const app = $('#app')

const Store = recorder => {
  const defaultState = {
    tracks: [],
  }
  const store = createStore(function (state = defaultState, action) {
    switch (action.type) {

      case "START_RECORDING":

        recorder.start()
        console.log(recorder.state)

        return state
        break

      case "STOP_RECORDING":

        recorder.stop()
        console.log(recorder.state)

        return state
        break

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

const view = (dispatch, state) => yo`
  <div>
    ${state.tracks.map(viewTrack)}
  </div>
`

// Start //
// ----- //
getUserMedia({audio: true})
  .then(stream => Store(new MediaRecorder(stream)))
  .then(function (store) {
    window.store = store

    const dispatch = store.dispatch.bind(store)

    store.subscribe(() => {
      yo.update(app,  view(dispatch, store.getState()))
    })
    yo.update(app,  view(dispatch, store.getState()))
  })
