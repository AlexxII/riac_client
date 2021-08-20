import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button';

const Systemz = () => {
  const handleRawInput = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const fileData = reader.result
        console.log(fileData)
      }
    }
    reader.readAsText(file, 'cp1251');
    e.target.value = ""
  }


  return (
    <Fragment>
      <input
        accept="*.opr"
        id="contained-button-file"
        onInput={handleRawInput}
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          component="span"
          size="small"
        >
          Выбрать
        </Button>
      </label>
    </Fragment>
  )
}

export default Systemz