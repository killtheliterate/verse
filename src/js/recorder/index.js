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
  recorder.ondataavailable = function ({data}) {
    store.dispatch({type: "verse/recorder/addTrack", data})
  }

  return function (state = defaultState, action) {
    switch (action.type) {

      case "verse/recorder/monitor":

        if (action.data) stream.connect(context.destination)
        else stream.disconnect(context.destination)

        return Object.assign({}, state, {
          monitoring: action.data
        })

      case "verse/recorder/start":

        recorder.start()

        return Object.assign({}, state, {
          recording: true
        })

      case "verse/recorder/stop":

        recorder.stop()

        return Object.assign({}, state, {
          recording: false
        })

      case "verse/recorder/addTrack":

        return Object.assign({}, state, {
          tracks: state.tracks.concat([action.data])
        })

      default:
        return state
    }
  }
}

// View //
// ---- //

import yo from "yo-yo"

const viewTrack = track => yo`
  <li>
    <audio src=${window.URL.createObjectURL(track)} loop controls></audio>
  </li>
`

export const view = (dispatch, {recorder}) => {
  const start = () => dispatch({type: "verse/recorder/start"})
  const stop = () => dispatch({type: "verse/recorder/stop"})

  const monitor = bool => dispatch({type: "verse/recorder/monitor", data: bool})

  return yo`
    <div>
      <button onclick=${recorder.recording ? stop : start }>
        ${recorder.recording ? "stop recording" : "record" }
      </button>

      <button onclick=${() => monitor(!recorder.monitoring) }>
        ${recorder.monitoring ? "stop monitoring" : "monitor" }
      </button>

      <ul>
        ${recorder.tracks.map(viewTrack)}
      </ul>
    </div>
  `
}
