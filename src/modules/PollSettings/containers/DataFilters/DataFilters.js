import React, { Fragment, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import LoadingStatus from '../../../../components/LoadingStatus'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import ComplianceSheet from '../../../../components/ComplianceSheet'

import { GET_POLL_AND_ALL_FILTERS } from "./queries"
import { saveNewLimit, saveNewOrder } from "./mutations"

const ReoderEditor = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [filters, setFilters] = useState(false)

  const { loading: pollFiltersLoading, error: pollFiltersError, data: pollFilters } = useQuery(GET_POLL_AND_ALL_FILTERS, {
    variables: { id },
    onCompleted: () => {
      const preparedFilters = prepareFilters(pollFilters)
      setFilters({
        age: preparedFilters.ageCategories,
        sex: preparedFilters.sex,
        custom: preparedFilters.customFilters
      })
    }
  })

  // проверяем какие фильтры уже сохранены с опросом
  const prepareFilters = (result) => {
    const pollFilters = result.poll.filters

    // вытащить массив id фильтров, которые вкючены в настройка приложения
    const sexDef = {
      poll: result.sex.map(obj => obj.id),
      map: '2'
    }
    const ageDef = {
      pool: result.ageCategories.length ? result.ageCategories.map(obj => obj.id) : [],
      map: result.ageCategories.length ? result.ageCategories.map(obj => obj.id) : []
      
    }
    const customDef = {
      pool: result.ageCategories.length ? result.ageCategories.map(obj => obj.id) : [],
      map: result.ageCategories.length ? result.ageCategories.map(obj => obj.id) : []
    }

    console.log(result.sex);

    // вытащить все фильтры, которые определены в настройках опроса
    const age = pollFilters.age ?
      pollFilters.age.filter(obj => ageDef.pool.includes(obj.id)).map()
      : []
    const sex = pollFilters.sex ?
      pollFilters.sex.filter(obj => sexDef.pool.includes(obj.id)).map()
      : []
    const custom = pollFilters.custom ? pollFilters.custom.filter(obj => customDef.includes(obj.id)) : []

    console.log(result);
    return result
  }

  const [saveLimit, { loading: limitSaveLoading }] = useMutation(saveNewLimit, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Сохранить лимит не удалось. Смотрите консоль.'
      })
    }
  })

  const [saveOrder, { loading: saveOrderLoading }] = useMutation(saveNewOrder, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Сохранить порядок не удалось. Смотрите консоль.'
      })
    },
    update: (cache, { data }) => {
      const questions = data.newOrder
      for (let i = 0; i < questions.length; i++) {
        const id = questions[i].id
        const dd = cache.data.data
        for (let key in dd) {
          if (dd[key].id === id) console.log(dd[key]);
        }
      }
    }
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
    if (limitSaveLoading || saveOrderLoading) return <LoadingStatus />
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
      <div className="category-service-zone">
        <Typography variant="h5" gutterBottom className="header">Фильтры данных</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Для фильтрации результатов опросов соотнесите установленные фильтры с кодами опроса.
        </Typography>
      </div>
      <Grid container xs={12}>
        <Typography variant="h6" gutterBottom className="header">Возраст</Typography>
        <Grid container xs={12}>
          <ComplianceSheet data={filters.age} />
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <Typography variant="h6" gutterBottom className="header">Пол</Typography>
        <Grid container xs={12}>
          <ComplianceSheet data={filters.sex} />
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <Typography variant="h6" gutterBottom className="header">Пользовательские</Typography>
        <Grid container xs={12}>
          <ComplianceSheet data={filters.custom} />
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default ReoderEditor