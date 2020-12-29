import React, { Fragment } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
}));

const CitiesUpload = () => {
  const classes = useStyles();

  const handleFileUpload = (e) => {
    e.preventDefault()
    // спиннер
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const csvText = reader.result
        console.log(csvText);
        // парсер csv
        // const xml = xmlparser(csvText)
      }
      reader.readAsText(file);
    }

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
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Загрузить
        </Button>
      </label>
      <Typography variant="caption" display="block" gutterBottom>
        Внимание! формат файла должен быть *.csv в кодировке utf-8
      </Typography>
    </Fragment>
  );
}

export default CitiesUpload