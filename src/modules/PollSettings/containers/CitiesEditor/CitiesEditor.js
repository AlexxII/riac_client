import React, { Fragment, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import LoadingStatus from '../../../../components/LoadingStatus'
import ErrorState from '../../../../components/ErrorState'
import LoadingState from '../../../../components/LoadingState'
import SystemNoti from '../../../../components/SystemNoti'

import ConfirmDialog from '../../../../components/ConfirmDialog'

import { gql, useApolloClient, useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_ALL_CITIES_AND_ACTIVE } from './queries'
import { SET_ACTIVE_CITIES, DELETE_CITY_FROM_ACTIVE } from './mutations'

const CitiesEditor = ({ id }) => {
  const [noti, setNoti] = useState(false)
  // const client = useApolloClient();
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
    { loading: cityActivationLoading }
  ] = useMutation(SET_ACTIVE_CITIES, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Сохранить не удалось. Смотрите консоль.'
      })
    },
    update: (cache, { data: { setPollCity } }) => {
      const cities = setPollCity.cities.map(city => city.id)
      setAvailableCities(availableCities.filter(city => {
        return !cities.includes(city.id)
      }))
    }
  })
  const [
    deleteCity,
    { loading: deleteCityLoading }
  ] = useMutation(DELETE_CITY_FROM_ACTIVE, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Удалить не удалось. Смотрите консоль.'
      })
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

  if (citiesLoading || !citiesData || !availableCities) return (
    <LoadingState type="card" />
  )

  const Loading = () => {
    if (cityActivationLoading || deleteCityLoading) return <LoadingStatus />
    return null
  }

  if (cititesError) {
    console.log(JSON.stringify(cititesError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const handleCityDelete = (id) => {
    setDelId(id)
  }

  const handleDelConfirm = () => {
    deleteCityCompletely([delId])
    setDelId(false)
  }

  const handleAdd = () => {
    const selectedCities = selected.map(obj => {
      return obj.id
    })
    setCityActive({
      variables: {
        id,
        cities: selectedCities
      },
    })
    setClear(clear + 1)
  }

  const handleChange = (_, value) => {
    setSelected(value)
  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const deleteCityCompletely = (cities) => {
    deleteCity({
      variables: {
        id,
        cities: cities
      }
    })
  }

  const CityCard = ({ city, deleteCity }) => {
    const handleDelete = () => {
      deleteCity(city.id)
    }
    return (
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
          </Grid>
        </Paper>
      </Grid>
    )
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
      <ConfirmDialog
        open={delId}
        confirm={handleDelConfirm}
        close={() => setDelId(false)}
        config={{
          closeBtn: "Отмена",
          confirmBtn: "Удалить"
        }}
        data={
          {
            title: 'Удалить населенный пункт?',
            content: 'Внимание! Результаты опросов учитывают н.п. в которых они проводились, удаление приведет к потере части статистики и некорректности ее отображения.'
          }
        }
      />
      <div className="cities-service-zone">
        <Typography className="header">Города в которых проводится опрос</Typography>
        <Grid container justify="flex-start" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={8} md={6} lg={5}>
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
          <Grid item xs={12} sm={4} md={6} lg={5}>
            <Button variant="contained" color="primary" size="small" onClick={handleAdd} disabled={!selected.length}>
              Добавить
            </Button>
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={3} xs={12} >
        {citiesData.poll.cities.map((city, index) => (
          <CityCard key={index} city={city} deleteCity={handleCityDelete} />
        ))}
      </Grid>
    </Fragment>
  )
}
export default CitiesEditor