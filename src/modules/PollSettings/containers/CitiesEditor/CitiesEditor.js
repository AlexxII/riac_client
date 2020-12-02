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

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import ConfirmDialog from '../../../../components/ConfirmDialog'

import { gql, useApolloClient, useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_ALL_CITIES_AND_ACTIVE } from './queries'
import { SET_ACTIVE_CITIES, DELETE_CITY_FROM_ACTIVE } from './mutations'

const CitiesEditor = ({ id }) => {
  const client = useApolloClient();
  const [message, setMessage] = useState({
    show: false,
    type: 'error',
    message: '',
    duration: 6000
  })
  // const { currentUser } = client.readQuery({
  //   query: gql`
  //   query {
  //     currentUser {
  //       id
  //       username
  //     }
  //   }
  //   `,
  // })
  const [clear, setClear] = useState(0)
  const [delId, setDelId] = useState(false)
  const [allCities, setAllCitites] = useState()
  const [availableCities, setAvailableCities] = useState()
  const [selected, setSelected] = useState([])
  const {
    data: citiesData,
    loading: citiesLoading,
    error: cititesError
  } = useQuery(GET_ALL_CITIES_AND_ACTIVE, {
    variables: { id },
    onCompleted: () => {
      const pollCities = citiesData.poll.cities
      setAllCitites(citiesData.cities)
      setAvailableCities(citiesData.cities.filter(
        city => {
          for (let i = 0; i < pollCities.length; i++) {
            if (city.id === pollCities[i].id) {
              return false
            }
          }
          return true
        }
      ))
    }
  })
  const [
    setCityActive,
    { loading: cityActivationLoading, error: cityActivationError }
  ] = useMutation(SET_ACTIVE_CITIES)
  const [
    deleteCity,
    { loading: deleteCityLoading, error: deleteCityError }
  ] = useMutation(DELETE_CITY_FROM_ACTIVE)

  if (citiesLoading || !citiesData || !availableCities) return (
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
    deleteCityCompletely([delId])
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

  async function handleAdd() {
    const selectedCities = selected.map(obj => {
      return obj.id
    })
    try {
      await setCityActive({
        variables: {
          id,
          cities: selectedCities
        },
        update: (cache, data) => {
          setAvailableCities(availableCities.filter(city => {
            return !selectedCities.includes(city.id)
          }))
        }
      })
    } catch (e) {
      setMessage({
        show: true,
        type: 'error',
        duration: 6000,
        text: 'Что-то не так. См. консоль'
      })
      console.log('Не удалось сохранить новый город');
      console.log(e);
    }
    setClear(clear + 1)
  }

  const handleChange = (_, value) => {
    setSelected(value)
  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  async function deleteCityCompletely(cities) {
    try {
      await deleteCity({
        variables: {
          id,
          cities: cities
        },
        update: (cache, { data }) => {
          const pollCities = data.deleteCityFromActive.cities
          const aCitites = allCities.filter(city => {
            for (let i = 0; i < pollCities.length; i++) {
              if (city.id === pollCities[i].id) return false
            }
            return true
          })
          setAvailableCities(aCitites)
        }
      })
    } catch (e) {
      setMessage({
        show: true,
        type: 'error',
        duration: 6000,
        text: 'Что-то не так. См. консоль'
      })
      console.log('Что-то пошло не так с удалением города. Вот ошибка -> ', e)
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
            {city.category.title}
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

  return (
    <Fragment>
      <div className="cities-service-zone">
        <Typography className="header">Города в которых проводится опрос</Typography>
        <Grid container justify="flex-start" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={5}>
            <Autocomplete
              multiple
              key={clear}
              limitTags={3}
              options={availableCities}
              disableCloseOnSelect
              clearOnEscape
              onChange={handleChange}
              getOptionLabel={(option) => option.title}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Добавьте город" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={5} alignItems="center">
            <Button variant="contained" color="primary" size="small" onClick={handleAdd} disabled={!selected.length}>
              Добавить
            </Button>
          </Grid>
        </Grid>
      </div>
      <ConfirmDialog
        open={delId}
        confirm={handleDelConfirm}
        close={() => setDelId(false)}
        data={
          {
            title: 'Удалить населенный пункт?',
            text: 'Внимание! Результаты опросов учитывают н.п. в которых они проводились, удаление приведет к потере части статистики и некорректности ее отображения.'
          }
        }
      />
      <Grid container spacing={3}>
        {citiesData.poll.cities.map((city, index) => (
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