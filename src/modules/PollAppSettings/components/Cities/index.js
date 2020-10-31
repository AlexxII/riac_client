import React, { Fragment, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { useQuery } from '@apollo/client'

import { GET_ALL_CITIES } from './quesries'

const Cities = () => {
  const { loading, error, data } = useQuery(GET_ALL_CITIES)
  const [cityAdd, setCityAdd] = useState(false)

  const CityCard = ({ city }) => {
    return (
      <p>{city.title}</p>
    )
  }

  const CityAdd = ({ save, close }) => {
    const saveData = () => {
      save()
    }

    const citiesCategoris = [
      {
        value: 'c001',
        label: 'город с численностью более 1 млн чел.'
      },
      {
        value: 'c002',
        label: 'город с численностью от 500 тыс. чел. до 1 млн чел.'
      },
      {
        value: 'c003',
        label: 'город с численностью от 100 до 500 тыс. чел.'
      },
      {
        value: 'c004',
        label: 'город с численностью от 50 до 100 тыс. чел.'
      },
      {
        value: 'c005',
        label: 'город с численностью до 50 тыс. чел., посёлок городского типа'
      },
      {
        value: 'c006',
        label: 'сельский населённый пункт'
      }
    ]

    return (
      <Fragment>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <TextField required label="Название" />
          <TextField
            label="Численность населения"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            select
            label="Native select"
            SelectProps={{
              native: true,
            }}
            helperText="Please select your currency"
          >
            {citiesCategoris.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <button onClick={close}>Close</button>
        <button onClick={saveData}>Save</button>
      </Fragment>
    )
  }

  const handleAdd = () => {
    setCityAdd(true)
  }

  const handleClose = () => {
    setCityAdd(false)
  }

  const handleSave = (data) => {
    console.log('Города - ', data);
    setCityAdd(false)
  }

  if (loading || !data) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  return (
    <span>
      <p>Города проведения опросов</p>
      {!cityAdd &&
        <button onClick={handleAdd}>Add</button>
      }
      <span>
        {cityAdd &&
          <CityAdd save={handleSave} close={handleClose} />
        }
        {data.cities.map((city, index) => (
          <CityCard city={city} key={index} />
        ))}
      </span>
    </span>
  )
}

export default Cities