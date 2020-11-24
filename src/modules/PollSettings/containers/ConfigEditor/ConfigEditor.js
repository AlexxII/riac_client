import React, { Fragment, useState, useRef } from 'react'
import { mainUrl } from '../../../../mainconfig'

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { Box, Typography } from '@material-ui/core';

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { logicQuery } from "./queries"
import { saveConfigChanges } from "./mutations"
import { GET_POLL_DATA } from '../../containers/Common/queries'

const ConfigEditor = ({ id }) => {
  const [config, setConfig] = useState(null)
  const [filePath, setFilePath] = useState(null)
  const textRef = useRef()
  const { loading, error, data } = useQuery(logicQuery, {
    variables: { id },
    onCompleted: () => {
      handleConfigFile(data.pollLogic.path)
    },
  })

  const [saveConfig] = useMutation(saveConfigChanges, {
    refetchQueries: () => [{
      query: GET_POLL_DATA,
      variables: {
        id
      }
    }]
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
      <Grid item container>
        <Grid item container justify="space-between">
          <Box p={1}>
            <Typography variant="subtitle1" gutterBottom>
              Отображение и настройка конфигурационного файла
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Сохранить">
              <IconButton>
                <SaveIcon className="save-config" onClick={handleSave} />
              </IconButton>
            </Tooltip>
          </Box>
          <textarea
            ref={textRef}
            defaultValue={config}
          />
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default ConfigEditor