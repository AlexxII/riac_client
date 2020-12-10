import React, { Fragment, useState } from 'react'

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
import Divider from '@material-ui/core/Divider';

import ConfirmDialog from '../../../../components/ConfirmDialog'

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_CITITES_WITH_CATEGORIES } from './queries'
import { CITY_SAVE_MUTATION, CITY_EDIT_SAVE, DELETE_CITY } from './mutations'

const Cities = () => {
  const [noti, setNoti] = useState(false)

  const [delId, setDelId] = useState(false)
  const [cityAdd, setCityAdd] = useState(false)
  const {
    data: citiesData,
    loading: citiesLoading,
    error: citiesError
  } = useQuery(GET_CITITES_WITH_CATEGORIES)

  const [saveCity, { loading: saveCityLoading }] = useMutation(CITY_SAVE_MUTATION, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Сохранить новый город не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { newCity } }) => cache.writeQuery({
      query: GET_CITITES_WITH_CATEGORIES,
      data: {
        cities: [
          ...citiesData.cities,
          newCity
        ]
      }
    })
  })

  const [saveCityEdit, { loading: saveCityEditLoading }] = useMutation(CITY_EDIT_SAVE, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Обновить информацию не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { cityEdit } }) => cache.writeQuery({
      query: GET_CITITES_WITH_CATEGORIES,
      data: {
        cities: citiesData.cities.map(city => city.id === cityEdit.id ? cityEdit : city)
      }
    })
  })

  const [
    deleteCity,
    { loading: deleteCityLoading }
  ] = useMutation(DELETE_CITY, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Удалить город не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { deleteCity } }) => cache.writeQuery({
      query: GET_CITITES_WITH_CATEGORIES,
      data: {
        cities: citiesData.cities.filter(city => city.id === deleteCity.id ? false : true)
      }
    })
  })

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
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Paper className="city-card">
              <Typography variant="h6" gutterBottom>
                {city.title}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                {city.category.title}
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
          </Grid>
          : <CityAdd city={city} save={handleSave} close={handleCloseEdit} />
        }
      </Fragment>
    )
  }

  const CityAdd = ({ save, close, city }) => {
    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(city ? city.title : '')
    const [population, setPopulation] = useState(city ? city.population : '')
    const [category, setCategory] = useState(city ? city.category.id : '')

    const handleSubmit = (e) => {
      e.preventDefault()
      const newCity = {
        title,
        population: +population,
        category
      }
      console.log(newCity);
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
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
              defaultValue={city ? city.category.id : ''}
              SelectProps={{
                native: true,
              }}
              helperText="Категория н.п."
            >
              <option key={0} disabled selected value=""></option>
              {citiesData.cityCategories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
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
      </Grid>
    )
  }

  const handleAdd = () => {
    setCityAdd(true)
  }

  const handleClose = () => {
    setCityAdd(false)
  }

  async function handleSaveNew(newData) {
    await saveCity({
      variables: { ...newData }
    })
    setCityAdd(false)
  }

  async function handleSaveEdit(cityData) {
    await saveCityEdit({
      variables: { ...cityData }
    })
  }

  async function deleteCityCompletely(id) {
    await deleteCity({
      variables: { id }
    })
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

  if (citiesLoading) return (
    <LoadingState />
  )

  if (citiesError) {
    console.log(JSON.stringify(citiesError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const Loading = () => {
    if (saveCityLoading) return <LoadingStatus />
    if (saveCityEditLoading) return <LoadingStatus />
    if (deleteCityLoading) return <LoadingStatus />
    return null
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
      <Grid container spacing={3} xs={12}>
        {cityAdd &&
          <CityAdd save={handleSaveNew} close={handleClose} />
        }
        {citiesData.cities.map((city, index) => (
          <CityCard city={city} save={handleSaveEdit} deleteCity={handleCityDelete} />
        ))}
      </Grid>
      <p></p>
      <span>Статус</span>
      <Divider />
    </Fragment>
  )
}

export default Cities