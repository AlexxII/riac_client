import React, { useState, useEffect, Fragment } from 'react'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import LoadingState from '../../../../components/LoadingState'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const BriefInfo = ({ data, selectPool, open, close }) => {
  const [selectedData, setSelectedData] = useState([])
  const [groupedData, setGroupedData] = useState([])

  useEffect(() => {
    if (open) {
      const needData = data.filter(respondent => selectPool.includes(respondent.id))
        .slice()
        .sort((a, b) => (a.city.category.order > b.city.category.order) ? 1 : -1)
        .sort((a, b) => (a.city.category.id > b.city.category.id) ? 1 : -1)
      setSelectedData(needData)

      const groupedObj = needData.reduce((groups, item) => ({
        ...groups,
        [item.city.title]: [...(groups[item.city.title] || []), item]
      }), {});

      let groupedAr = []
      for (let key in groupedObj) {
        groupedAr.push({
          [key]: groupedObj[key]
        })
      }
      setGroupedData(groupedAr)
    }
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

  const contentViewGrouped = groupedData.map(group => {
    const city = Object.getOwnPropertyNames(group)[0]
    const pp = group[city].map(respondent => {
      const oderedResults = respondent.result.slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
      const datails = oderedResults.map(obj => {
        if (obj.text !== '') {
          return obj.code + ' ' + obj.text
        }
        return obj.code
      })
      return datails + ',999' + '\n'
    })
    const temp = pp + '\n'
    return (
      <Fragment>
        <p>{city}</p>
        <p>{temp}</p>
      </Fragment>
    )
  })

  const Test = () => {
    const [value, setValue] = React.useState(2);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Active" />
        <Tab label="Disabled" disabled />
        <Tab label="Active" />
      </Tabs>
    )
  }

  return (
    <ConfirmDialog
      open={open}
      close={close}
      data={{
        title: 'Краткая информация',
        // content: '2222'
        content: contentViewGrouped
        // content: contentViewCommon
      }}
      config={{
        closeBtn: "Отмена",
        width: "md"
      }}
    />
  )
}

export default BriefInfo