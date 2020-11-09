import React, { useRef, useEffect, useState } from 'react'
import Typography from "@material-ui/core/Typography"
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import Badge from '@material-ui/core/Badge';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import xmlparser from '../../lib/utils'

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

  const handleChg = (e) => {
    e.preventDefault()
    setProcessing(true)
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const xmlText = reader.result
        const xml = xmlparser(xmlText)
        if (xml) {
          setProcessing(false)
          const regEx = /^(\d{2}).(\d{2}).(\d{4})$/;
          setFieldValue('title', xml.title)
          setFieldValue('startdate', xml.start.replace(regEx, `$3-$2-$1`))
          setFieldValue('enddate', xml.end.replace(regEx, `$3-$2-$1`))
          setFieldValue('code', xml.code)
          setFieldValue('xmlfile', file)
        } else {
          console.log('Неправильный формат XML');
          setFieldValue('mainconfig', '')
          return
        }
      }
      reader.readAsText(file);
    }
  }

  return (
    <React.Fragment>
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
        // onChange={handleChange}
        onInput={handleChg}
      />
      <Badge
        color="secondary"
        badgeContent={count}
        style={{ top: '5px' }}
      >
        <Button
          variant="contained"
          color="default"
          startIcon={<PublishIcon />}
          onClick={upload}
        >
          XML
        </Button>
      </Badge>
      {errorMessage ? (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      ) : null}
    </React.Fragment>
  )
}

export default XmlImport