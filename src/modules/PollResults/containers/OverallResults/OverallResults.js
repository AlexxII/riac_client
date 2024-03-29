import React, { Fragment, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'
import DialogWithSelect from '../../../../components/DialogWithSelect';

import { parseIni, normalizeLogic } from '../../../PollDrive/lib/utils'
import { rusToLatin, prepareResultsDataToExport } from '../../lib/utils'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import Filters from '../../components/Filters'
import ResultView from '../../containers/ResultView'
import BatchCharts from '../../components/BatchCharts'
import BriefInfo from '../../components/BriefInfo'
import ExportMenu from '../../components/ExportMenu'
import EditMenu from '../../components/EditMenu'

import VirtMasonry from '../../../../components/VirtMasonry'
import StyledBadge from '../../../../components/StyledBadge'

import { useNavigate } from "react-router-dom";
import { gql, useApolloClient, useQuery, useMutation } from '@apollo/client'

import { GET_POLL_RESULTS, GET_FILTER_SELECTS } from './queries'
import {
  DELETE_RESULTS, SAVE_RESULTS_STATUS,
  UPDATE_RESULT_CITY, UPDATE_RESULT_USER
} from './mutations'

const iconvlite = require('iconv-lite')

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

// кол-во выделенных анкет

const OverallResults = ({ id }) => {
  const [currentUser, setCurrentUser] = useState(false)
  const [denied, setDenied] = useState(false)
  const navigator = useNavigate();
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()

  const [delOpen, setDelOpen] = useState(false)
  const [exportLimit, setExportLimit] = useState(false)
  const [activeWorksheets, setActiveWorksheets] = useState([])                           // отображаемые анкеты
  const [duplicateResults, setDuplicateResults] = useState(null)
  const [duplicateAnalyzeMode, setDuplicateAnalyze] = useState(false)
  const [activeFilters, setActiveFilters] = useState(null)
  const [calculating, setCalculating] = useState(false)
  const [selectPool, setSelectPool] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [citiesUpload, setCitiesUpload] = useState(null)                        // количество н.п. для выгрузки -> файлов
  const [batchOpen, setBatchOpen] = useState(false)
  const [briefOpen, setBrifOpen] = useState(false)
  const [batchGrOpen, setBatchGrOpen] = useState(false)
  const [logic, setLogic] = useState(false)
  const [quota, setQuota] = useState(false)
  const [dialogSelect, setDialogSelect] = useState({
    open: false,
    select: []
  })

  const {
    data: filtersResults,
    loading: filtersResultsLoading,
    error: filtersResultsError
  } = useQuery(
    GET_FILTER_SELECTS,
    {
      fetchPolicy: "no-cache"
    }
  )
  const client = useApolloClient()

  useEffect(() => {
    const userQueryData = client.readQuery({
      query: gql`
        query queryCurrentUser{
          currentUser {
            id
            username
            rights {
              id
              title
            }
          }
        }
      `
    })
    setCurrentUser(userQueryData)
  }, [])

  useEffect(() => {
    if (currentUser) {
      const user = currentUser.currentUser
      if (Object.keys(user.rights).length) {
        if (user.rights.title == 'Администратор' || user.rights.title == 'Суперадмин') {
          setDenied(false)
        }
        else {
          setDenied(true)
        }
      }
    }
  }, [currentUser])

  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_POLL_RESULTS, {
    fetchPolicy: "no-cache",
    variables: {
      id
    },
    onCompleted: (data) => {
      setActiveWorksheets(data.poll.results)
      const filePath = data.poll.logic.path
      fetch(url + filePath)
        .then((r) => r.text())
        .then(text => {
          const normalizedLogic = normalizeLogic(parseIni(text))
          setLogic(normalizedLogic)
        })
      setQuota({
        // распределение ответов по людям
        users: data.poll.results.reduce((acum, item) => {
          if (item.user) {
            if (!acum[item.user.id]) {
              acum[item.user.id] = 1
            } else {
              acum[item.user.id] = acum[item.user.id] + 1
            }
          }
          return acum
        }, {}),
        // распределение ответов по городам
        cities: data.poll.results.reduce((acum, item) => {
          if (item.city) {
            if (!acum[item.city.id]) {
              acum[item.city.id] = 1
            } else {
              acum[item.city.id] = acum[item.city.id] + 1
            }
          }
          return acum
        }, {})
      })
    }
  });

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
      const deletedIdPool = data.deleteResults.map(del => del.id)
      setActiveWorksheets(activeWorksheets.filter(result => !deletedIdPool.includes(result.id)))
      const deletedPoolOfObj = data.deleteResults
      for (let i = 0; i < deletedPoolOfObj.length; i++) {
        cache.evict({ id: cache.identify(deletedPoolOfObj[i]) })
        cache.gc()
      }
      cache.modify({
        id: cache.identify(pollResults.poll),
        fields: {
          resultsCount(currentValue) {
            return currentValue - deletedPoolOfObj.length
          }
        }
      })
    },
    onCompleted: () => {
      setSelectPool([])
      setSelectAll(false)
      setDuplicateResults(null)
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
    onCompleted: () => {
      setSelectPool([])
      setSelectAll(false)
    }
  })

  const [
    updateRespondentCity,
    { loading: updateRespondentCityLoading, error: updateRespondentCityError }
  ] = useMutation(UPDATE_RESULT_CITY, {
    onCompleted: (data) => {
      // обновление вью
      const repondents = data.updateResultCity
      const respondentIdPool = repondents.reduce((acum, item) => {
        acum[item.id] = item
        return acum
      }, {})
      const newActiveWorksheets = activeWorksheets.map(
        result => respondentIdPool[result.id] ? respondentIdPool[result.id] : result
      )
      setActiveWorksheets(newActiveWorksheets);
      // фильтруем
      // const results = duplicateAnalyueMode ? newActiveWorksheet : pollResults.poll.results
      const results = newActiveWorksheets
      const newResult = doFiltration(results)
      setActiveWorksheets(newResult)
      setQuota({
        ...quota,
        cities: pollResults.poll.results.reduce((acum, item) => {
          if (item.city) {
            if (!acum[item.city.id]) {
              acum[item.city.id] = 1
            } else {
              acum[item.city.id] = acum[item.city.id] + 1
            }
          }
          return acum
        }, {})
      })
    }
  })

  const [
    updateRespondentUser,
    { loading: updateRespondentUserLoading, error: updateRespondentUserError }
  ] = useMutation(UPDATE_RESULT_USER, {
    onCompleted: (data) => {
      // обновление вью
      const repondents = data.updateResultUser
      const respondentIdPool = repondents.reduce((acum, item) => {
        acum[item.id] = item
        return acum
      }, {})
      const newActiveWorksheet = activeWorksheets.map(
        result => respondentIdPool[result.id] ? respondentIdPool[result.id] : result
      )
      setActiveWorksheets(newActiveWorksheet);
      // фильтруем
      // const results = duplicateAnalyzeMode ? activeWorksheets : pollResults.poll.results
      const results = newActiveWorksheet;
      const newResult = doFiltration(results)
      setActiveWorksheets(newResult)
      setQuota({
        ...quota,
        users: pollResults.poll.results.reduce((acum, item) => {
          if (item.user) {
            if (!acum[item.user.id]) {
              acum[item.user.id] = 1
            } else {
              acum[item.user.id] = acum[item.user.id] + 1
            }
          }
          return acum
        }, {})
      })
    }
  })

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
      const newResult = doFiltration(results)
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

  const doFiltration = (results) => {
    if (!activeFilters) {
      const newResult = results.map(item => item);
      return newResult;
    }
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
      .filter(result => {
        if (!activeFilters.status) {
          return true
        }
        if (activeFilters.status === 'set') {
          return result.processed === true
        } else {
          return result.processed === false
        }
      })
    return newResult
  }

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
      'село': 'с'
    }
    const needCityCategory = city.replace(/город|населенный пункт|поселок|ж.д. станция|село/gi, function (matched) {
      return cityObj[matched]
    })
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
        data: prepareResultsDataToExport(results, exportLimit),
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
      const outDataCp866 = utfToCP866(outData)
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
        const outDataCp866 = utfToCP866(outData)
        downloadIt(outDataCp866, rusToLatin(city))                                  // транслит для имени файла
      }
    }
  }

  // преобразование кодировки
  const utfToCP866 = (data) => {
    const buf = Buffer.from(data);
    const buff = iconvlite.decode(buf, 'utf8');
    const result = iconvlite.encode(buff, 'cp866')
    return result
  }

  const showOnlyDuplicates = () => {
    const needData = activeWorksheets.filter(respondent => duplicateResults.includes(respondent.id))
    setActiveWorksheets(needData)
    setDuplicateAnalyze(true)
  }

  const closeDuplicateAnalyzeMode = () => {
    setDuplicateAnalyze(false)
    setActiveWorksheets(pollResults.poll.results)
  }

  const exportAllRawData = () => {
    const resultsPool = activeWorksheets
      .filter(result => selectPool.includes(result.id))
      .map(obj => obj.result)
    const allResults = prepareResultsDataToExport(resultsPool, exportLimit)
    const outDataCp866 = utfToCP866(allResults)
    downloadIt(outDataCp866, 'allData.txt')
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

  const checkForDuplicates = () => {
    const activeAndSelectedSheets = activeWorksheets.filter(obj => selectPool.includes(obj.id))
    setSelectPool([])
    setCalculating(true)
    setTimeout(function () {
      const results = activeAndSelectedSheets.map(obj => (
        {
          id: obj.id,
          answers: obj.result
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
        setNoti({
          type: 'success',
          text: 'Дублей не обнаружено'
        })
        setDuplicateResults(null)
      }
      setCalculating(false)
    }, 1000)

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

  const saveDialogData = (data) => {
    const type = dialogSelect.type
    switch (type) {
      case 'city':
        saveNewCity(data)
        setDialogSelect({ ...dialogSelect, open: false })
        break
      case 'user':
        saveNewUser(data)
        setDialogSelect({ ...dialogSelect, open: false })
        break
      default:
        setDialogSelect({ ...dialogSelect, open: false })
        return
    }
  }

  const saveNewCity = (data) => {
    const city = data.id
    updateRespondentCity({
      variables: {
        results: selectPool,
        city
      },
      onError: (e) => {
        setNoti({
          type: 'error',
          text: 'Изменить город не удалось. Смотрите консоль.'
        })
        console.log(e);
      },
    })
  }

  const saveNewUser = (data) => {
    const user = data.id
    updateRespondentUser({
      variables: {
        results: selectPool,
        user
      },
      onError: (e) => {
        setNoti({
          type: 'error',
          text: 'Изменить пользователя не удалось. Смотрите консоль.'
        })
        console.log(e);
      },
      update: (cache, { data }) => {
        const repondents = data.updateResultUser
        for (let i = 0; i < repondents.length; i++) {
          const respondent = repondents[i];
          const cacheId = cache.identify(respondent.user)
          // обновление кэш
          cache.modify({
            id: cache.identify(respondent),
            fields: {
              user: (existingFieldsData, { toReference }) => {
                return toReference(cacheId)
              }
            }
          })
        }
      },
    })
  }

  const handleCityChange = () => {
    setDialogSelect({
      type: 'city',
      select: pollResults.poll.cities ?? [],
      header: 'Смена города',
      text: 'Выберите город в котором проводился опрос',
      open: true
    })
  }

  const handleUserChange = () => {
    const data = filtersResults.intervievers.map(obj => ({
      id: obj.id,
      title: obj.username
    }))
    setDialogSelect({
      type: 'user',
      select: data,
      header: 'Смена интервьюера',
      text: 'Выберите интервьюера, который проводил опрос',
      open: true
    })
  }

  const updateSingleResult = (respondent) => {
    navigator(`/update-result/${id}/${respondent.id}`);
  }

  return (
    <Fragment>
      <BatchCharts
        // Графики
        data={activeWorksheets}
        selectPool={selectPool}
        questions={pollResults.poll.questions}
        open={batchGrOpen}
        close={() => setBatchGrOpen(false)} />
      <BriefInfo
        // краткая информация - просто коды
        data={pollResults.poll.results}
        selectPool={selectPool}
        open={briefOpen}
        close={() => setBrifOpen(false)}
        charsLimit={exportLimit}
      />
      <ResultView
        // просмотр результатов
        workSheets={activeWorksheets}
        pollQuestions={pollResults.poll.questions}
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
      <DialogWithSelect
        open={dialogSelect.open}
        options={dialogSelect.select}
        header={dialogSelect.header}
        text={dialogSelect.text}
        save={saveDialogData}
        handleClose={() => setDialogSelect({ ...dialogSelect, open: false })}
      />
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
            <EditMenu
              visible={!selectPool.length || denied}
              handleStatus={handleStatusChange}
              handleCityChange={handleCityChange}
              handleUserChange={handleUserChange}
            />
            <Tooltip title="Проверить на дубли">
              <IconButton
                color="primary"
                component="span"
                onClick={checkForDuplicates}
                disabled={selectPool.length < 2}
              >
                <FileCopyOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
              <IconButton
                color="secondary"
                component="span"
                onClick={() => setDelOpen(true)}
                disabled={!selectPool.length || denied}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={exportLimit ? "Перенос строк - ВКЛ" : "Перенос строк - ВЫКЛ"}>
              <IconButton
                color={exportLimit ? "primary" : "secondary"}
                component="span"
                onClick={() => setExportLimit(!exportLimit)}
              // disabled={exportLimit}
              >
                80
              </IconButton>
            </Tooltip>
            <StyledBadge badgeContent={selectPool.length ? selectPool.length : null} color="primary" max={9999}>
              <FormControlLabel id="selectall-checkbox"
                control={
                  <Checkbox
                    checked={selectAll && selectPool.length === activeWorksheets.length}
                    onChange={selectAllActive}
                    color="primary"
                    indeterminate={Boolean(selectPool.length > 0 & !selectAll)}
                  />
                }
                label="ВСЕ"
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
                    max={9999}>
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
        <div style={{ marginBottom: '10px' }}>
          <Filters
            filters={filtersResults} cities={pollResults.poll.cities} setActiveFilters={setActiveFilters}
            pollFilters={pollResults.poll.filters}
            quota={quota} />
        </div>

        <VirtMasonry
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