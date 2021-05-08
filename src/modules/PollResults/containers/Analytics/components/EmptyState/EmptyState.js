import React from 'react'

import Alert from '../../../../../../components/Alert'

const EmptyState = ({ emptyMessage }) => {
  if (emptyMessage) {
    const message = 'В базе данных отсутствуют вопросы с аналогичной категорией'
    return <Alert text={message} />
  } else {
    return null
  }
}

export default React.memo(EmptyState)