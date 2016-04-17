navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.mediaDevices.getUserMedia ||
  navigator.msGetUserMedia
)

if (!navigator.getUserMedia) {
  throw new Error("getUserMedia not supported on your browser!")
}
console.log("getUserMedia supported.");

// NPM
import yo from "yo-yo"

const getUserMedia = opts =>
  new Promise((resolve, reject) =>
    navigator.getUserMedia(opts, resolve, reject))

getUserMedia({audio: true})
  .then(stream => new MediaRecorder(stream))
  .then(recorder => view({recorder}))


const view = ({recorder}) =>
  yo.update(document.getElementById('app'), yo`
    <div>
      <button onclick=${function () {
        recorder.start()
        console.log(recorder.state)
        console.log("recorder started")
      }}>Record</button>

      <button onclick=${function () {
        recorder.stop()
        console.log(recorder.state)
        console.log("recorder stopped")
      }}>Stop</button>
    </div>
  `)
