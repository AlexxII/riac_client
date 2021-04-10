import React, { useState, useEffect, Fragment } from 'react'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import LoadingState from '../../../../components/LoadingState'

import { prepareResultsDataToExport } from '../../lib/utils'

const BriefInfo = ({ data, selectPool, open, close }) => {
  const [selectedData, setSelectedData] = useState([])
  const [groupedData, setGroupedData] = useState([])

  useEffect(() => {
    if (open) {
      const needData = data.filter(respondent => selectPool.includes(respondent.id))
        .slice()
        .sort((a, b) => a.city && b.city ? (a.city.category.order > b.city.category.order) ? 1 : -1 : 1)
        .sort((a, b) => a.city && b.city ? (a.city.category.id > b.city.category.id) ? 1 : -1 : 1)
      setSelectedData(needData)

      const groupedObj = needData.reduce((groups, item) => ({
        ...groups,
        [item.city ? item.city.title : null]: [...(groups[item.city ? item.city.title : null] || []), item]
      }), {});

      let shownLine = []
      for (let city in groupedObj) {
        const cityData = groupedObj[city]
        const results = cityData.map(obj => obj.result)
        const data = prepareResultsDataToExport(results).split('\n')
        shownLine = [
          ...shownLine,
          city,
          ...data
        ]
      }
      setGroupedData(shownLine)
    }
  }, [open])

  if (!open) {
    return null
  }

  const Content = () => {
    return (
      <Fragment>
        {!groupedData ?
          <LoadingState />
          :
          groupedData.map((line, index) => (
            <Fragment key={index}>
              <span>{line}</span><br />
            </Fragment>
          ))
        }
      </Fragment>
    )
  }

  return (
    <ConfirmDialog
      open={open}
      close={close}
      data={{
        title: 'Краткая информация',
        content: <Content />
      }}
      config={{
        closeBtn: "Отмена",
        width: "md"
      }}
    />
  )
}

export default BriefInfo