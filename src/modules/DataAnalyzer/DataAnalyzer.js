import React from 'react'

import AdaptiveTabs from '../../components/AdaptiveTabs'

import ParchaXmlAnalyzer from './components/ParchaXmlAnalyzer'

const DataAnalyzer = () => {
  const data = [
    {
      label: 'Парча',
      component: <ParchaXmlAnalyzer />
    }
  ]
  return (
    <AdaptiveTabs data={data} />
  )
}

export default DataAnalyzer