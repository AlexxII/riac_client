import React from 'react'

import AdaptiveTabs from '../../components/AdaptiveTabs'

import Cities from './containers/Cities'
import Sample from './containers/Sample'
import Sex from './containers/Sex'
import Age from './containers/Age'
import CityCategory from './containers/CityCategory'

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
      component: <Sex />
    },
    {
      label: 'Возраст',
      component: <Age />
    },
    {
      label: 'ТНП',
      component: <CityCategory />
    }
  ]
  return (
    <AdaptiveTabs data={data} />
  )
}

export default PollAppSettings