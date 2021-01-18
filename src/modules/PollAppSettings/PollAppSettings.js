import React from 'react'

import AdaptiveTabs from '../../components/AdaptiveTabs'

import Cities from './containers/Cities'
import Sample from './containers/Sample'
import AgeCategory from './containers/AgeCategory'
import CityCategory from './containers/CityCategory'
import CustomFilter from './containers/CustomFilter'

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
      label: 'Фильтр',
      component: <CustomFilter />
    },
    {
      label: 'ТНП',
      component: <CityCategory />
    },
    {
      label: 'Возраст',
      component: <AgeCategory />
    }
  ]
  return (
    <AdaptiveTabs data={data} />
  )
}

export default PollAppSettings