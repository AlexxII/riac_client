import React, { Fragment, useState } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import xmlparser from '../../lib/xmlparser'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ParchaXmlAnalyzer = () => {
  const [parchaData, setParchaData] = useState(null)
  const [processing, setProcessing] = useState(false)
  const classes = useStyles();

  const handleInput = (e) => {
    e.preventDefault()
    setProcessing(true)
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const xmlText = reader.result
        const xml = xmlparser(xmlText)
        if (xml) {
          const preData = prepareData(xml)
          analyzeData(preData)
          // setParchaData(xml)
          setProcessing(false)
          return
        } else {
          setProcessing(false)
          console.log('Неправильный формат XML');
          return
        }
      }
      reader.readAsText(file);
    }
  }

  const analyzeData = (data) => {
    for (let key in data) {
      const mainData = data[key]
      const dd = mainData.reduce((acum, item) => {
        if (item.answers.length) {
          if (!acum[item.answers[0]]) {
            acum[item.answers[0]] = 1
          } else {
            acum[item.answers[0]] = acum[item.answers[0]] + 1
          }
        }
        return acum
      }, {})
      console.log(key)
      console.log(dd)
    }
  }

  const prepareData = (data) => {
    const upResult = data.reduce((acum, item) => {
      const parchId = item.unit
      if (!acum.hasOwnProperty(parchId)) {
        acum[parchId] = []
      }
      acum[parchId].push(item)
      return acum
    }, {})
    return upResult
  }

  const UnitInfo = ({ data }) => {
    // console.log(data);
    if (data.lan !== '' || data.lon !== '') {
      return data.answers.toString() + ',999'
    } else {
      return data.answers.toString() + ',999' + '-'
    }
  }

  const resetData = () => {
    setParchaData(null)
  }

  return (
    <Fragment>
      <span style={{ paddingRight: '10px' }}>
        <Button variant="outlined" onClick={resetData}>СБРОС</Button>
      </span>
      <Backdrop className={classes.backdrop} open={processing} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <input
        type="file"
        onInput={handleInput}
      />
      <div className="parcha-results">
        {parchaData ?
          parchaData.map((result, i) => (
            <div>
              {<UnitInfo data={result} />}
            </div>
          )) : <p>Подгрузите данные</p>
        }
      </div>
    </Fragment>
  )
}

export default ParchaXmlAnalyzer