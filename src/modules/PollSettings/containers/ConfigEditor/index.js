import React, { Fragment, useState, useRef } from 'react'
import { mainUrl } from '../../../../mainconfig'

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { logicQuery } from "./queries"
import { saveConfigChanges } from "./mutations"

const ConfigEditor = ({ id }) => {
  const [config, setConfig] = useState(null)
  const [filePath, setFilePath] = useState(null)
  const textRef = useRef()
  const { loading, error, data, refetch } = useQuery(logicQuery, {
    variables: { id },
    onCompleted: () => {
      handleConfigFile(data.pollLogic.path)
    },
    refetchQueries: () => [{
      query: GET_TASKS_BY_STATUS,
      variables: {
        status: id
      }
    }]
  })

  const [saveConfig] = useMutation(saveConfigChanges, {
  })

  const handleConfigFile = (filePath) => {
    setFilePath(filePath)
    fetch(mainUrl + filePath)
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

  if (loading || !config) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  if (error) return <p>Ошибка. Что-то пошло не так! :(</p>;

  return (
    <Fragment>
      <Grid item xs={12} sm container>
        <Grid container>
          <Grid item xs container direction="column" spacing={2} alignItems="flex-start">
            <Grid item xs={12}>
              Отображение и настройка конфигурационного файла
            </Grid>
          </Grid>
          <Grid item xs container direction="column" spacing={1} alignItems="flex-end">
            <Grid item xs={12}>
              <Tooltip title="Сохранить">
                <SaveIcon className="save-config" onClick={handleSave} />
              </Tooltip>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <textarea
              ref={textRef}
              defaultValue={config}
            />
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default ConfigEditor