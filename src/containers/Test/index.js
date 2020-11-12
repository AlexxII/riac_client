import React, { Fragment, useState, useEffect } from 'react'

const Test = () => {
  const [timerData] = useState()
  useEffect(() => {
    const handle = setInterval(() => {
      timerData.secondsPassed++
    }, 1000)
    return () => {
      clearTimeout(handle)
    }
  }, [])


  const Border = ({ children, color }) => {
    return (
      <div className={"test-nested-" + color}>{children}</div>
    )

  }

  return (
    <Border color="green">
      <span>Seconds passed: {timerData.secondsPassed} </span>
    </Border>
  )
}

export default Test