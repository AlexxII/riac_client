import React, { Fragment, useEffect, useState } from 'react'
import uuid from "uuid";

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SaveIcon from '@material-ui/icons/Save';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import ResultView from '../../containers/ResultView'
import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'
import VirtMasonry from '../../../../components/VirtMasonry'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import Filters from '../../components/Filters'
import StyledBadge from '../../../../components/StyledBadge'
import BriefInfo from '../../components/BriefInfo'
import BatchCharts from '../../components/BatchCharts'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'
import { parseOprFile } from '../../lib/utils'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_FILTER_SELECTS, GET_POLL_DATA } from './queries'
import { SAVE_BATCH_RESULT } from './mutaions'

import VirtCell from '../../../../components/VirtCell';

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const BatchInput = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [delOpen, setDelOpen] = useState(false)
  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [rawInputData, setRawInputData] = useState(false)
  const [selectPool, setSelectPool] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [activeWorksheets, setActiveWorksheets] = useState([])                          // отображаемые анкеты
  const [batchOpen, setBatchOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(null)
  const [briefOpen, setBrifOpen] = useState(false)
  const [batchGrOpen, setBatchGrOpen] = useState(false)

  // процесс фильтрации данных в зависимости от выбора пользователя
  useEffect(() => {
    if (activeFilters) {
      const results = rawInputData
      const newResult = results
        .filter(result => {
          return activeFilters.cities ? result.city ? activeFilters.cities.includes(result.city.id) : false : true
        })
        .filter(result => {
          return activeFilters.intervs ? result.user ? activeFilters.intervs.includes(result.user.id) : false : true
        })
        .filter(result => {
          return activeFilters.date ?
            activeFilters.date.length
              ? result.lastModified
                ? activeFilters.date.includes(result.lastModified)
                : false
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

  useEffect(() => {
    if (selectPool.length) {
      // const selectedData = activeWorksheets
      //   .filter(result => selectPool.includes(result.id))
      // кол-во уникальных городов, которые были выбраны
      // const uniqueCitites = selectedData.map(obj => obj.city ? obj.city.id : '-').filter((v, i, a) => a.indexOf(v) === i).length
      // setCitiesUpload(uniqueCitites)
      // для отображения промежуточного положения checkbox-a 
      activeWorksheets.length === selectPool.length ? setSelectAll(true) : setSelectAll(false)
    }
  }, [selectPool])

  const {
    data: filtersResults,
    loading: filtersResultsLoading,
    error: filtersResultsError
  } = useQuery(GET_FILTER_SELECTS)

  const {
    data: pollData,
    loading: pollDataLoading,
    error: pollDataError
  } = useQuery(GET_POLL_DATA, {
    variables: {
      id
    },
    onCompleted: () => {
      handleConfigFile(pollData.poll.logic.path)
    }
  });

  const [saveResult, { loading: saveLoading }] = useMutation(SAVE_BATCH_RESULT, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Сохранить не удалось. Смотрите консоль.'
      })
    },
    onCompleted: () => {
      setNoti({
        type: 'sucess',
        text: 'Данные сохранены'
      })
      console.log(('saved'));
      // setUserBack(true)
    }
  })


  const handleConfigFile = (filePath) => {
    fetch(url + filePath)
      .then((r) => r.text())
      .then(text => {
        const logic = parseIni(text)
        // Нормализация ЛОГИКИ - здесь формируется ЛОГИКА опроса, на основании конфиг файла !!!
        const normLogic = normalizeLogic(logic)
        setLogic(normLogic)
      })
  }

  const handleRawInput = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    setProcessing(true)
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        // + удаляем перенос строк
        setTimeout(() => {
          const fileData = reader.result
          const correctData = parseOprFile(fileData)
          const updatedData = correctData.map(obj => ({ ...obj, id: uuid.v4() }))
          setRawInputData(updatedData)
          setActiveWorksheets(updatedData)
          setProcessing(false)
        }, 1500)
      }
    }
    reader.readAsText(file, 'cp866');
    e.target.value = ""
  }

  if (!activeWorksheets || pollDataLoading || filtersResultsLoading) return (
    <LoadingState type="card" />
  )

  const deleteComplitely = () => {
    // необходимо удалить из данных, подготовленных для загрузки и из данных уже сохраненных в БД

    // deleteResult({
    //   variables: {
    //     results: selectPool
    //   },
    // })
    console.log(selectPool);

    setRawInputData(rawInputData.filter(obj => !selectPool.includes(obj.id)))
    setActiveWorksheets(activeWorksheets.filter(obj => !selectPool.includes(obj.id)))

    // setRawInputData(updatedData)
    setSelectPool([])
    setSelectAll(false)
    setDelOpen(false)
  }

  const selectAllActive = (event) => {
    if (activeWorksheets.length) {
      setSelectAll(event.target.checked)
      if (event.target.checked) {
        const selectPool = activeWorksheets.map(result => result.id)
        setSelectPool(selectPool)
      } else {
        setSelectPool([])
        setSelectAll(false)
      }
    }
  }

  const showOneResultDetails = (respondent) => {
    setSelectPool([respondent.id])
    setBatchOpen(true)
  }

  const saveResults = () => {
    const selectedPool = activeWorksheets.filter(obj => selectPool.includes(obj.id))
    const questions = pollData.poll.questions
    const preparedData = prepareResultsToSave(selectedPool, questions)
    console.log(preparedData);
    saveResult({
      variables: {
        poll: id,
        results: preparedData
      }
    })
  }

  const prepareResultsToSave = (selectedPool, questions) => {
    // массив соответствия {код ответа : id ответа}
    const answerCodePool = questions.reduce((acum, question) => {
      const answers = question.answers
      const lAnswers = answers.length
      for (let i = 0; i < lAnswers; i++) {
        const answer = answers[i]
        acum[answer.code] = { answer: answer.id, question: question.id }
      }
      return acum
    }, {})
    // 
    const preparedData = selectedPool.map(obj => {
      const results = obj.result
      const modResults = results.map(obj => ({
        ...obj,
        answer: answerCodePool[obj.code].answer ?? null,
        question: answerCodePool[obj.code].question ?? null,
      }))
      // TODO: проверить если id ответа или вопроса отсутствует
      return {
        city: obj.city,
        date: obj.date,
        user: obj.user,
        result: modResults
      }
    })
    return preparedData
  }

  const clearAll = () => {
    setSelectPool([])
    setSelectAll(false)
    setRawInputData([])
    setActiveWorksheets([])
  }

  if (pollDataError || filtersResultsError) {
    console.log(JSON.stringify(pollDataError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const Loading = () => {
    if (processing || saveLoading) return <LoadingStatus />
    return null
  }

  return (

    <Fragment>
      <BatchCharts
        // Графики
        data={activeWorksheets}
        selectPool={selectPool}
        questions={pollData.poll.questions}
        open={batchGrOpen}
        close={() => setBatchGrOpen(false)} />
      <BriefInfo
        // краткая информация - просто коды
        data={activeWorksheets}
        selectPool={selectPool}
        open={briefOpen}
        close={() => setBrifOpen(false)} />
      <ResultView
        // просмотр результатов
        workSheets={activeWorksheets}
        pollQuestions={pollData.poll.questions}
        selectPool={selectPool}
        open={batchOpen}
        logic={logic}
        // update={updateSingleResult}
        close={() => setBatchOpen(false)} />
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Loading />
      <div className="bachinput-add-zone">
        <input
          accept="*.opr"
          id="contained-button-file"
          onInput={handleRawInput}
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            size="small"
          >
            Выбрать
          </Button>
        </label>
        <Tooltip title="Сохранить в БД">
          <IconButton
            color="primary"
            component="span"
            onClick={saveResults}
            disabled={!selectPool.length}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
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
        <Tooltip title="Проверить на дубли">
          <IconButton
            color="primary"
            component="span"
            onClick={() => { }}
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
            disabled={!selectPool.length}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Очистить все">
          <IconButton
            color="secondary"
            component="span"
            onClick={clearAll}
            disabled={!rawInputData.length}
          >
            <HighlightOffIcon />
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
            label="Выделить все"
          />
        </StyledBadge>
      </div>
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
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Filters
          // filters={filtersResults} cities={pollResults.poll.cities} setActiveFilters={setActiveFilters}
          // pollFilters={pollResults.poll.filters}
          // quota={quota} />

          filters={filtersResults} cities={pollData.poll.cities} setActiveFilters={setActiveFilters}
          pollFilters={pollData.poll.filters}
          quota={0} />
      </div>
      <div style={{ marginTop: '10px', marginLeft: '-5px' }}>
        <VirtMasonry
          data={activeWorksheets}
          selectPool={selectPool}
          setSelectPool={setSelectPool}
          showDetails={showOneResultDetails}
          updateSingle={() => { }}
          element={<VirtCell />}
        />
      </div>
    </Fragment>
  )
}

export default BatchInput