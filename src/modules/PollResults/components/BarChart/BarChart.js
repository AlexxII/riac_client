import React, { Fragment, useEffect, useRef, useState } from 'react'
import Chart from 'chart.js'

const BarChart = ({ question }) => {

  const [data, setData] = useState({
    labels: question.answers.map((_, index) => index + 1 + ''),
    set: [
      {
        label: 'Кол-во',
        data: question.answers.map(answer => answer.results.length)
      }
    ]
  })

  const chartRef = useRef()
  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d")

    new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: data.set
      },
      options: {
        showLines: false, // disable for all datasets
        animation: {
          duration: 0 // general animation time
        },
        hover: {
          animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        legend: {
          display: false,
          labels: {
            // This more specific font property overrides the global property
            fontColor: 'black',
            fontSize: 16
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }, [])

  return (
    <Fragment>
      <canvas ref={chartRef} />
    </Fragment>
  )
}

export default BarChart