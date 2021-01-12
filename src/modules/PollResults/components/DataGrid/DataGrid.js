import React, { Fragment, useState } from 'react'

import Grid from '@material-ui/core/Grid'

import RespondentCard from '../RespondentCard'

const DataGrid = ({ data, selectPool, setSelectPool, showDetails, updateSingle }) => {
  const [lastSelectedIndex, setLastSelectedIndex] = useState()

  const handleSelect = (inData) => {
    if (inData.event.nativeEvent.shiftKey) {
      let ar = []
      if (inData.index + 1 > lastSelectedIndex) {
        ar = data.slice(lastSelectedIndex, inData.index + 1)
      } else {
        ar = data.slice(inData.index, lastSelectedIndex)
      }
      const rr = ar.filter(obj => !selectPool.includes(obj.id)).map(obj => obj.id)
      setSelectPool(prevState => ([
        ...prevState,
        ...rr
      ]))
      setLastSelectedIndex(inData.index)
      return
    }
    setLastSelectedIndex(inData.index)
    if (inData.event.nativeEvent.ctrlKey) {
      if (selectPool.includes(inData.id)) {
        const n = selectPool.filter(id => {
          return id !== inData.id
        })
        setSelectPool(n)
        return
      } else {
        setSelectPool(prevState => ([
          ...prevState,
          inData.id
        ]))
        return
      }
    }
    // при простом клике мышью
    if (selectPool.includes(inData.id)) {
      if (selectPool.length > 1) {
        setSelectPool([inData.id])
        return
      }
      setSelectPool([])
    } else {
      setSelectPool([inData.id])
    }
  }

  const dataItems = data.map((result, index) => (
    <Grid item xs={12} sm={6} md={3} lg={2} key={index} >
      <RespondentCard
        respondent={result}
        index={index}
        show={showDetails}
        edit={updateSingle}
        selected={selectPool.includes(result.id)}
        select={handleSelect}
        count={selectPool.length}
      />
    </Grid>
  ))

  return (
    <Fragment>
      <Grid item container spacing={3} xs={12}>
        {dataItems}
      </Grid>
    </Fragment>
  )
}

export default DataGrid