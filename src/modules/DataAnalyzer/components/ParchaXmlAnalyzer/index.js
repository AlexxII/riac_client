import React, { Fragment, useState } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

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
          setParchaData(xml)
          console.log(`Количество ответов - ${xml.length}`);
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

  const UnitInfo = ({ data }) => {
    if (data.lan !== '' && data.lon !== '') {
      return data.answers.toString() + ',999'
    } else {
      return data.answers.toString() + `,999 - нет координат`
    }
  }

  return (
    <Fragment>
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
              { <UnitInfo data={result} />}
            </div>
          )) : <p>Подгрузите данные</p>
        }
      </div>
    </Fragment>
  )
}

export default ParchaXmlAnalyzer