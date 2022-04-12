import React, { Fragment, useState } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';
import PollCard from '../../../PollHome/components/PollCard'
import YearsList from '../YearsList'

const YearWrap = ({ polls }) => {
  const [years, setYears] = useState(null)
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState([]);

  useState(() => {
    setSelected(polls.archivePolls);
    const years = polls.archivePolls.reduce((acum, item) => {
      const pollYear = item.startDate.slice(-4)
      if (!acum.hasOwnProperty(pollYear)) {
        acum[pollYear] = []
      }
      acum[pollYear].push({
        id: item.id,
        count: item.resultsCount
      })
      return acum
    }, {})
    const yearsPool = []
    for (let key in years) {
      yearsPool.push({
        title: key,
        data: years[key]
      })
    }
    setYears(yearsPool)
  }, [])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    if (newChecked.length === 0) {
      setSelected(polls.archivePolls);
      return
    } else {
      setSelected([])
    }
    const selectedIds = newChecked.reduce((acum, item) => {
      const ids = item.data.map((item) => item.id)
      acum = [...acum, ...ids]
      return acum
    }, [])
    const viewPolls = polls.archivePolls.filter((item, index) => {
      if (selectedIds.includes(item.id)) {
        return true

      }
      return false
    })
    setSelected(viewPolls)
  };

  return (
    <Fragment>
      <Grid item md={2} xs={12} >
        <p>
          <YearsList years={years} checked={checked} handleToggle={handleToggle} />
        </p>
      </Grid>
      <Grid item md={6} xs={12}>
        <Container maxWidth="md">
          {selected.length ?
            selected.map((poll, i) => (
              <PollCard key={i} data={poll} />
            ))
            :
            ''
          }
        </Container>
      </Grid>
    </Fragment>
  )
}

export default YearWrap