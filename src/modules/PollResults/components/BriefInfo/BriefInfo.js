import React, { useState, useEffect, Fragment } from 'react'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import LoadingState from '../../../../components/LoadingState'

const BriefInfo = ({ data, selectPool, open, close }) => {
  const [selectedData, setSelectedData] = useState([])
  const [groupedData, setGroupedData] = useState([])

  useEffect(() => {
    const needData = data.filter(respondent => selectPool.includes(respondent.id))
      .slice()
      .sort((a, b) => (a.city.category.order > b.city.category.order) ? 1 : -1)
      .sort((a, b) => (a.city.category.id > b.city.category.id) ? 1 : -1)
    setSelectedData(needData)
    const groups = needData.reduce((groups, item) => ({
      ...groups,
      [item.city.title]: [...(groups[item.city.title] || []), item]
    }), {});
    console.log(groups);
    setGroupedData(groups)
  }, [open])

  if (!open) {
    return null
  }

  if (!selectedData || !groupedData) return (
    <LoadingState />
  )

  const contentViewCommon = selectedData.map(respondent => {
    return (
      <Fragment>
        <p>{respondent.id}</p>
        <span>{respondent.city.category.title}</span>
      </Fragment>
    )
  })

  const contentViewGrouped = groupedData.map(respondent => {
    return (
      <Fragment>
        <p>{respondent.id}</p>
        <span>{respondent.city.category.title}</span>
      </Fragment>
    )
  })

  return (
    <ConfirmDialog
      open={open}
      close={close}
      data={{
        title: 'Краткая информация',
        content: contentViewCommon
      }}
      config={{
        closeBtn: "Отмена",
        width: "md"
      }}
    />
  )
}

export default BriefInfo