// Browser APIs //
// ------------ //

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

const context = new (window.AudioContext || window.webkitAudioContext)()

// VERSE //
// ----- //

import yo from "yo-yo"
import { createStore } from "redux"

import * as recorder from "./recorder"

const app = $("#app")

// INPUTS
getUserMedia({audio: true})
  .then(stream => new MediaRecorder(stream))

  // Store
  .then(rec => createStore(recorder.reducer(context, rec)))

  // OUTPUTS
  .then(function (store) {

    window.store = store

    const dispatch = store.dispatch.bind(store)

    store.subscribe(() => {
      yo.update(app, recorder.view(dispatch, store.getState()))
    })
    yo.update(app, recorder.view(dispatch, store.getState()))

  })
