import React, { Fragment, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { withStyles } from '@material-ui/core/styles';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import { parseIni, normalizeLogic } from '../../../PollDrive/lib/utils'
import { rusToLatin, prepareResultsDataToExport } from '../../lib/utils'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import DataGrid from '../../components/DataGrid'
import Filters from '../../components/Filters'
import ResultView from '../../containers/ResultView'
import BatchCharts from '../../components/BatchCharts'
import BriefInfo from '../../components/BriefInfo'
import ExportMenu from '../../components/ExportMenu'
import StatusMenu from '../../components/StatusMenu'

import { useHistory } from "react-router-dom";
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_RESULTS, GET_FILTER_SELECTS } from './queries'
import { DELETE_RESULTS, SAVE_RESULTS_STATUS } from './mutations'

const iconvlite = require('iconv-lite')

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

// кол-во выделенных анкет
const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 0,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

const OverallResults = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const history = useHistory();

  const [delOpen, setDelOpen] = useState(false)
  const [reset, setReset] = useState(false)
  const [activeWorksheets, setActiveWorksheets] = useState([])                // отображаемые анкеты
  const [duplicateResults, setDuplicateResults] = useState(null)
  const [duplicateAnalyzeMode, setDuplicateAnalyze] = useState(false)
  const [activeFilters, setActiveFilters] = useState(null)
  const [calculating, setCalculating] = useState(true)
  const [selectPool, setSelectPool] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [citiesUpload, setCitiesUpload] = useState(null)                        // количество н.п. для выгрузки -> файлов
  const [batchOpen, setBatchOpen] = useState(false)
  const [briefOpen, setBrifOpen] = useState(false)
  const [batchGrOpen, setBatchGrOpen] = useState(false)
  const [logic, setLogic] = useState(false)
  const [quota, setQuota] = useState(false)

  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_POLL_RESULTS, {
    variables: {
      id
    },
    onCompleted: () => {
      setActiveWorksheets(pollResults.poll.results)
      handleConfigFileAndUpdateCache(pollResults.poll)
      console.log(pollResults);
      setQuota({
        users: handleUserQuotaData(pollResults.poll.results),
        cities: handleCityQuotaData(pollResults.poll.results)
      })
    }
  });

  const handleConfigFileAndUpdateCache = (poll) => {
    const filePath = poll.logic.path
    fetch(url + filePath)
      .then((r) => r.text())
      .then(text => {
        const normalizedLogic = normalizeLogic(parseIni(text))
        setLogic(normalizedLogic)
      })
  }

  // распределение ответов по людям
  const handleUserQuotaData = (data) => {
    return data.reduce((acum, item) => {
      if (item.user) {
        if (!acum[item.user.id]) {
          acum[item.user.id] = 1
        } else {
          acum[item.user.id] = acum[item.user.id] + 1
        }
      }
      return acum
    }, {})
  }

  // распределение ответов по городам
  const handleCityQuotaData = (data) => {
    return data.reduce((acum, item) => {
      if (item.city) {
        if (!acum[item.city.id]) {
          acum[item.city.id] = 1
        } else {
          acum[item.city.id] = acum[item.city.id] + 1
        }
      }
      return acum
    }, {})
  }

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
      setActiveWorksheets(activeWorksheets.filter(result => !deletedPool.includes(result.id)))
      cache.modify({
        fields: {
          pollResults(existingRefs, { readField }) {
            return existingRefs.filter(respRef => !deletedPool.includes(readField('id', respRef)))
          }
        }
      })
    },
    onCompleted: () => {
      setSelectPool([])
      setSelectAll(false)
    }
  })

  const [
    saveResultStatus,
    { loading: loadOnStatusSave }
  ] = useMutation(SAVE_RESULTS_STATUS, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Изменить статус не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data }) => {
      const updatePool = data.saveResultStatus.map(obj => obj.id)
      const bool = data.saveResultStatus[0].processed
      setActiveWorksheets(activeWorksheets.map(
        result => updatePool.includes(result.id) ? { ...result, processed: bool } : result
      ))
    },
    // update: (cache, { data }) => {
    //   const deletedPool = data.deleteResults.map(del => del.id)
    //   setActiveWorksheets(activeWorksheets.filter(result => !deletedPool.includes(result.id)))
    //   cache.modify({
    //     fields: {
    //       pollResults(existingRefs, { readField }) {
    //         return existingRefs.filter(respRef => !deletedPool.includes(readField('id', respRef)))
    //       }
    //     }
    //   })
    // },
    onCompleted: () => {

      setSelectPool([])
      setSelectAll(false)
    }
  })

  useEffect(() => {
    if (activeWorksheets.length) {
      setQuota({
        users: handleUserQuotaData(activeWorksheets),
        cities: handleCityQuotaData(activeWorksheets)
      })
      // console.log(pollResults);
      // анализ дублей
      // если кол-во вопросов в опросе больше 5, то проходит анализ, в противном случае нет
      setLoadingMsg({
        ...loadingMsg,
        description: 'Анализ дублей'
      })
      if (pollResults.poll.questions.length > 4) {
        setCalculating(true)
        setTimeout(function () {
          const results = activeWorksheets.map(worksheet => (
            {
              id: worksheet.id,
              answers: worksheet.result
            }
          ))
          // процесс анализа дублей
          const lResults = results.length - 1                                                 // кол-во итераций N-1, т.к. предпоследний сравнивается с последним
          let arrayOfDublWorksheets = []
          for (let i = 0; i < lResults; i++) {
            const result = results[i].answers
            const lresult = result.length
            for (let k = i + 1; k < lResults + 1; k++) {
              const nextResult = results[k].answers                                           // следующий по очереди массив с ответами, с ним и происходит сравнение
              // если размерность массива ответов разная -> дубли быть не могут
              if (result.length === nextResult.length) {
                // выстроить очередность
                const resultOrd = result.slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
                const nextResultOrd = nextResult.slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
                let count = 0
                for (let j = 0; j < lresult; j++) {
                  if (resultOrd[j].code === nextResultOrd[j].code) {
                    // свободные отеты совпадают -> продолжаем анализ
                    if (resultOrd[j].text !== nextResultOrd[j].text) {
                      break
                    }
                    count++
                    continue
                  }
                  break
                }
                if (count === result.length) {
                  arrayOfDublWorksheets.push({
                    first: results[i].id,
                    second: results[k].id
                  })
                }
              }
            }
          }
          if (arrayOfDublWorksheets.length) {
            const dublArray = arrayOfDublWorksheets.reduce((group, item) => {
              return [
                ...group,
                item.first,
                item.second
              ]
            }, [])
            const uniqueDublArray = [...new Set(dublArray)]
            setDuplicateResults(uniqueDublArray)
          } else {
            setDuplicateResults(null)
          }
          setCalculating(false)
        }, 1000)
      }
    } else {
      setCalculating(false)
    }
  }, [activeWorksheets])

  useEffect(() => {
    if (selectPool.length) {
      const selectedData = activeWorksheets
        .filter(result => selectPool.includes(result.id))
      // кол-во уникальных городов, которые были выбраны
      const uniqueCitites = selectedData.map(obj => obj.city ? obj.city.id : '-').filter((v, i, a) => a.indexOf(v) === i).length
      setCitiesUpload(uniqueCitites)
      // для отображения промежуточного положения checkbox-a 
      activeWorksheets.length === selectPool.length ? setSelectAll(true) : setSelectAll(false)
    }
  }, [selectPool])

  // процесс фильтрации данных в зависимости от выбора пользователя
  useEffect(() => {
    if (activeFilters) {
      const results = duplicateAnalyzeMode ? activeWorksheets : pollResults.poll.results
      const newResult = results
        .filter(result => {
          return activeFilters.cities ? result.city ? activeFilters.cities.includes(result.city.id) : false : true
        })
        .filter(result => {
          return activeFilters.intervs ? result.user ? activeFilters.intervs.includes(result.user.id) : true : true
        })
        .filter(result => {
          return activeFilters.date ?
            activeFilters.date.length
              ? result.lastModified
                ? activeFilters.date.includes(result.lastModified)
                : true
              : true
            : true
        })
        .filter(result => {
          const len = result.result.length
          let res = true
          if (!activeFilters.sex) {
            return true
          }
          for (let i = 0; i < len; i++) {
            if (result.result[i].code === activeFilters.sex) {
              res = true
              break
            } else {
              res = false
            }
          }
          return res
          // console.log(activeFilters);
        })
        .filter(result => {
          const len = result.result.length
          let res = true
          if (!activeFilters.ages) {
            return true
          }
          for (let i = 0; i < len; i++) {
            if (activeFilters.ages.includes(result.result[i].code)) {
              res = true
              break
            } else {
              res = false
            }
          }
          return res
        })
        .filter(result => {
          const len = result.result.length
          let res = true
          if (!activeFilters.custom) {
            return true
          }
          for (let i = 0; i < len; i++) {
            if (activeFilters.custom.includes(result.result[i].code)) {
              res = true
              break
            } else {
              res = false
            }
          }
          return res
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
      setActiveWorksheets(newResult)
    }
  }, [activeFilters])

  if (!activeWorksheets || filtersResultsLoading || pollResultsLoading || !quota) return (
    <LoadingState
      {...(loadingMsg && loadingMsg.title && {
        title: loadingMsg.title
      })}
      {...(loadingMsg && loadingMsg.description && {
        description: loadingMsg.description
      })}
    />
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
    if (loadOnDelete || loadOnStatusSave) return <LoadingStatus />
    return null
  }

  const selectAllActive = (event) => {
    if (activeWorksheets.length) {
      setSelectAll(event.target.checked)
      if (event.target.checked) {
        const selectPool = activeWorksheets.map(result => result.id)
        setSelectPool(selectPool)
      } else {
        setSelectPool([])
        setSelectAll()
      }
    }
  }

  const cityCategoryName = (city) => {
    const cityObj = {
      'город': 'г',
      'населенный пункт': 'нп',
      'поселок': 'нп',
      'ж.д. станция': 'ж/д ст',
      'село': 'c'
    }
    const needCityCategory = city.replace(/город|населенный пункт|поселок|ж.д. станция|село/gi, function (matched) {
      return cityObj[matched]
    })
    console.log(needCityCategory);
    return needCityCategory
  }

  const exportDataCityGrouped = (singleFile) => {
    const needData = pollResults.poll.results.filter(respondent => selectPool.includes(respondent.id))
      .slice()
      .sort((a, b) => a.city && b.city ? (a.city.category.order > b.city.category.order) ? 1 : -1 : 1)
      .sort((a, b) => a.city && b.city ? (a.city.category.id > b.city.category.id) ? 1 : -1 : 1)
      .sort((a, b) => a.user && b.user ? (a.user.id > b.user.id) ? 1 : -1 : 1)
    // групировка по городам
    const groupedObj = needData.reduce((groups, item) => ({
      ...groups,
      [item.city ? item.city.title : null]: [...(groups[item.city ? item.city.title : null] || []), item]
    }), {});
    const exportData = {}
    const dateRegExp = /(\d{2}).(\d{2}).(\d{2})(\d{2})/gmi                                          // регулярка для даты
    for (let city in groupedObj) {
      const cityData = groupedObj[city]
      const results = cityData.map(obj => obj.result)
      const intervs = cityData.map(obj => obj.user.username)                                        // все интервьюеры
      const dietIntervs = [...new Set(intervs)]                                                     // остаются только уникальные
      exportData[city] = {
        data: prepareResultsDataToExport(results),
        date: cityData[0].created.replace(dateRegExp, `$1$2$4`),                                    // дата в шапку
        city: cityData[0].city ? cityCategoryName(cityData[0].city.type + " " + city) : '-',        // город
        interviewer: `${dietIntervs}`
      }
    }
    let count = 1
    // одним файлом или множество
    if (singleFile) {
      let outData = ''
      for (let city in exportData) {
        const mapObj = {
          '{code}': pollResults.poll.code,
          '{date}': exportData[city].date,
          '{int}': count,
          '{city}': exportData[city].city
        }
        let header = ''
        if (logic.header) {
          header = logic.header.replace(/{code}|{date}|{int}|{city}/gi, function (matched) {
            return mapObj[matched]
          }).replace(/['"]+/g, '')                                                  // удаление кавычек
        } else {
          header = 'Шапка не задана в конфиг.файле'
        }
        outData += header + '\n' + exportData[city].data
        outData += '==='
        outData += '\n' + exportData[city].interviewer + '\n\n'
        count++
      }
      const outDataCp866 = utfTocp866(outData)
      downloadIt(outDataCp866, 'allData.opr')
    } else {
      for (let city in exportData) {
        let outData = ''
        const mapObj = {
          '{code}': pollResults.poll.code,
          '{date}': exportData[city].date,
          '{int}': count,
          '{city}': exportData[city].city
        }
        let header = ''
        if (logic.header) {
          header = logic.header.replace(/{code}|{date}|{int}|{city}/gi, function (matched) {
            return mapObj[matched]
          }).replace(/['"]+/g, '')                                                  // удаление кавычек
        } else {
          header = 'Шапка не задана в конфиг.файле'
        }
        outData += header + '\n' + exportData[city].data
        outData += '==='
        outData += '\n' + exportData[city].interviewer
        count++

        const outDataCp866 = utfTocp866(outData)
        downloadIt(outDataCp866, rusToLatin(city))                                  // транслит для имени файла
      }
    }
  }

  const utfTocp866 = (data) => {
    // let encoder = new TextEncoder();
    // let uint8Array = encoder.encode(data);
    // console.log(uint8Array);

    // let decoder = new TextDecoder('cp1251')
    // const dd = decoder.decode(uint8Array)

    // return dd
    const buf = Buffer.from(data);
    const buff = iconvlite.encode(data, 'utf8');

    // const decoder = new TextDecoder('866')
    // const result = decoder.decode(buf)
    const result = iconvlite.decode(buff, 'cp866')
    return data
  }

  const showOnlyDuplicates = () => {
    const needData = activeWorksheets.filter(respondent => duplicateResults.includes(respondent.id))
    setActiveWorksheets(needData)
    setDuplicateAnalyze(true)
  }

  const closeDuplicateAnalyzeMode = () => {
    setDuplicateAnalyze(false)
    setActiveFilters(null)
    setReset(true)
    setActiveWorksheets(pollResults.poll.results)
  }

  const exportAllRawData = () => {
    const resultsPool = activeWorksheets
      .filter(result => selectPool.includes(result.id))
      .map(obj => obj.result)
    const allResults = prepareResultsDataToExport(resultsPool)
    downloadIt(allResults, 'allData.txt')
  }

  const handleStatusChange = (type) => {
    switch (type) {
      case 'set':
        const setPool = activeWorksheets.filter(obj => !obj.processed).map(obj => obj.id)
        saveResultStatus({
          variables: {
            type: 'set',
            results: setPool
          }
        })
        break
      case 'unset':
        const unsetPool = activeWorksheets.filter(obj => obj.processed).map(obj => obj.id)
        saveResultStatus({
          variables: {
            type: 'unset',
            results: unsetPool
          }
        })
        break
      default:
        return
    }
  }

  const downloadIt = (data, fileName) => {
    const element = document.createElement('a')
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
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
    setSelectPool([respondent.id])
    setBatchOpen(true)
  }

  const updateSingleResult = (respondent) => {
    console.log(respondent);
    history.push(`/update-result/${id}/${respondent.id}`);
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
      <ResultView
        data={pollResults}
        selectPool={selectPool}
        open={batchOpen}
        logic={logic}
        update={updateSingleResult}
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
              bags={{
                cities: citiesUpload
              }}
            />
            <Tooltip title="Просмотр кодов">
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
            <StatusMenu
              visible={!selectPool.length}
              handleStatus={handleStatusChange}
            />
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
            <StyledBadge badgeContent={selectPool.length ? selectPool.length : null} color="primary" max={999}>
              <FormControlLabel id="selectall-checkbox"
                control={
                  <Checkbox
                    checked={selectAll && selectPool.length === activeWorksheets.length}
                    onChange={selectAllActive}
                    color="primary"
                    indeterminate={Boolean(selectPool.length > 0 & !selectAll)}
                  />
                }
                label="Выделить все"
              />
            </StyledBadge>
          </Box>
          <Grid item container xs={12} sm={6} md={3} lg={3} justify="flex-end">
            <Box m={1}>
              {duplicateAnalyzeMode ?
                <Button
                  style={{ marginBottom: '0px', padding: '4px 8px 0px 8px' }}
                  onClick={closeDuplicateAnalyzeMode}
                  color="secondary" disabled={!duplicateResults}>{duplicateResults ? "закрыть" : ''}</Button>
                :
                !calculating ?
                  <Badge badgeContent={duplicateResults ? `${duplicateResults.length}` : null} color="secondary" anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                    max={999}>
                    <Button
                      style={{ marginBottom: '0px', padding: '4px 8px 0px 8px' }}
                      onClick={showOnlyDuplicates}
                      color="secondary" disabled={!duplicateResults}>{duplicateResults ? "есть дубли" : ''}</Button>
                  </Badge>
                  :
                  <Typography variant="button" display="block" gutterBottom id="blink-text">
                    Анализ дублей
                </Typography>
              }
            </Box>
          </Grid>
        </Grid>
        <Filters
          filters={filtersResults} cities={pollResults.poll.cities} setActiveFilters={setActiveFilters}
          reset={reset}
          pollFilters={pollResults.poll.filters}
          quota={quota} />
        <DataGrid
          data={activeWorksheets}
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