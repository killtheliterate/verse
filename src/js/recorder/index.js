// reducer //
// ------- //

const defaultState = {
  tracks: [],
  recording: false,
  monitoring: false
}

export const reducer = (context, recorder) => {
  const stream = context.createMediaStreamSource(recorder.stream)

  // This is how we get new recordings from the recorder.
  recorder.ondataavailable.addListener(function ({data}) {
    store.dispatch({type: "ADD_TRACK", data})
  })

  return function (state = defaultState, action) {
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
  }
}

// View //
// ---- //

import yo from "yo-yo"

const viewTrack = track => yo`
  <li><audio src=${window.URL.createObjectURL(track)} loop controls></audio></li>
`

export const view = (dispatch, state) => {
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
        ${state.tracks.map(viewTrack)}
      </ul>
    </div>
  `
}
