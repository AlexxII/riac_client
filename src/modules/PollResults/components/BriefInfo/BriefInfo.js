import React, { useState, useEffect, Fragment } from 'react'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import LoadingState from '../../../../components/LoadingState'

const BriefInfo = ({ data, selectPool, open, close }) => {
  const [selectedData, setSelectedData] = useState([])

  useEffect(() => {
    const needData = data.filter(respondent => selectPool.includes(respondent.id))
      .slice()
      .sort((a, b) => (a.city.category.order > b.city.category.order) ? 1 : -1)
      .sort((a, b) => (a.city.category.id > b.city.category.id) ? 1 : -1)
    setSelectedData(needData)
    console.log(needData);
  }, [open])

  if (!open) {
    return null
  }

  if (!selectedData) return (
    <LoadingState />
  )

  const contentView = selectedData.map(respondent => (
    <Fragment>
      <p>{respondent.id}</p>
      <span>{respondent}</span>
    </Fragment>
  ))

  return (
    <ConfirmDialog
      open={open}
      close={close}
      data={{
        title: 'Краткая информация',
        content: contentView
      }}
      config={{
        closeBtn: "Отмена"
      }}
    />
  )
}

export default BriefInfo