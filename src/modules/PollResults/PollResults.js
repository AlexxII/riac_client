import React from 'react'

import AdaptiveTabs from '../../components/AdaptiveTabs'

import Generation from './containers/Generation'
import OverallResults from './containers/OverallResults'
import LinearDistibution from './containers/LinearDistribution'
import Import from './containers/Import'
import Analytics from './containers/Analytics'
import Quota from './containers/Quota'

const PollResults = ({ id }) => {
  const data = [
    {
      label: 'Общие',
      component: <OverallResults id={id} />
    },
    {
      label: 'Аналитика',
      component: <Analytics id={id} />
    },
    // {
    //   label: 'Квота',
    //   component: <Quota id={id} />
    // },
    // {
    //   label: 'Линейка',
    //   component: <LinearDistibution id={id} />
    // },
    {
      label: 'Импорт',
      component: <Import id={id} />
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