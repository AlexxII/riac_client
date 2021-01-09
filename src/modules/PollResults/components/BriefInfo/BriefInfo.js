import React, { useState, useEffect, Fragment } from 'react'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import LoadingState from '../../../../components/LoadingState'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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

      let shownData = ''
      for (let city in groupedObj) {
        const cityData = groupedObj[city]
        const results = cityData.map(obj => obj.result)
        const data = prepareResultsDataToExport(results)
        shownData += city + '\n'
        shownData += '' + data + '\n'
      }
      setGroupedData(shownData)

    }
  }, [open])

  if (!open) {
    return null
  }

  // if (!selectedData || !groupedData) return (
  // )

  const Info = () => {
    return (
      <Fragment>
        {!groupedData ?
          <LoadingState />
          :
          groupedData
        }
      </Fragment>
    )
  }

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
        content: <Info />
      }}
      config={{
        closeBtn: "Отмена",
        width: "md"
      }}
    />
  )
}

export default BriefInfo