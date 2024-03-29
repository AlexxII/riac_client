import React, { Fragment, useState, useRef } from 'react'

import PollIcon from '@material-ui/icons/Poll';
import CalendarTodayRoundedIcon from '@material-ui/icons/CalendarTodayRounded';

import { useNavigate} from "react-router-dom";

import AddPollForm from '../AddPollForm'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import SpeedDialFab from '../../../../components/SpeedDealFab'

const iconvlite = require('iconv-lite')

const AddPollLogic = ({ addPoll }) => {
  const formRef = useRef()
  const navigator = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)
  const openPollDialog = () => {
    setOpenDialog(true)
  }
  const closeDialog = () => {
    setOpenDialog(false)
  }
  const saveNewPoll = (data) => {
    const xmlFile = data.xmlfile
    if (xmlFile.size) {
      let promise = new Promise((resolve, reject) => {
        resolve(xmlParse(xmlFile))
      })
      promise.then(result => {
        const basicData = basicLogicFormation(result)
        const pollInfo = {
          title: data.title,
          startDate: data.startdate,
          endDate: data.enddate,
          code: data.code,
          sample: data.sample,
          type: data.type,
          way: data.way,
          comment: data.comment
        }
        addPoll({
          variables: {
            newPoll: {
              ...pollInfo,
              comment: pollInfo.comment ? pollInfo.comment : "",
              shortTitle: '',
              active: true
            },
            poolOfQuestions: basicData.questions,
            logic: {
              ...basicData.logic
            },
            topic: basicData.topic
          }
        })
      })
    }
  }

  const xmlParse = (file) => {
    let result = {
      questions: [],
      logic: [],
      topic: []
    }
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const xmlText = reader.result

        // перекодирование с исходной кодировки (cp1251) в utf8 
        const buf = Buffer.from(xmlText);
        const utf8Text = iconvlite.decode(buf, 'utf8')

        const parser = new DOMParser();
        const doc = parser.parseFromString(utf8Text, 'text/xml');
        const questions = doc.getElementsByTagName('vopros')
        const questionsLen = questions.length
        for (let i = 0; i < questionsLen; i++) {
          let questionData = {
            importId: questions[i].getAttribute('id').slice(1, -1),
            title: questions[i].getAttribute('text'),
            topic: +questions[i].getAttribute('tema_id'),
            limit: questions[i].getAttribute('limit') ? +questions[i].getAttribute('limit') : 1,
            type: +questions[i].getAttribute('type_id'),
            order: +questions[i].getAttribute('sort'),
            answers: []
          }
          const questionAnswers = questions[i].getElementsByTagName('otvet')
          const answersLen = questionAnswers.length
          for (let i = 0; i < answersLen; i++) {
            const answerData = {
              importId: questionAnswers[i].getAttribute('id').slice(1, -1),
              title: questionAnswers[i].getAttribute('otvet_text'),
              code: questionAnswers[i].getAttribute('otvet_cod').padStart(3, "0"),
              type: +questionAnswers[i].getAttribute('otvet_type'),
              order: +questionAnswers[i].getAttribute('otvet_sort')
            }
            questionData.answers[i] = answerData
          }
          result.questions[i] = questionData
        }
        const defaultLogic = doc.getElementsByTagName('restrict')
        const logicLen = defaultLogic.length
        if (logicLen) {
          let logicData = []
          for (let i = 0; i < logicLen; i++) {
            const logic = {
              code: defaultLogic[i].getAttribute('otvet_cod').padStart(3, "0"),
              restrict: defaultLogic[i].getAttribute('restrict_cod').padStart(3, "0"),
              type: defaultLogic[i].getAttribute('restrict_type')
            }
            logicData[i] = logic
          }
          result.logic = logicData
        }
        const topics = doc.getElementsByTagName('tema')
        const topicsLen = topics.length
        if (topicsLen) {
          for (let i = 0; i < topicsLen; i++) {
            const topicData = {
              id: topics[i].getAttribute('id'),
              title: topics[i].getAttribute('name')
            }
            result.topic[i] = topicData
          }
        }
        resolve(result)
      }
      reader.readAsText(file, 'cp1251');
    })
  }

  const basicLogicFormation = (data) => {
    const basicLogic = data.logic.reduce((acum, val, i) => {
      if (val.type === '3') {
        if (!acum.exclude[val.code]) {
          acum.exclude[val.code] = { restrict: [val.restrict] }
        } else {
          acum.exclude[val.code] = {
            restrict: [
              ...acum.exclude[val.code].restrict,
              val.restrict
            ]
          }
        }
      } else if (val.type === '5') {
        acum.unique = [...acum.unique, val.code]
      }
      return acum
    }, {
      unique: [],
      exclude: {}
    })
    const extLogic = data.questions.reduce((acum, val) => {
      if (val.limit > 1) {
        // если вопрос с множество ответов -> ответ 'Затрудняюсь ответить' (type = 3) - УНИКАЛЬНЫЙ
        basicLogic.unique = [
          ...basicLogic.unique,
          ...val.answers.filter(obj => obj.type === 3).map(obj => obj.code)
        ]
      }
      acum.difficult = [
        ...acum.difficult,
        ...val.answers.filter(obj => obj.type === 3).map(obj => obj.code)
      ]
      acum.freeAnswers = [
        ...acum.freeAnswers,
        ...val.answers.filter(obj => obj.type === 2).map(obj => obj.code)
      ]
      return acum
    }, {
      difficult: [],
      freeAnswers: []
    })
    data.logic = {
      ...basicLogic,
      ...extLogic
    }
    return data
  }

  // элементы для кнопки быстрого доступа
  const actions = [
    { icon: <PollIcon />, name: 'Новый опрос', click: () => openPollDialog() },
    { icon: <CalendarTodayRoundedIcon />, name: 'Архив опросов', click: () => navigator("/poll-archive") }
  ];

  return (
    <Fragment>
      <SpeedDialFab actions={actions} />
      <ConfirmDialog
        open={openDialog}
        confirm={() => formRef.current.handleSubmit()}
        close={closeDialog}
        config={{
          closeBtn: "Отмена",
          confirmBtn: "Добавить"
        }}
        data={{
          title: 'Добавить новый опрос',
          content: <AddPollForm save={saveNewPoll} close={closeDialog} formRef={formRef} />,
        }}
      />
    </Fragment>
  )
}

export default AddPollLogic