import React, { Fragment, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Slider from '@material-ui/core/Slider';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_USER_SETTINGS } from './queries'

const UserPollSettings = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [city, setCity] = useState(false)
  const [auto, setAuto] = useState(true)

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 300,
      label: '300 мс.'
    },
    {
      value: 1000,
      label: '1 сек.',
    },
    {
      value: 2000,
      label: '2 сек.',
    },
  ];

  const Loading = () => {
    if (false === true)
      return (
        < LoadingState />
      )
    return null
  }

  const delayText = (e) => {
    console.log(e);
    return
  }

  const handleAutoChange = (e) => {
    console.log(e);
    setAuto(!auto)
    return
  }

  const handleCityAgainChange = () => {
    setCity(!city)
  }


  return (
    <Fragment>
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Loading />
      <div className="category-service-zone">
        <Typography variant="h5" gutterBottom className="header">Подсистема опросов</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Пользовательские настройки подсистемы "Опросы".
        </Typography>
      </div>
      <Grid container className="user-poll-setting-zone">
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormGroup className="form-group-zone">
              <FormControlLabel
                control={<Switch checked={city} onChange={handleCityAgainChange} name="gilad" />}
                label="Повтор города"
              />
              <FormHelperText>Повторять диалоговое окно ввода города при каждой итерации</FormHelperText>
            </FormGroup>
            <FormGroup className="form-group-zone">
              <FormControlLabel
                control={<Switch checked={auto} onChange={handleAutoChange} name="gilad" />}
                label="Автоматический переход"
              />
              <FormHelperText>Автоматический переход на другой вопрос</FormHelperText>
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} spacing={3} className="settings-clider">
          <Typography className="slider-title">
            Задержка автоперехода
          </Typography>
          <Slider
            defaultValue={100}
            getAriaValueText={delayText}
            aria-labelledby="discrete-slider-always"
            step={50}
            marks={marks}
            valueLabelDisplay="auto"
            min={0}
            max={2000}
          />
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default UserPollSettings