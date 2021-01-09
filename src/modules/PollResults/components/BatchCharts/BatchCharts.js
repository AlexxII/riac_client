import React, { Fragment, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import LoadingState from '../../../../components/LoadingState'

import BarChart from '../../components/BarChart'
import LinearTable from '../../components/LinearTable'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BatchCharts = ({ data, selectPool, open, close }) => {
  const classes = useStyles();
  const [selectedData, setSelectedData] = useState()

  useEffect(() => {
    if (open) {
      const newQuestions = data.poll.questions.map(question => {
        if (selectPool.length) {
          const newAnswer = question.answers.map(answer => {
            if (answer.results.length) {
              const newResults = answer.results.filter(result =>
                selectPool.includes(result.respondent.id)
              )
              return { ...answer, results: newResults }
            }
            return answer
          })
          return { ...question, answers: newAnswer }
        }
        return question
      })
      const dd = {
        ...data.poll,
        questions: newQuestions
      }
      setSelectedData(dd)
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div>
      <Dialog fullScreen open={open} onClose={close} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={close} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Графики
            </Typography>
          </Toolbar>
        </AppBar>
        <Container className="batch-linear">
          <Grid item container>
            {selectedData ?
              selectedData.questions.map((question, index) => (
                <Fragment>
                  <Grid xs={12} style={{ textAlign: 'center' }}>
                    <p className="question-title">{index + 1}. {question.title}</p>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <LinearTable index={index} key={question.id} question={question} />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <BarChart key={question.id} question={question} />
                  </Grid>
                </Fragment>
              ))
              :
              <LoadingState />
            }
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}
export default BatchCharts