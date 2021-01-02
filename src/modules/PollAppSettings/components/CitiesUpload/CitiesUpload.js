import React, { Fragment, useState } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  footerText: {
    marginTop: '10px'
  },
  button: {
    margin: '0 5px 5px 0',
  }
}));

const CitiesUpload = ({ setCityPool }) => {
  const classes = useStyles();
  const [infoMessage, setInfoMessage] = useState(null)

  const handleFileUpload = (e) => {
    e.preventDefault()
    // спиннер
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const csvText = reader.result
        const pool = csvParser(csvText)
        setCityPool(pool)
        setInfoMessage(`${pool.length} населенных пунктов`)
      }
      reader.readAsText(file);
    }
  }

  const csvParser = (text) => {
    const poolOfCities = text.split('\n')
    let resultPool = []
    const lPoolOfCities = poolOfCities.length
    for (let i = 0; i < lPoolOfCities; i++) {
      const cityInfo = poolOfCities[i].split(';')
      const city = {
        order: +cityInfo[0],
        title: cityInfo[1],
        type: cityInfo[2],
        population: +cityInfo[3],
        category: cityInfo[4]
      }
      resultPool.push(city)
    }
    return resultPool
  }

  return (
    <Fragment>
      <Typography variant="body1" gutterBottom>
        Чтобы импортировать населенные пункты, выберите файл CSV.
      </Typography>
      <input
        accept=".csv"
        className={classes.input}
        onInput={handleFileUpload}
        id="contained-button-file"
        type="file"
      />
      <Grid container
        direction="row"
        justify="flex-start"
        alignItems="center">
        <Box sm={6} className={classes.button}>
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Выбрать файл
            </Button>
          </label>
        </Box>
        <Box sm={6}>
          {infoMessage ?
            <Alert variant="outlined" severity="info">
              {infoMessage}
            </Alert>
            :
            null
          }
        </Box>
      </Grid>
      <Typography className={classes.footerText}
        variant="caption" display="block" gutterBottom>
        Внимание! формат файла должен быть *.csv в кодировке utf-8
      </Typography>
    </Fragment>
  );
}

export default CitiesUpload