# Apollo client
============================
## обновление кэша
Импорт зависимостей
import { gql, useQuery, useLazyQuery, useApolloClient } from '@apollo/client'

### получение клиента в компоненте
const client = useApolloClient();

const [delay, setDelay] = uaeState(true)

const [getPollData, { loading, data: pollDd }] = useLazyQuery(GET_POLL_DATA, {
  variables: {
    id
  },
  onCompleted: () => {
    updateAndStoreInApolloCache(pollDd)
    setDelay(false)                                             // задержка отрисовки
  }
});

const updateAndStoreInApolloCache = (data) => {
  const poll = data.poll
  const mData = {
    ...poll,
    questions: poll.questions.map((item, index) => ({
      ...item,
      title: `${index + 1} - ${item.title}`
    }))
  }
###### доступ ко всем вопросам и обновление их через фрагменты - быстро -> предусмотреть задержку отрисовки
  for (let i = 0; i < mData.questions.length; i++) {
    const question = mData.questions[i]
    const qId = question.id
    client.writeFragment({
      id: `Question:${qId}`,
      fragment: gql`
        fragment MyPoll on Question {
          title
        }
        `,
      data: {
        title: '111111111111111'
      }
    })

  }
  return
  console.log(mData);
}

### обновить скопом все вопросы опроса
client.writeFragment({
  id: `Poll:${poll.id}`,
  fragment: gql`
    fragment MyPoll on Poll {
      questions
    }
    `,
  data: {
    questions: modQuestions
  }
})

### обновить весь опрос в кэше со всеми зависимостями
client.writeQuery({
  query: GET_POLL_DATA,
  data: {
    poll: mData
  }
})

### обновление после мутации
const [
  postMessage,
  {loading: postMessageLoading, error: postMessageError}
] = useMutation(MESSAGE_MUTATION)

async function handlrOnMessage(content: string) {
  try {
    await postMessage({
      variables: { input : {content}},
      update: (cache, {data}) => {
        const cacheId = cache.identify(data.message)
        cache.modify({
          fields: {
            messages: (existingFieldsData, { toReference }) => {
              return [...existingFieldsData, toReference(cacheId)]
            }
          }
        })
      }
    })
  }
}

### обновление с переупорядочиванием
cache.modify({
  fields: {
    archivePolls: (existingRыefs, { readField }) => {
      return existingRefs.filter(respRef => readField('id', respRef) !== data.savePollStatus.id)
    },
    polls: (existingFieldsData, { readField, toReference }) => {
      const apdatedPool = [...existingFieldsData, toReference(cacheId)]
      const sortedPool = apdatedPool.slice().sort((a, b) => (readField('dateOrder', a) > readField('dateOrder', b)) ? 1 : -1)
      return sortedPool
    }
  }
})


### обновление поля кэша после удаления каких-то полей
...
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
}
...

### удаление из кэша
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

#### еще способ удаления
  const [delPoll, { poll }] = useMutation(DELETE_POLL, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Удалить не удалось. Смотрите консоль.'
      })
      console.log(e)
    },
    update: (cache, { data }) => {
      const poll = data.deletePoll                                    
      cache.evict({ id: cache.identify(poll) })                         // удаляем весь объект
      cache.gc()                                                        // подчищаем недосигаемые объекты
    },
    onCompleted: () => {
      history.goBack()
    }
  })



# Работа с массивом
## REDUCE
### подсчет количества одного типа
data.reduce((acum, item) => {
  if (item.user) {
    if (!acum[item.user.id]) {
      acum[item.user.id] = 1
    } else {
      acum[item.user.id] = acum[item.user.id] + 1
    }
  }
  return acum
}, {})

### сопоставления id: {} - каждый с каждым
age.reduce((acum, item) => {
  if (item.active) {
    acum[item.id] = item.code
  }
  return acum
}, {})

### сопоставление id: [] - общий с массивом
upResults.reduce((acum, item) => {
  const cityId = item.likelyCity.id
  if (!acum.hasOwnProperty(cityId)) {
    acum[cityId] = []
  }
  acum[cityId].push(item)
  return acum
}, {})

### сортировка
const upQuestions = questions.map((question, index) => (
  {
    ...question,
    p: similarity(mainTitle, question.title)
  }
)).slice().sort((a, b) => (a.p < b.p) ? 1 : -1)                                     // сортировка от большего к меньшему


### Apollo client - обработка ошибок
const [addPoll, {
  loading: addLoading
}] = useMutation(ADD_NEW_POLL, {
  onError: ({ graphQLErrors }) => {
    let message = {}
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'BAD_USER_INPUT':
          if (err.extensions.type === '00013') {
            message = {
              type: 'error',
              text: 'Опрос с таким кодом уже существует'
            }
          }
          break
        default:
          message = {
            type: 'error',
            text: 'Добавить не удалось. Смотрите консоль.'
          }
      }
    }
    setNoti(message)
    console.log(graphQLErrors);
  },
  update: (cache, { data }) => {
    const { polls } = cache.readQuery({ query: GET_ALL_ACTIVE_POLLS })
    cache.writeQuery({ query: GET_ALL_ACTIVE_POLLS, data: { polls: [...polls, data.addPoll] } })
  }
})