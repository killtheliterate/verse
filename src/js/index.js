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
import { createStore, combineReducers } from "redux"

import * as recorder from "./recorder"
import * as upload from "./upload"

const app = $("#app")

// INPUTS
getUserMedia({audio: true})
  .then(stream => new MediaRecorder(stream))

  // Store
  .then(rec => createStore(combineReducers({
    recorder: recorder.reducer(context, rec),
    upload: upload.reducer()
  })))

  // OUTPUTS
  .then(function (store) {

    window.store = store

    const dispatch = store.dispatch.bind(store)

    let v = (dispatch, state) => yo`
      <div>
        ${recorder.view(dispatch, state)}
        ${upload.view(dispatch, state)}
      </div>
    `

    store.subscribe(() => {
      yo.update(app, v(dispatch, store.getState()))
    })
    yo.update(app, v(dispatch, store.getState()))

  })
