import React, { Fragment, useEffect, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'
import VirtMasonry from '../../../../components/VirtMasonry'
import ConfirmDialog from '../../../../components/ConfirmDialog'

import Filters from '../../components/Filters'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'
import { parseOprFile } from '../../lib/utils'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_DATA } from './queries'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const BatchInput = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [delId, setDelId] = useState(false)
  const [dataPool, setDataPool] = useState(false)
  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [displayData, setDisplayData] = useState(false)

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
      console.log(pollData);
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

  const handleWarInput = (e) => {
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
          setDisplayData(correctData)
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

  const handleDelConfirm = () => {

  }

  const handleDelDialogClose = () => {

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

  return (

    <Fragment>
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
          onInput={handleWarInput}
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
            disabled={false}
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Графики">
          <IconButton
            color="primary"
            component="span"
            onClick={() => { }}
            disabled={false}
          >
            <EqualizerIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Проверить на дубли">
          <IconButton
            color="primary"
            component="span"
            onClick={() => { }}
            disabled={false}
          >
            <FileCopyOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Удалить">
          <IconButton
            color="secondary"
            component="span"
            onClick={() => { }}
            disabled={false}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {/* <StyledBadge badgeContent={selectPool.length ? selectPool.length : null} color="primary" max={9999}>
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
        </StyledBadge> */}

      </div>
      <ConfirmDialog
        open={delId}
        confirm={handleDelConfirm}
        close={handleDelDialogClose}
        config={{
          closeBtn: "Отмена",
          confirmBtn: "Удалить"
        }}
        data={
          {
            title: 'Удалить результат?',
            content: `Внимание! Результаты опросов учитывают возраст респондента, удаление приведет к потере части статистики и некорректности ее отображения.`
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
          data={displayData}
          selectPool={[]}
          setSelectPool={() => { }}
          showDetails={() => { }}
          updateSingle={() => { }}
        />
      </div>
    </Fragment>
  )
}

export default BatchInput