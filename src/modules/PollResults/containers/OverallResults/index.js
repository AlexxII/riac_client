import React, { Fragment, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import Select from 'react-select'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import QuestionCard from '../../components/QuestionCard'
import AnswerCard from '../../components/AnswersCard'
import RespondentCard from '../../components/RespondentCard'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_RESULTS_EX, GET_FILTER_SELECTS } from './queries'

const OverallResults = ({ id }) => {
  const [activeResults, setActiveResults] = useState()
  const [filters, setFilters] = useState()

  const [selectPool, setSelectPool] = useState([])
  const [lastSelectedIndex, setLastSelectedIndex] = useState()
  const [delConfirm, setDelConfirm] = useState(false)
  const [message, setMessage] = useState({
    show: false,
    type: 'error',
    message: '',
    duration: 6000
  })
  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_POLL_RESULTS_EX, {
    variables: {
      id
    },
    onCompleted: () => {
      setActiveResults(pollResults.pollResults)
    }
  });
  const {
    data: filtersResults,
    loading: filtersResultsLoading,
    error: filtersResultsError
  } = useQuery(GET_FILTER_SELECTS, {
    onCompleted: () => {
      setFilters({
        cities: filtersResults.cities.map(city => {
          return {
            value: city.id,
            label: city.title
          }
        })
      })
      console.log(filtersResults);
    }
  })

  if (pollResultsLoading || !pollResults || !activeResults || !filters) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleDialogConfirm = () => {

  }

  const handleDialogClose = () => {

  }

  const showDetails = (result) => {
    const data = result.result
    const res = data.map(obj => {
      if (obj.text !== '') {
        return obj.code + ' ' + obj.text
      }
      return obj.code
    })
    console.log(res);
  }

  const handleEdit = () => {

  }

  const handleSelect = (data) => {
    if (data.event.nativeEvent.shiftKey) {
      let ar = []
      if (data.index + 1 > lastSelectedIndex) {
        ar = activeResults.slice(lastSelectedIndex, data.index + 1)
      } else {
        ar = activeResults.slice(data.index, lastSelectedIndex)
      }
      const rr = ar.filter(obj => !selectPool.includes(obj.id)).map(obj => obj.id)
      setSelectPool(prevState => ([
        ...prevState,
        ...rr
      ]))
      setLastSelectedIndex(data.index)
      return
    }
    setLastSelectedIndex(data.index)
    if (data.event.nativeEvent.ctrlKey) {
      if (selectPool.includes(data.id)) {
        const n = selectPool.filter(id => {
          return id !== data.id
        })
        setSelectPool(n)
        return
      } else {
        setSelectPool(prevState => ([
          ...prevState,
          data.id
        ]))
        return
      }
    }
    // при простом клике мышью
    if (selectPool.includes(data.id)) {
      if (selectPool.length > 1) {
        setSelectPool([data.id])
        return
      }
      setSelectPool([])
    } else {
      setSelectPool([data.id])
    }
  }
  const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
  ];

  // const animatedComponents = makeAnimated();

  const handleChange = (option) => {
    console.log(option);
  }

  return (
    <Fragment>
      <div className="result-service-zone">
        {/* <Typography className="header">Общие результаты опроса</Typography> */}
        <div className="">
          <Button
            variant="contained"
            color="secondary"
            disabled={!selectPool.length}
            startIcon={<DeleteIcon />}
          >
            Удалить
          </Button>
        </div>
        <Grid container justify="flex-start" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <label><strong>Города:</strong></label>
            <Select
              className="city-select"
              onChange={handleChange}
              closeMenuOnSelect={false}
              isMulti
              options={filters.cities}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <label><strong>Операторы:</strong></label>
            <Select
              className="user-select"
              onChange={handleChange}
              closeMenuOnSelect={false}
              isMulti
              options={colourOptions}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <label><strong>Пол:</strong></label>
            <Select
              className="user-select"
              onChange={handleChange}
              closeMenuOnSelect={false}
              isMulti
              options={colourOptions}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <label><strong>Возраст:</strong></label>
            <Select
              className="user-select"
              onChange={handleChange}
              closeMenuOnSelect={false}
              isMulti
              options={colourOptions}
            />
          </Grid>
        </Grid>
      </div>
      <ConfirmDialog
        open={delConfirm}
        confirm={handleDialogConfirm}
        close={handleDialogClose}
        data={
          {
            title: 'Удалить населенный пункт?',
            text: 'Внимание! Результаты опросов учитывают н.п. в которых они проводились, удаление приведет к потере части статистики и некорректности ее отображения.'
          }
        }
      />
      <Grid container spacing={3}>
        {activeResults.map((result, index) => (
          <Grid item xs={12} sm={6} md={3} lg={2} key={index} >
            <RespondentCard
              result={result}
              index={index}
              show={showDetails}
              edit={handleEdit}
              selected={selectPool.includes(result.id)}
              select={handleSelect}
            />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  )
}


export default OverallResults