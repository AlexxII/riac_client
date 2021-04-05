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

import ResultView from '../../containers/ResultView'
import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'
import VirtMasonry from '../../../../components/VirtMasonry'
import ConfirmDialog from '../../../../components/ConfirmDialog'

import Filters from '../../components/Filters'
import StyledBadge from '../../../../components/StyledBadge'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'
import { parseOprFile } from '../../lib/utils'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_DATA } from './queries'
import VirtCell from '../../../../components/VirtCell';
import { Paper } from '@material-ui/core';

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const BatchInput = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [delOpen, setDelOpen] = useState(false)
  const [dataPool, setDataPool] = useState(false)
  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [displayData, setDisplayData] = useState(false)
  const [selectPool, setSelectPool] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [activeWorksheets, setActiveWorksheets] = useState([])                          // отображаемые анкеты
  const [batchOpen, setBatchOpen] = useState(false)

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
          // setDisplayData(updatedData)
          setActiveWorksheets(updatedData)
          setProcessing(false)
        }, 1500)
      }
    }
    reader.readAsText(file, 'cp866');
    e.target.value = ""
  }

  if (pollDataLoading) return (
    <LoadingState type="card" />
  )

  const deleteComplitely = () => {
    // необходимо удалить из данных, подготовленных для загрузки и из данных уже сохраненных в БД

    // deleteResult({
    //   variables: {
    //     results: selectPool
    //   },
    // })
    setDelOpen(false)
    setSelectPool([])
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

  const showOneResultDetails = (respondent) => {
    setSelectPool([respondent.id])
    setBatchOpen(true)
  }

  if (pollDataError) {
    console.log(JSON.stringify(pollDataError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const Loading = () => {
    if (processing) return <LoadingStatus />
    return null
  }

  const Pp = () => {
    return (
      <VirtCell
      />
    )
  }

  return (

    <Fragment>
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
        <Tooltip title="Просмотр кодов">
          <IconButton
            color="primary"
            component="span"
            onClick={() => { }}
            disabled={!selectPool.length}
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Графики">
          <IconButton
            color="primary"
            component="span"
            onClick={() => { }}
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
          filters={[]} cities={[]} setActiveFilters={() => { }}
          pollFilters={[]}
          quota={0} />
      </div>
      <div style={{ marginTop: '10px', marginLeft: '-5px' }}>
        <VirtMasonry
          data={activeWorksheets}
          selectPool={selectPool}
          setSelectPool={setSelectPool}
          showDetails={showOneResultDetails}
          updateSingle={() => { }}
          element={<Pp />}
        />
      </div>
    </Fragment>
  )
}

export default BatchInput