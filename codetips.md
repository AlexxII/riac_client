Apollo client
============================
## обновление кэша
Импорт зависимостей
import { gql, useQuery, useLazyQuery, useApolloClient } from '@apollo/client'

# получение клиента в компоненте
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

# обновить скопом все вопросы опроса
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

# обновить весь опрос в кэше со всеми зависимостями
client.writeQuery({
  query: GET_POLL_DATA,
  data: {
    poll: mData
  }
})

# обновление после мутации
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

# удаление из кэша
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
