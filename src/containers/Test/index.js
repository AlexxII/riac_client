import React, { Fragment, useState, useEffect } from 'react'
import DevTools from 'mobx-react-devtools'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

const Test = observer(() => {
  const [timerData] = useState(() =>
    observable({
      secondsPassed: 0,
    })
  )
  useEffect(() => {
    const handle = setInterval(() => {
      timerData.secondsPassed++
    }, 1000)
    return () => {
      clearTimeout(handle)
    }
  }, [])

  return (
    <span>Seconds passed: {timerData.secondsPassed} </span>
  )
})

export default Test