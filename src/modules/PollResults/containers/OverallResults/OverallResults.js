import React, { Fragment, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import Box from '@material-ui/core/Box';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import DataGrid from '../../components/DataGrid'
import Filters from '../../components/Filters'
import BatchUpdate from '../../components/BatchUpdate'
import BatchCharts from '../../components/BatchCharts'
import BriefInfo from '../../components/BriefInfo'
import ExportMenu from '../../components/ExportMenu'

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
  const [batchOpen, setBatchOpen] = useState(false)
  const [briefOpen, setBrifOpen] = useState(false)
  const [batchGrOpen, setBatchGrOpen] = useState(false)

  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_POLL_RESULTS, {
    variables: {
      id
    },
    onCompleted: () => {
      setActiveResults(pollResults.poll.results)
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
    }
  })

  // процесс фильтрации данных в зависимости от выбора пользователя
  useEffect(() => {
    if (activeFilters) {
      const results = pollResults.poll.results
      const newResult = results.filter(result => {
        return activeFilters.cities ? result.city ? activeFilters.cities.includes(result.city.id) : true : true
      }).filter(result => {
        return activeFilters.intervs ? result.user ? activeFilters.intervs.includes(result.user.id) : true : true
      }).filter(result => {
        return activeFilters.date ? result.lastModified ? activeFilters.date == result.lastModified : true : true
      })
      const newSelectPool = selectPool.filter(
        selectId => {
          const len = newResult.length
          for (let i = 0; i < len; i++) {
            if (selectId === newResult[i].id) return true
          }
          return false
        })
      setSelectPool(newSelectPool)
      setActiveResults(newResult)
    }
  }, [activeFilters])

  if (pollResultsLoading || !activeResults || filtersResultsLoading) return (
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

  const exportDataCityGrouped = () => {
    // должен вкючать алгоритм разбивки на города
    setNoti({
      type: 'info',
      text: 'Опция пока не доступна'
    })
  }

  const exportDataIntervGroup = () => {
    // должен включать алгоритм разбивки данных на респонденты и добавление шапки
    // ???????? или важен город ???????
    setNoti({
      type: 'info',
      text: 'Опция пока не доступна'
    })
  }

  const exportAllRawData = () => {
    const regExp = /,/gi
    const resultsPool = activeResults
      .filter(result => selectPool.includes(result.id))
      .map(obj => obj.result)
    const lResults = resultsPool.length
    let allResults = ''
    for (let i = 0; i < lResults; i++) {
      const oderedResults = resultsPool[i].slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
      const details = oderedResults.map(obj => {
        if (obj.text !== '') {
          return obj.code + ' ' + obj.text.replaceAll(regExp, ';')
        }
        return obj.code
      })
      // кусок ниже, чтобы вставить перенос каретки при 180 символах и более, для Вити М.
      const rLength = details.length
      let tempResult = ''
      let counter = 0
      for (let j = 0; j < rLength; j++) {
        tempResult += details[j] + ','
        if (tempResult.length - counter > 160) {
          tempResult += '\n'
          counter = tempResult.length
        }
      }
      allResults += tempResult + '999' + '\n'
    }
    // транслит для имени файла
    // rus_to_latin('Имя файла')
    downloadIt(allResults, 'allData.txt')
  }

  const downloadIt = (data, fileName) => {
    const element = document.createElement('a')
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  }

  const handleResultsBatchUpdate = () => {

  }

  const deleteComplitely = () => {
    deleteResult({
      variables: {
        results: selectPool
      },
    })
    setDelOpen(false)
    setSelectPool([])
  }

  const showOneResultDetails = (respondent) => {
    console.log(respondent);
  }

  const updateSingleResult = (respondent) => {
    console.log(respondent);
    setNoti({
      type: 'info',
      text: 'Опция пока не доступна'
    })
  }

  return (
    <Fragment>
      <BatchCharts
        data={pollResults}
        selectPool={selectPool}
        open={batchGrOpen}
        close={() => setBatchGrOpen(false)} />
      <BriefInfo
        data={pollResults.poll.results}
        selectPool={selectPool}
        open={briefOpen}
        close={() => setBrifOpen(false)} />
      <BatchUpdate
        data={pollResults}
        selectPool={selectPool}
        open={batchOpen}
        close={() => setBatchOpen(false)} />
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Loading />
      <ConfirmDialog
        open={delOpen}
        confirm={deleteComplitely}
        close={() => setDelOpen(false)}
        config={{
          closeBtn: "Отмена",
          confirmBtn: "Удалить"
        }}
        data={
          {
            title: 'Удалить выбранные результаты?',
            content: 'Внимание! Выбранные результаты будут уничтожены безвозвратно. Будьте внимательны!'
          }
        }
      />
      <div className="result-service-zone">
        <Grid container justify="space-between" className="service-buttons">
          <Box className="main-buttons">
            <ExportMenu
              visible={!selectPool.length}
              rawDataExport={exportAllRawData}
              byCityExport={exportDataCityGrouped}
              byIntervExport={exportDataIntervGroup}
            />
            <Tooltip title="Краткая информация">
              <IconButton
                color="primary"
                component="span"
                onClick={() => setBrifOpen(true)}
                disabled={!selectPool.length}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Графики">
              <IconButton
                color="primary"
                component="span"
                onClick={() => setBatchGrOpen(true)}
                disabled={!selectPool.length}
              >
                <EqualizerIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Обновить">
              <IconButton
                color="primary"
                component="span"
                onClick={() => setBatchOpen(true)}
                disabled={!selectPool.length}
              >
                <DynamicFeedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Изменить статус">
              <IconButton
                color="primary"
                component="span"
                onClick={() => setBatchOpen(true)}
                disabled={!selectPool.length}
              >
                <CheckCircleOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
              <IconButton
                color="secondary"
                component="span"
                onClick={() => setDelOpen(true)}
                disabled={!selectPool.length}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Grid item container xs={12} sm={6} md={3} lg={3} justify="flex-end">
            <Box m={1}>
              <a href="">Есть дубли</a>
            </Box>
            <Box m={1}>
              <a href="">Есть проблемы</a>
            </Box>
          </Grid>
        </Grid>
        <Filters filters={filtersResults} setActiveFilters={setActiveFilters} />
        <DataGrid
          data={activeResults}
          selectPool={selectPool}
          setSelectPool={setSelectPool}
          showDetails={showOneResultDetails}
          updateSingle={updateSingleResult}
        />
      </div>
    </Fragment>
  )
}


export default OverallResults


function rus_to_latin(str) {
  var ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
    'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
  }, n_str = [];
  str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
  for (var i = 0; i < str.length; ++i) {
    n_str.push(
      ru[str[i]]
      || ru[str[i].toLowerCase()] == undefined && str[i]
      || ru[str[i].toLowerCase()].toUpperCase()
    );
  }
  return n_str.join('');
}