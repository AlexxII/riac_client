import React, { Fragment, useState } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import WarShow from '../WarShow'
import CsvShow from '../CsvShow'

import { makeStyles } from '@material-ui/core/styles';
import { pensParser, warior, processLists, compareDates } from '../../lib/txtparser'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const WordAnalyzer = () => {
  const [pensData, setPensData] = useState(null)
  const [warData, setWarData] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [errorMessage, setMessage] = useState(null)
  const [ready, setReady] = useState(null)
  const [processedData, setProcessedData] = useState(null)
  const [finalData, setFinalData] = useState(null)
  const classes = useStyles();

  const handleInput = (e) => {
    e.preventDefault()
    setMessage(null)
    setProcessing(true)
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const wordText = reader.result
        const data = pensParser(wordText)
        setPensData(data)
        setProcessing(false)
      }
    }
    reader.readAsText(file);
  }

  const handleWarInput = (e) => {
    e.preventDefault()
    setMessage(null)
    setProcessing(true)
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const wordText = reader.result
        const data = warior(wordText)
        setWarData(data)
        setProcessing(false)
      }
    }
    reader.readAsText(file);
  }

  const process = () => {
    if (pensData && warData) {
      setMessage(null)
      const pData = processLists(warData, pensData)
      setProcessedData(pData)
      setReady(true)
    } else {
      setMessage('Не все данные подгружены')
    }
  }

  const processEx = () => {
    if (ready) {
      const itrestPerson = compareDates(processedData)
      console.log(itrestPerson);
      setFinalData(itrestPerson)
    } else {
      if (pensData && warData) {
        setMessage('Сперва нужно обработать')
      } else {
        setMessage('Не все данные подгружены')
      }
    }
  }

  const UnitInfo = ({ data }) => {
    console.log(data);
  }

  return (
    <Fragment>
      <Backdrop className={classes.backdrop} open={processing} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={3}>
        <Grid item xs>
          <Box>
            <label>Список военных</label>
            <br />
            <input
              type="file"
              onInput={handleWarInput}
            />
          </Box>
        </Grid>
        <Grid item xs>
          <Box>
            <label>Список песионного фонда</label>
            <br />
            <input
              type="file"
              onInput={handleInput}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={process}>
            Обработать
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={processEx}>
            Сравнить даты
          </Button>
        </Grid>
      </Grid>
      <p></p>
      {errorMessage ?
        <Alert severity="error">{errorMessage}</Alert>
        :
        <p></p>
      }
      <div className="parcha-results">
        {finalData ?
          <WarShow data={finalData} />
          : <p></p>
        }
      </div>
    </Fragment>
  )
}

export default WordAnalyzer