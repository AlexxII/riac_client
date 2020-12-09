import React from 'react'

import VerticalTabs from '../../components/VerticalTabs'

import Cities from './containers/Cities'
import Sample from './containers/Sample'

const PollAppSettings = () => {
  const data = [
    {
      label: 'Города',
      component: <Cities />
    },
    {
      label: 'Выборка',
      component: <Sample />
    },
    {
      label: 'Пол',
      component: 'ПОЛ'
    },
    {
      label: 'Возраст',
      component: 'Возраст'
    },
    {
      label: 'Статус',
      component: 'Статус'
    },
    {
      label: 'ТНП',
      component: 'ТНП'
    }
  ]
  return (
    <VerticalTabs data={data} />
  )
}

export default PollAppSettings