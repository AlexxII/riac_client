import React, { Fragment, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import Box from '@material-ui/core/Box';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import DataGrid from '../../components/DataGrid'
import Filters from '../../components/Filters'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_RESULTS, GET_FILTER_SELECTS } from './queries'
import { DELETE_RESULTS } from './mutations'

const OverallResults = ({ id }) => {
  const [noti, setNoti] = useState(false)

  const [delOpen, setDelOpen] = useState(false)
  const [activeResults, setActiveResults] = useState()
  const [activeFilters, setActiveFilters] = useState()
  const [selectPool, setSelectPool] = useState([])

  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_POLL_RESULTS, {
    variables: {
      id
    },
    onCompleted: () => {
      setActiveResults(pollResults.pollResults)
    }
  });

  const {
    data: filtersResults,
    loading: filtersResultsLoading,
    error: filtersResultsError
  } = useQuery(GET_FILTER_SELECTS)

  const [
    deleteResult,
    { loading: loadOnDelete }
  ] = useMutation(DELETE_RESULTS, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Удалить не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data }) => {
      const deletedPool = data.deleteResults.map(del => del.id)
      setActiveResults(activeResults.filter(result => !deletedPool.includes(result.id)))
      console.log(cache.data.data);
      cache.modify({
        fields: {
          pollResults(existingRefs, { readField }) {
            console.log(existingRefs);
            return existingRefs.filter(respRef => !deletedPool.includes(readField('id', respRef)))
          }
        }
      })
    },
    onCompleted: () => {
      setDelOpen(false)
    }
  })

  useEffect(() => {
    if (activeFilters) {
      if (activeFilters.cities.length) {
        const rrr = pollResults.pollResults.filter(
          result => {
            if (result.city) {
              return activeFilters.cities.includes(result.city.id)
            }
            return false
          }
        )
        setActiveResults(rrr)
      } else {
        setActiveResults(pollResults.pollResults)
      }
    }
  }, [activeFilters])


  if (pollResultsLoading || !pollResults || !activeResults || filtersResultsLoading) return (
    <LoadingState />
  )

  if (pollResultsError || filtersResultsError) {
    console.log(JSON.stringify(pollResultsError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const Loading = () => {
    if (loadOnDelete) return <LoadingStatus />
    return null
  }


  const handleResultsBatchUpdate = () => {

  }

  const handleResultsExport = () => {
    const resultsPool = activeResults.filter(result =>
      selectPool.includes(result.id)
    ).map(obj => obj.result)
    const lResults = resultsPool.length
    let allResults = ''
    for (let i = 0; i < lResults; i++) {
      const oderedResults = resultsPool[i].slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
      const details = oderedResults.map(obj => {
        if (obj.text !== '') {
          return obj.code + ' ' + obj.text
        }
        return obj.code
      })
      allResults += details + ',999' + '\n'
    }
    downloadIt(allResults)
  }

  const downloadIt = (data) => {
    const element = document.createElement('a')
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element);
    element.click();
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
        open={delOpen}
        confirm={() => deleteResult({
          variables: {
            results: selectPool
          },
        })}
        close={() => setDelOpen(false)}
        data={
          {
            title: 'Удалить выбранные результаты?',
            text: 'Внимание! Выбранные результаты будут уничтожены безвозвратно. Будьте внимательны!'
          }
        }
      />
      <div className="result-service-zone">
        <Grid container justify="space-between" className="service-buttons">
          <Box className="main-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleResultsExport}
              disabled={!selectPool.length}
              startIcon={<PublishIcon />}
            >
              Выгрузить
            </Button>
            <Button
              variant="contained"
              onClick={handleResultsBatchUpdate}
              disabled={!selectPool.length}
              startIcon={<DynamicFeedIcon />}
            >
              Обновить
            </Button>
          </Box>
          <Grid item container xs={12} sm={6} md={3} lg={3} justify="flex-end">
            <Box m={1}>
              <a href="">Есть дубли</a>
            </Box>
            <Box m={1}>
              <a href="">Есть проблемы</a>
            </Box>
          </Grid>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setDelOpen(true)}
              disabled={!selectPool.length}
              startIcon={<DeleteIcon />}
            >
              Удалить
            </Button>
          </Box>
        </Grid>
        <Filters filters={filtersResults} setActiveFilters={setActiveFilters} />
        <DataGrid data={activeResults} selectPool={selectPool} setSelectPool={setSelectPool} />
      </div>
    </Fragment>
  )
}


export default OverallResults