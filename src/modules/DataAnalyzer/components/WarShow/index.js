import React, { Fragment } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';


const WarShow = ({ data }) => {
  return (
    <Fragment>
      <Grid container spacing={3}>
        {data.map(({ person, places }, index) => {
          const placesOfWork = places.map(({ title, workDays }) => {
            const workD = workDays.map(d => <span><span>{d}</span><br /></span>)
            return (
              <span>
                <span className="work-title">{title}</span><br />
                <span>{workD}</span>
              </span>
            )
          })
          return (
            <Grid item xs={6} sm={6} md={4}>
              <Paper>
                <span>№ п.п. {index + 1}</span><br />
                <span>№ по списку {person[0]}</span><br />
                <span>{person[1]}</span><span className="person-name">{`${person[2]} ${person[3]} ${person[4].slice(0, -1)} `}</span><br />
                <span>{`${person[2]} ${person[3].substring(0, 1)}.${person[4].substring(0, 1)}. `}</span><br />
                <span>Дата рождения: {person[5]}</span><br />
                <span>Дата увольнения:</span><span className="person-out"> {person[6]}</span>
                <Divider />
                <span className="work-header"><em>Места работы:</em></span><br />
                <span>{placesOfWork}</span>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Fragment>
  )
}

export default WarShow