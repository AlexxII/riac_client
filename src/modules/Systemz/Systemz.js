import React, { Fragment, useState } from 'react'
import Button from '@material-ui/core/Button';
import { parseSmiFile } from 'modules/PollResults/lib/utils';

const Systemz = () => {
  const [smiPool, setSmiPool] = useState([])
  const handleRawInput = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const fileData = reader.result
        const parsedData = parseSmiFile(fileData)
        setSmiPool(parsedData)
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
      {smiPool.map(smi => <p>{smi}</p>)}
    </Fragment>
  )
}

export default Systemz