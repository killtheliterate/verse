// reducer //
// ------- //

const defaultState = {
  files: []
}

export const reducer = () => (state = defaultState, {type, payload}) => {
  switch (type) {

    case "verse/upload/files":
      return Object.assign({}, state, {
        files: state.files.concat([payload])
      })

    default: return Object.assign({}, state)

}}

// view //
// ---- //

import yo from 'yo-yo'

const viewFile = file => yo`
  <li>
    <h2>${file.name}</h2>
    <audio src=${window.URL.createObjectURL(file)} loop controls></audio>
  </li>
`

export const view = (dispatch, {upload}) => yo`
  <div>
    <input type="file"
           id="input"
           accepts="audio/*"
           onchange=${function () {
             dispatch({type: 'verse/upload/files', payload: this.files[0]})
           }}
    ></input>

    <ul>
      ${upload.files.map(viewFile)}
    </ul>
  </div>
`

