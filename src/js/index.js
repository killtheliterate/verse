// NPM
import yo from 'yo-yo'

// Browser
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia

window.AudioContext = window.AudioContext ||
                      window.webkitAudioContext

const $ = document.querySelector.bind(document)

const getUserMedia = options => new Promise((resolve, reject) =>
  navigator.getUserMedia(options, resolve, reject))

// View
// ----------------------------------------------------------------------------
const mic = yo`<audio id='mic' autoplay></audio>`

yo.update($('#app'), yo`
  <div>
    <h1>Verse</h1>
    ${mic}
  </div>
`)

const context = new window.AudioContext()

getUserMedia({audio: true})
  .then(context.createMediaStreamSource.bind(context))
  .then(function (mic) {
    mic.connect(context.destination)
  })
  .catch(console.error.bind(console))
