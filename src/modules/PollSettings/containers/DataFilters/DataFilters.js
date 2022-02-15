import React, { Fragment, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';

import { useQuery, useMutation } from '@apollo/client'

import LoadingStatus from '../../../../components/LoadingStatus'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import ComplianceSheet from '../../../../components/ComplianceSheet'

import { GET_POLL_AND_ALL_FILTERS } from "./queries"
import { SAVE_FILTER_DATA } from "./mutations"

const ReoderEditor = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [filters, setFilters] = useState(false)

  const { loading: pollFiltersLoading, error: pollFiltersError, data: pollFilters } = useQuery(GET_POLL_AND_ALL_FILTERS, {
    variables: { id },
    onCompleted: (pollFilters) => {
      const preparedFilters = prepareFilters(pollFilters)
      setFilters(preparedFilters)
    }
  })

  // проверяем какие фильтры уже сохранены с опросом
  const prepareFilters = (result) => {
    const pollFilters = result.poll.filters

    let ageDeff = {}
    let sexDeff = {}
    let customDeff = {}

    if (pollFilters) {
      ageDeff = pollFilters.age ? pollFilters.age.reduce((acum, item) => {
        acum[item.id] = {
          code: item.code,
          active: item.active
        }
        return acum
      }, {}) : {}
      sexDeff = pollFilters.sex ? pollFilters.sex.reduce((acum, item) => {
        acum[item.id] = {
          code: item.code,
          active: item.active
        }
        return acum
      }, {}) : {}
      customDeff = pollFilters.custom ? pollFilters.custom.reduce((acum, item) => {
        acum[item.id] = {
          code: item.code,
          active: item.active
        }
        return acum
      }, {}) : {}
    }

    // вытащить все фильтры, которые определены в настройках опроса
    const age = result.ageCategories.length ?
      result.ageCategories.map(obj => {
        if (ageDeff[obj.id] !== undefined) {
          return {
            ...obj,
            ...ageDeff[obj.id]
          }
        } else {
          return {
            ...obj,
            code: '',
            active: false
          }
        }
      })
      : []
    const sex = result.sex.length ?
      result.sex.map(obj => {
        if (sexDeff[obj.id] !== undefined) {
          return {
            ...obj,
            ...sexDeff[obj.id]
          }
        } else {
          return {
            ...obj,
            code: '',
            active: false
          }
        }
      })
      : []
    const custom = result.customFilters.length ?
      result.customFilters.map(obj => {
        if (customDeff[obj.id] !== undefined) {
          return {
            ...obj,
            ...customDeff[obj.id]
          }
        } else {
          return {
            ...obj,
            code: '',
            active: false
          }
        }
      })
      : []
    return {
      age,
      sex,
      custom
    }
  }

  const [saveFilterData, { loading: saveDataLoading }] = useMutation(SAVE_FILTER_DATA, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Сохранить фильтры не удалось. Смотрите консоль.'
      })
    },
    // update: (cache, { data }) => {
    //   const questions = data.newOrder
    //   for (let i = 0; i < questions.length; i++) {
    //     const id = questions[i].id
    //     const dd = cache.data.data
    //     for (let key in dd) {
    //       if (dd[key].id === id) console.log(dd[key]);
    //     }
    //   }
    // }
  })

  if (pollFiltersLoading || !filters) return (
    <LoadingState type="card" />
  )

  if (pollFiltersError) {
    console.log(JSON.stringify(pollFiltersError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const Loading = () => {
    if (saveDataLoading) return <LoadingStatus />
    return null
  }

  const saveData = (datas, type) => {
    setFilters(prevState => ({
      ...prevState,
      [type]: datas
    }))
  }



  const handleSave = () => {
    const modFilters = {
      age: filters.age.map(obj => ({
        id: obj.id,
        code: obj.code,
        active: obj.active
      })),
      sex: filters.sex.map(obj => ({
        id: obj.id,
        code: obj.code,
        active: obj.active
      })),
      custom: filters.custom.map(obj => ({
        id: obj.id,
        code: obj.code,
        active: obj.active
      })),
    }
    saveFilterData({
      variables: {
        poll: id,
        data: modFilters
      }
    })
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
        <Typography variant="h5" gutterBottom className="header">Фильтры данных</Typography>
      </div>
      <Divider />
      <div className="info-zone" style={{ 'paddingBottom': '10px' }}>
        <Typography variant="body2" gutterBottom>
          Для фильтрации результатов опросов соотнесите установленные фильтры с кодами опроса.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Сохранить
      </Button>
      </div>
      <Grid container xs={12}>
        <Typography variant="h6" gutterBottom className="header">Возраст</Typography>
        <Grid container xs={12}>
          <ComplianceSheet data={filters.age} saveData={(data) => saveData(data, 'age')} />
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <Typography variant="h6" gutterBottom className="header">Пол</Typography>
        <Grid container xs={12}>
          <ComplianceSheet data={filters.sex} saveData={(data) => saveData(data, 'sex')} />
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <Typography variant="h6" gutterBottom className="header">Пользовательские</Typography>
        <Grid container xs={12}>
          <ComplianceSheet data={filters.custom} saveData={(data) => saveData(data, 'custom')} />
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default ReoderEditor