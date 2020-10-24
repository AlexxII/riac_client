import React, { Fragment } from 'react'

const CsvShow = ({ data }) => {
  return (
    <Fragment>
      {data.map(({ person, places }, index) => {
        const place = places.map(({ title, workDays }) => {
          return `${title}${workDays.toString()};`
        })
        return (
          <span>
            <span>{`${person[0]};${person[1]};${person[2]}
              ;${person[3]};${person[4]};${person[5]};${person[6]};${place}\r`}</span><br />
          </span>
        )
      })}
    </Fragment>
  )
}

export default CsvShow