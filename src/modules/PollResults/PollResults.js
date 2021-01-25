import React from 'react'

import AdaptiveTabs from '../../components/AdaptiveTabs'

import Generation from './containers/Generation'
import OverallResults from './containers/OverallResults'
import LinearDistibution from './containers/LinearDistribution'
import BatchInput from './containers/BatchInput'

const PollResults = ({ id }) => {
  const data = [
    {
      label: 'Общие',
      component: <OverallResults id={id} />
    },
    {
      label: 'Линейка',
      component: <LinearDistibution id={id} />
    },
    {
      label: 'Пакетный',
      component: <BatchInput id={id} />
    },
    // {
    //   label: 'Тестирование',
    //   component: <Generation id={id} />
    // }
  ]
  return (
    <AdaptiveTabs data={data} />
  )

}

export default PollResults