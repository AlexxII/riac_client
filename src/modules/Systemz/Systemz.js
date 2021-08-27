import React, { Fragment, useState } from 'react'
import Button from '@material-ui/core/Button';
import { parseSmiFile } from 'modules/PollResults/lib/utils';
import { footer, header } from './utilz/temaplare_1';
const iconvlite = require('iconv-lite')

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

  // преобразование кодировки
  const utfToCP1251 = (data) => {
    const buf = Buffer.from(data);
    // const buff = iconvlite.decode(buf, 'utf8');
    const result = iconvlite.encode(buf, 'cp1251')
    return result
  }


  const downloadIt = () => {
    const fileName = 'export.htm'
    let data = `${header}`

    console.log(smiPool)
    smiPool.map((item, index) => {

      data += item.mainText
      data += `<br>`
    })
    data += `${footer}`

    // преобразование кодировки
    const cp1251Text = utfToCP1251(data)

    const element = document.createElement('a')
    const file = new Blob([cp1251Text], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
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
      <Button
        variant="contained"
        color="primary"
        component="span"
        size="small"
        onClick={downloadIt}
      >
        Сохранить
      </Button>

      {/* {smiPool.map(smi => <p>{smi.maintext}</p>)} */}
    </Fragment>
  )
}

export default Systemz