import React, { Fragment, useState, useRef } from 'react'

import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import LoadingStatus from '../../../../components/LoadingStatus'
import ErrorState from '../../../../components/ErrorState'
import LoadingState from '../../../../components/LoadingState'
import SystemNoti from '../../../../components/SystemNoti'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { logicQuery } from "./queries"
import { saveConfigChanges } from "./mutations"
import { GET_POLL_DATA } from '../../containers/Common/queries'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const ConfigEditor = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [config, setConfig] = useState(null)
  const [filePath, setFilePath] = useState(null)
  const textRef = useRef()
  const { loading, error, data } = useQuery(logicQuery, {
    variables: { id },
    onCompleted: () => {
      handleConfigFile(data.pollLogic.path)
    },
  })

  const [saveConfig, { loading: configSaveLoading }] = useMutation(saveConfigChanges, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Сохранить не удалось. Смотрите консоль.'
      })
    },
    onCompleted: () => {
      setNoti({
        type: 'success',
        text: 'Конфиг сохранен успешно!'
      })
    },
    refetchQueries: () => [{
      query: GET_POLL_DATA,
      variables: {
        id
      }
    }]
  })

  const handleConfigFile = (filePath) => {
    setFilePath(filePath)
    fetch(url + filePath)
      .then((r) => r.text())
      .then(text => {
        setConfig(text)
      })
  }

  const handleSave = (e) => {
    saveConfig({
      variables: {
        path: filePath,
        text: textRef.current.value
      }
    })
  }

  const handleConfigChange = (e) => {
    if (config === e.currentTarget.value) {
      setUpdated(false)
      return
    }
    setUpdated(true)
  }

  const Loading = () => {
    if (configSaveLoading) return <LoadingStatus />
    return null
  }

  if (loading || !config) return (
    <LoadingState type="card" />
  )

  if (error) {
    console.log(JSON.stringify(error));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
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
        <Typography variant="h5" gutterBottom className="header">Конфигурация</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Отображение и настройка конфигурационного файла опроса. Настройки задаются автоматически при импорте, могут быть исправлены и дополнены.
        </Typography>
      </div>
      <Grid item container>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!updated}
        >
          Сохранить
          </Button>
        <div id="config-text">
          <textarea
            ref={textRef}
            defaultValue={config}
            onChange={handleConfigChange}
          />
        </div>
      </Grid>
    </Fragment>
  )
}

export default ConfigEditor