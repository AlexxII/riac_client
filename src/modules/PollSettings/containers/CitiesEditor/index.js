import React, { Fragment, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Select from 'react-select'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import DialogWithSelect from '../../../../components/DialogWithSelect';

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_ALL_CITIES_AND_ACTIVE } from './queries'
import { SET_ACTIVE_CITITES, DELETE_CITY_FROM_ACTIVE } from './mutations'

const CitiesEditor = ({ id }) => {
  const [message, setMessage] = useState({
    show: false,
    type: 'error',
    message: '',
    duration: 6000
  })
  const [poolOfCities, setPoolOfCities] = useState()
  const [delId, setDelId] = useState(false)
  const [openCityDialog, setOpenCityDialog] = useState(false);
  const {
    data: citiesData,
    loading: citiesLoading,
    error: cititesError
  } = useQuery(GET_ALL_CITIES_AND_ACTIVE, {
    variables: { id },
    onCompleted: () => {
      setPoolOfCities(citiesData.poll.cities)
    }
  })
  const [
    setCityActive,
    { loading: cityActivationLoading, error: cityActivationError }
  ] = useMutation(SET_ACTIVE_CITITES)
  const [
    deleteCity,
    { loading: deleteCityLoading, error: deleteCityError }
  ] = useMutation(DELETE_CITY_FROM_ACTIVE)

  if (citiesLoading || !citiesData || !poolOfCities) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  if (cititesError) return (
    <Fragment>
      <p>Курить бамбук, что-то не работает</p>
    </Fragment>
  )

  const handleCityDelete = (id) => {
    setDelId(id)
  }

  const handleDelConfirm = () => {
    deleteCityCompletely(delId)
    setDelId(false)
  }

  const handleDelDialogClose = () => {
    setDelId(false)
  }

  const handleMessageClose = () => {
    setMessage(prevState => ({
      ...prevState,
      show: false,
      text: ''
    }))
  }

  const saveCity = () => {
    setOpenCityDialog()
  }

  const handleAdd = () => {
    setOpenCityDialog(true)
  }

  const closeDialog = () => {
    setOpenCityDialog(false)
  }

  async function deleteCityCompletely(id) {
    try {
      await deleteCity({
        variables: { id },
        update: (cache, { data }) => {
          if (data.deleteCity) {
            cache.modify({
              fields: {
                cities: (existingFieldData, { readField }) => {
                  return existingFieldData.filter(
                    cityRef => id !== readField('id', cityRef)
                  )
                }
              }
            })
          } else {
            setMessage({
              show: true,
              type: 'error',
              duration: 6000,
              text: 'Удалить город не удалось.'
            })
          }
        }
      })
    } catch (e) {
      setMessage({
        show: true,
        type: 'error',
        duration: 6000,
        text: 'Что-то не так. См. консоль'
      })
      console.log('Что-то пошло не так с удалением города', e)
    }
  }

  const CityCard = ({ city, deleteCity }) => {
    const handleDelete = () => {
      deleteCity(city.id)
    }
    return (
      <Fragment>
        <Paper className="city-card">
          <Typography variant="h6" gutterBottom>
            {city.title}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            {city.category.label}
          </Typography>
          <Typography variant="overline" display="block" gutterBottom>
            Население: {city.population}
          </Typography>
          <Grid container item justify="space-between" className="card-service-buttons">
            <IconButton className="card-button" aria-label="delete" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Paper>
      </Fragment>
    )
  }

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const CitySelect = () => {
    return (
      <Select
        className="city-select"
        closeMenuOnSelect={false}
        isMulti
      />
    )
  }

  return (
    <Fragment>
      <DialogWithSelect
        open={openCityDialog}
        options={citiesData.cities}
        header="Город"
        text="Выберите город в котором будет проводится опрос"
        save={saveCity}
        component={<CitySelect />}
        handleClose={closeDialog}
      />
      <div className="cities-service-zone">
        <Typography className="header">Города в которых проводится опрос</Typography>
        <Button variant="contained" color="primary" size="small" onClick={handleAdd}>
          Добавить
        </Button>
      </div>
      <ConfirmDialog
        open={delId}
        confirm={handleDelConfirm}
        close={handleDelDialogClose}
        data={
          {
            title: 'Удалить населенный пункт?',
            text: 'Внимание! Результаты опросов учитывают н.п. в которых они проводились, удаление приведет к потере части статистики и некорректности ее отображения.'
          }
        }
      />
      <Grid container spacing={3}>
        {poolOfCities.map((city, index) => (
          <Grid item xs={12} md={2} key={index} >
            <CityCard city={city} deleteCity={handleCityDelete} />
          </Grid>
        ))}
      </Grid>
      <Snackbar open={message.show} autoHideDuration={message.duration} onClose={handleMessageClose}>
        <Alert onClose={handleMessageClose} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
    </Fragment>
  )
}
export default CitiesEditor