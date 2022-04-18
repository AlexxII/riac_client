import React, { Fragment, useState } from 'react'
import Button from '@material-ui/core/Button';
import { parseSmiFile, parseClist } from '../../modules/PollResults/lib/utils';
import { footer, header } from './utilz/temaplare_1';

const iconvlite = require('iconv-lite')
const JSZip = require('jszip')

const Systemz = () => {
  const [smiPool, setSmiPool] = useState([])
  const [clistPool, setClistPool] = useState(false)

  // zip add from system-m - not working fun with win1251 encoding
  const handleZipAdd = (e) => {
    e.preventDefault()
    const file = e.target.files[0];
    const outPutData = []
    JSZip.loadAsync(file)
      .then(function (zip) {
        Object.keys(zip.files).forEach(function (filename) {
          zip.files[filename].async('string').then(function (fileData) {
            outPutData.push(fileData)
            // const buf = Buffer.from(fileData);
            // const utf8Text = iconvlite.decode(buf, 'utf8')
          })
        })
      })
  }

  const handleRawInput = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const fileData = reader.result
        const parsedData = parseSmiFile(fileData)
        const sortedData = parsedData.sort((a, b) => (a.publicDateTimestamp < b.publicDateTimestamp) ? -1 : 1)
        console.log(parsedData)
        setSmiPool(parsedData)
      }
    }
    reader.readAsText(file, 'cp1251');
    e.target.value = ""
  }

  const monthPool = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ]

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
    smiPool.map((item, index) => {
      if (item.mainText) {
        const smiTitle = clistPool[item.smiCodeText]
        const dd = item.publicDateText.match(/(\d{4})-(\d{2})-(\d{2})/)
        const day = dd[3].replace(/^0+/, '')
        const month = dd[2].replace(/^0+/, '')
        const year = dd[1]
        const monthText = monthPool[month - 1]

        data += `<p style= 'text-transform: uppercase'><b><i>${item.titleText}</i></b></p>`
        data += item.mainText
        data += `<p></p>`
        data += `<p><i><b>${day} ${monthText} ${year} года, &quot;${smiTitle}&quot;</i></b></p>`
        data += `<p></p>`
        data += `<br>`
      }
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

  const loadClist = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const fileData = reader.result
        const parsedData = parseClist(fileData)
        setClistPool(parsedData)
      }
    }
    reader.readAsText(file, 'cp1251');
    e.target.value = ""
  }

  return (
    <Fragment>
      <input
        accept="*.opr"
        disabled={!clistPool}
        id="contained-button-file"
        onInput={handleRawInput}
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button
          disabled={!clistPool}
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
      <input
        style={{ display: 'none' }}
        accept="*.*"
        id="contained-button-file-clist"
        onInput={loadClist}
        type="file"
      />
      <label htmlFor="contained-button-file-clist">
        <Button
          variant="contained"
          color="primary"
          component="span"
          size="small"
        >
          сlist
        </Button>
      </label>
    </Fragment>
  )
}

export default Systemz