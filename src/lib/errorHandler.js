const userErrors = {
  '000411': 'Пользователь уже существует',
  '000431': 'Опрос с таким кодом уже существует'
}

const errorHandler = (graphQLErrors) => {
  let message = {}
  for (let err of graphQLErrors) {
    switch (err.extensions.code) {
      case 'BAD_USER_INPUT':
        if (userErrors[err.extensions.type]) {
          message = {
            type: 'error',
            text: userErrors[err.extensions.type]
          }
          break
        }
      case 'INTERNAL_SERVER_ERROR':
        message = {
          type: 'error',
          text: err.message
        }
        break
      default:
        message = {
          type: 'error',
          text: 'Что-то пошло не так. Смотрите консоль.'
        }
    }
  }
  return message
}
export default errorHandler