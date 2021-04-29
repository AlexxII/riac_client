import React, { Fragment, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/core/styles';

import LoadingStatus from '../../../../components/LoadingStatus'
import ErrorState from '../../../../components/ErrorState'
import LoadingState from '../../../../components/LoadingState'
import SystemNoti from '../../../../components/SystemNoti'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_DATA } from "./queries"
import { SAVE_POLL_STATUS } from './mutations'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    }
  },
  text: {
    fontWeight: 800
  }
}));

const CommonEx = ({ id }) => {
  const classes = useStyles();
  const [noti, setNoti] = useState(false)
  const [topics, setTopics] = useState(false)
  const {
    loading,
    error,
    data: pollData
  } = useQuery(GET_POLL_DATA, {
    variables: { id },
    onCompleted: (data) => {
      const topicsObj = data.poll.questions.reduce((acum, item) => {
        if (acum[item.topic.id] === undefined) {
          acum[item.topic.id] = {
            title: item.topic.title,
            questions: [{
              id: item.id,
              order: item.order
            }]
          }
        } else {
          acum[item.topic.id] = {
            ...acum[item.topic.id],
            questions: [
              ...acum[item.topic.id].questions,
              {
                id: item.id,
                order: item.order
              }
            ]
          }
        }
        return acum
      }, {})
      let topics = []
      for (let key in topicsObj) {
        topics.push({
          ...topicsObj[key],
          order: topicsObj[key].questions.length > 0 ? topicsObj[key].questions[0].order : null
        })
      }
      const oderedTopics = topics.sort((a, b) => (a.order > b.order) ? 1 : -1)
      setTopics(oderedTopics)
    }
  })

  const [saveNewStatus, { loading: saveStatusLoading }] = useMutation(SAVE_POLL_STATUS, {
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
        text: 'Новый статус сохранен!'
      })
    },
    update: (cache, { data }) => {
      const cacheId = cache.identify(data.savePollStatus)
      const bool = data.savePollStatus.active
      cache.modify({
        id: cacheId,
        fields: {
          active(currentValue) {
            return bool
          }
        }
      })
      if (bool) {
        cache.modify({
          fields: {
            archivePolls: (existingRefs, { readField }) => {
              return existingRefs.filter(respRef => readField('id', respRef) !== data.savePollStatus.id)
            },
            polls: (existingFieldsData, { readField, toReference }) => {
              const apdatedPool = [...existingFieldsData, toReference(cacheId)]
              const sortedPool = apdatedPool.slice().sort((a, b) => (readField('dateOrder', a) > readField('dateOrder', b)) ? 1 : -1)
              return sortedPool
            }
          }
        })
      } else {
        cache.modify({
          fields: {
            polls: (existingRefs, { readField }) => {
              return existingRefs.filter(respRef => readField('id', respRef) !== data.savePollStatus.id)
            },
            archivePolls: (existingFieldsData, { readField, toReference }) => {
              const apdatedPool = [...existingFieldsData, toReference(cacheId)]
              const sortedPool = apdatedPool.slice().sort((a, b) => (readField('dateOrder', a) > readField('dateOrder', b)) ? 1 : -1)
              return sortedPool
            }
          }
        })
      }
    }
  })

  const changePollStatus = (event) => {
    saveNewStatus({
      variables: {
        id,
        active: event.target.checked
      }
    })
  }

  const Loading = () => {
    if (saveStatusLoading) return <LoadingStatus />
    return null
  }

  if (loading || !topics) return (
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
        <Typography variant="h5" gutterBottom className="header">Общая информация</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Обшая информация об опросе.
        </Typography>
      </div>
      <Grid container className="common-settings">
        <Typography variant="h6" gutterBottom>
          <strong>Тема: </strong>{pollData.poll.title}
        </Typography>
        <Grid
          className="poll-info"
          container
          justify="flex-start"
          direction="column"
          alignItems="flex-start"
        >
          <Box>
            <div className={classes.text}> Вопросов: {pollData.poll.questionsCount}</div>
          </Box>
          <Box>
            <div className={classes.text}> Ответов: {pollData.poll.answersCount}</div>
          </Box>
          <Grid>
            <p className={classes.text}>
              Темы:
            </p>
            <div className={classes.root}>
              {topics.map(topic => (
                <Chip
                  variant="outlined"
                  color="primary"
                  size="small"
                  // onDelete={() => { }}
                  deleteIcon={<InfoOutlinedIcon />}
                  label={(topic.title ? topic.title : '-') + ' - ' + topic.questions.length}
                />
              ))}
            </div>
          </Grid>
        </Grid>

        <FormControlLabel
          style={{ marginLeft: '0px' }}
          label="Активный"
          size="small"
          labelPlacement="start"
          control={<Switch checked={pollData.poll.active} onChange={changePollStatus} />}
        />
      </Grid>
    </Fragment>
  )
}

export default CommonEx