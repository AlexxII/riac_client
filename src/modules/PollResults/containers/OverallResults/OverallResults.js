import React, { Fragment, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
import BatchUpdate from '../../components/BatchUpdate'
import SingleUpdate from '../../components/SingleUpdate'
import BatchCharts from '../../components/BatchCharts'
import BriefInfo from '../../components/BriefInfo'
import ExportMenu from '../../components/ExportMenu'

import { useHistory } from "react-router-dom";
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_RESULTS, GET_FILTER_SELECTS } from './queries'
import { DELETE_RESULTS } from './mutations'

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
  const [activeWorksheets, setActiveWorksheets] = useState([])                // отображаемые анкеты
  const [doubleResults, setDoubleResults] = useState(null)
  const [activeFilters, setActiveFilters] = useState(null)
  const [calculating, setCalculating] = useState(true)
  const [selectPool, setSelectPool] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [citiesUpload, setCitiesUpload] = useState(null)                        // количество н.п. для выгрузки -> файлов
  const [batchOpen, setBatchOpen] = useState(false)
  const [singleUpdate, setSingleUpdate] = useState(false)
  const [briefOpen, setBrifOpen] = useState(false)
  const [batchGrOpen, setBatchGrOpen] = useState(false)
  const [logic, setLogic] = useState(false)

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

  useEffect(() => {
    if (activeWorksheets.length) {
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
            const ttt = arrayOfDublWorksheets.reduce((group, item) => {
              return [
                ...group,
                item.first,
                item.second
              ]
            }, [])
            setDoubleResults(ttt)
          } else {
            setDoubleResults(null)
          }
          setCalculating(false)

        }, 2000)
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
      const results = pollResults.poll.results
      const newResult = results.filter(result => {
        return activeFilters.cities ? result.city ? activeFilters.cities.includes(result.city.id) : false : true
      }).filter(result => {
        return activeFilters.intervs ? result.user ? activeFilters.intervs.includes(result.user.id) : true : true
      }).filter(result => {
        return activeFilters.date ? result.lastModified ? activeFilters.date === result.lastModified : true : true
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

  if (!activeWorksheets || filtersResultsLoading || pollResultsLoading) return (
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
    if (loadOnDelete) return <LoadingStatus />
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
    const dateRegExp = /(\d{2}).(\d{2}).(\d{2})(\d{2})/gmi                        // регулярка для даты
    for (let city in groupedObj) {
      const cityData = groupedObj[city]
      const results = cityData.map(obj => obj.result)
      const intervs = cityData.map(obj => obj.user.username)                      // все интервьюеры
      const dietIntervs = [...new Set(intervs)]                                   // остаются только уникальные
      exportData[city] = {
        data: prepareResultsDataToExport(results),
        date: cityData[0].created.replace(dateRegExp, `$1$2$4`),                  // дата в шапку
        city: cityData[0].city ? cityData[0].city.type + " " + city : '-',        // город
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

  const exportAllRawData = () => {
    const resultsPool = activeWorksheets
      .filter(result => selectPool.includes(result.id))
      .map(obj => obj.result)
    const allResults = prepareResultsDataToExport(resultsPool)
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
    setSelectPool([respondent.id])
    setBatchOpen(true)
  }

  const updateSingleResult = (respondent) => {
    history.push("/update-result/" + respondent.id);
    setSingleUpdate(respondent)
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
      <SingleUpdate
        data={pollResults}
        logic={logic}
        respondent={singleUpdate}
        open={singleUpdate}
        close={() => setSingleUpdate(false)}
        edit={true} />
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
            {/* <Tooltip title="Просмотр">
              <IconButton
                color="primary"
                component="span"
                onClick={() => setBatchOpen(true)}
                disabled={!selectPool.length}
              >
                <DynamicFeedIcon />
              </IconButton>
            </Tooltip> */}
            {/* <Tooltip title="Изменить статус">
              <IconButton
                color="primary"
                component="span"
                onClick={() => setBatchOpen(true)}
                disabled={!selectPool.length}
              >
                <CheckCircleOutlineOutlinedIcon />
              </IconButton>
            </Tooltip> */}
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
              {!calculating ?
                <Badge badgeContent={doubleResults ? `${doubleResults.length}` : null} color="secondary" anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                  max={999}>
                  <Button
                    style={{ marginBottom: '0px', padding: '4px 8px 0px 8px' }}
                    color="secondary" disabled={!doubleResults}>{doubleResults ? "есть дубли" : ''}</Button>
                </Badge>
                :
                <Typography variant="button" display="block" gutterBottom id="blink-text">
                  Анализ дублей
                </Typography>
              }
            </Box>
          </Grid>
        </Grid>
        <Filters filters={filtersResults} cities={pollResults.poll.cities} setActiveFilters={setActiveFilters} />
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