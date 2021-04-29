import React, { useRef, Fragment, useState } from 'react'
import Typography from "@material-ui/core/Typography"
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';

import xmlparser from '../../lib/utils'
import { pollTypes, pollWays } from '../../lib/constants'

const iconvlite = require('iconv-lite')

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const XmlImport = ({ field, ...props }) => {
  const { errorMessage, touched, setFieldValue } = props;
  const { name, value, onChange, onBlur } = field;
  const [processing, setProcessing] = useState(false)
  const [file, setFile] = useState(undefined)
  const [count, setCount] = useState(0)
  const classes = useStyles();
  const fileUpload = useRef();
  let fileReader

  const upload = () => {
    if (fileUpload) {
      fileUpload.current.click();
    }
  }

  var CHARSET_RE = /charset=([\w-]+)/i;

  const handleChg = (e) => {
    e.preventDefault()

    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      setProcessing(true)
      reader.onloadend = () => {
        const xmlText = reader.result
        // преобразуем к utf8
        const buf = Buffer.from(xmlText);
        const utf8Text = iconvlite.decode(buf, 'utf8')

        const xml = xmlparser(utf8Text)
        if (xml) {
          setProcessing(false)
          const regEx = /^(\d{2}).(\d{2}).(\d{4})$/;
          setFieldValue('title', xml.title)
          setFieldValue('startdate', xml.start.replace(regEx, `$3-$2-$1`))
          setFieldValue('enddate', xml.end.replace(regEx, `$3-$2-$1`))
          setFieldValue('code', xml.code)
          setFieldValue('xmlfile', file)
          if (xml.code && xml.code.slice(0, 3) === 'ROS') {
            setFieldValue('type', 0)
          }
          setFieldValue('way', 0)
        } else {
          setProcessing(false)
          console.log('Неправильный формат XML');
          setFieldValue('title', '')
          setFieldValue('startdate', '')
          setFieldValue('enddate', '')
          setFieldValue('code', '')
          setFieldValue('xmlfile', null)
          return
        }
      }
      reader.readAsText(file, 'cp1251');
    } else {
      setFieldValue('xmlfile', null)
    }
  }

  return (
    <Fragment>
      <Backdrop className={classes.backdrop} open={processing} >
        <CircularProgress color="inherit" />
      </Backdrop>

      <input
        style={{ display: 'none' }}
        id={name}
        name={name}
        type="file"
        id={name}
        ref={fileUpload}
        onBlur={onBlur}
        onInput={handleChg}
      />
      <FormControl fullWidth>
        <Button
          variant="contained"
          color="default"
          startIcon={<PublishIcon />}
          onClick={upload}
        >
          XML
        </Button>
        {errorMessage ? (
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
        )
          :
          <FormHelperText>Подгрузите файл конфигурации в формате XML</FormHelperText>
        }
      </FormControl>
    </Fragment>
  )
}

export default XmlImport