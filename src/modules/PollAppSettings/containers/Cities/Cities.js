import React, { Fragment, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';

import ConfirmDialog from '../../../../components/ConfirmDialog'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_CITITES_WITH_CATEGORIES } from './queries'
import { CITY_SAVE_MUTATION, CITY_EDIT_SAVE, DELETE_CITY } from './mutations'

const Cities = () => {
  const [message, setMessage] = useState({
    show: false,
    type: 'error',
    message: '',
    duration: 6000
  })
  const [delId, setDelId] = useState(false)
  const [cityAdd, setCityAdd] = useState(false)
  const {
    data: citiesData,
    loading: citiesLoading,
    error: cititesError
  } = useQuery(GET_CITITES_WITH_CATEGORIES)

  const [
    saveCity,
    { loading: saveCityLoding, error: saveCityError }
  ] = useMutation(CITY_SAVE_MUTATION)

  const [
    saveCityEdit,
    { loading: saveCityEditLoading, error: saveCityEditError }
  ] = useMutation(CITY_EDIT_SAVE)

  const [
    deleteCity,
    { loading: deleteCityLoading, error: deleteCityError }
  ] = useMutation(DELETE_CITY)

  const CityCard = ({ city, save, deleteCity }) => {
    const [editting, setEditting] = useState(false)

    const handleEdit = () => {
      setEditting(true)
    }

    const handleSave = (data) => {
      save({
        ...data,
        id: city.id
      })
    }

    const handleCloseEdit = () => {
      setEditting(false)
    }

    const handleDelete = () => {
      deleteCity(city.id)
    }

    return (
      <Fragment>
        {!editting ?
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
              <IconButton className="card-button" aria-label="delete" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Paper>
          : <CityAdd city={city} save={handleSave} close={handleCloseEdit} />}
      </Fragment>
    )
  }

  const CityAdd = ({ save, close, city }) => {
    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(city ? city.title : '')
    const [population, setPopulation] = useState(city ? city.population : '')
    const [category, setCategory] = useState(city ? city.category : '')

    const handleSubmit = (e) => {
      e.preventDefault()
      const newCity = {
        title,
        population: +population,
        category
      }
      save(newCity)
    }

    const titleHandle = (e) => {
      setEdit(true)
      setTitle(e.currentTarget.value)
    }
    const popHandle = (e) => {
      setEdit(true)
      setPopulation(e.currentTarget.value)
    }
    const catHandle = (e) => {
      setEdit(true)
      setCategory(e.currentTarget.value)
    }

    return (
      <Paper className="add-city-card">
        <IconButton className="add-dialog-close" aria-label="delete" size="small" onClick={close}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <form onSubmit={handleSubmit}>
          <TextField
            className="add-city-title"
            required
            defaultValue={city ? city.title : ''}
            helperText="Название н.п."
            onChange={titleHandle}
          />
          <TextField
            className="add-city-population"
            type="number"
            required
            defaultValue={city ? city.population : ''}
            onChange={popHandle}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Численность, чел."
          />
          <TextField
            select
            required
            onChange={catHandle}
            defaultValue={city ? city.category.value : ''}
            SelectProps={{
              native: true,
            }}
            helperText="Категория н.п."
          >
            {citiesData.cityCategories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <Button
            className="city-dialog-save"
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
            type="submit"
            disabled={!edit}
          >
            Save
          </Button>
        </form>
      </Paper>
    )
  }

  const handleAdd = () => {
    setCityAdd(true)
  }

  const handleClose = () => {
    setCityAdd(false)
  }

  async function handleSaveNew(newData) {
    try {
      await saveCity({
        variables: { ...newData },
        update: (cache, { data }) => {
          cache.modify({
            fields: {
              cities: (existingFieldData) => {
                return [...existingFieldData, data.newCity]
              }
            }
          })
        }
      })
      setCityAdd(false)
    } catch (e) {
      setMessage({
        show: true,
        type: 'error',
        duration: 6000,
        text: 'Что-то не так. См. консоль'
      })
      console.log('Не удалось сохранить новый город');
    }
  }

  async function handleSaveEdit(cityData) {
    try {
      await saveCityEdit({
        variables: { ...cityData }
      })
    } catch (e) {
      setMessage({
        show: true,
        type: 'error',
        duration: 6000,
        text: 'Что-то не так. См. консоль'
      })
      console.log('Что-то пошло не так с изменением данных по городу', e)
    }
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

  if (citiesLoading || !citiesData) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Fragment>
      <div className="cities-service-zone">
        <Typography className="header">Города проведения опросов</Typography>
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
        {cityAdd &&
          <Grid item xs={12} md={2}>
            <CityAdd save={handleSaveNew} close={handleClose} />
          </Grid>
        }
        {citiesData.cities.map((city, index) => (
          <Grid item xs={12} md={2} key={index} >
            <CityCard city={city} save={handleSaveEdit} deleteCity={handleCityDelete} />
          </Grid>
        ))}
      </Grid>
      <Snackbar open={message.show} autoHideDuration={message.duration} onClose={handleMessageClose}>
        <Alert onClose={handleMessageClose} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
      <p></p>
      <span>Статус</span>
      <Divider />

    </Fragment>
  )
}

export default Cities