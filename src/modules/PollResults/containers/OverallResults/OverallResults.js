import React, { Fragment, useEffect, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';

import Select from 'react-select'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import QuestionCard from '../../components/QuestionCard'
import AnswerCard from '../../components/AnswersCard'
import RespondentCard from '../../components/RespondentCard'

import { useApolloClient } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_RESULTS, GET_FILTER_SELECTS } from './queries'
import { DELETE_RESULTS } from './mutations'

const OverallResults = ({ id }) => {
  const client = useApolloClient();
  const [delOpen, setDelOpen] = useState(false)
  const [activeResults, setActiveResults] = useState()
  const [filters, setFilters] = useState({
    cities: [],
    intervievers: [],
    sex: [],
    age: []
  })
  const [activeFilters, setActiveFilters] = useState()
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
  } = useQuery(GET_POLL_RESULTS, {
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
        ...filters,
        cities: filtersResults.cities.map(city => {
          return {
            value: city.id,
            title: city.title
          }
        }),
        intervievers: filtersResults.intervievers.map(iViever => {
          return {
            value: iViever.id,
            title: iViever.username
          }
        }),
      })
    }
  })
  const [
    deleteResult,
    { loading: loadOnDelete, error: errorWhileDeleting }
  ] = useMutation(DELETE_RESULTS)

  useEffect(() => {
    if (activeFilters) {
      if (activeFilters.cities.length) {
        const rrr = pollResults.pollResults.filter(
          result => {
            if (result.city) {
              return activeFilters.cities.includes(result.city.id)
            }
            return false
          }
        )
        setActiveResults(rrr)
      } else {
        setActiveResults(pollResults.pollResults)
      }
    }
  }, [activeFilters])


  const handleChange = (_, __) => {

  }

  if (pollResultsLoading || !pollResults || !activeResults || !filters || loadOnDelete) return (
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

  const showDetails = ({ result }) => {
    const oderedResults = result.slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
    const datails = oderedResults.map(obj => {
      if (obj.text !== '') {
        return obj.code + ' ' + obj.text
      }
      return obj.code
    })
    console.log(datails);
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

  const handleCityChange = (_, values) => {
    const cities = values.map(city => city.value)
    setActiveFilters({
      cities
    })
  }

  const deleteComplitely = () => {
    deleteResult({
      variables: {
        results: selectPool
      },
      update: (cache, { data }) => {
        const deletedPool = data.deleteResults.map(del => del.id)
        setActiveResults(activeResults.filter(result => !deletedPool.includes(result.id)))
        console.log(cache.data.data);
        cache.modify({
          fields: {
            pollResults(existingRefs, { readField }) {
              console.log(existingRefs);
              return existingRefs.filter(respRef => !deletedPool.includes(readField('id', respRef)))
            }
          }
        })
      }
    })
    setDelOpen(false)
  }

  const downloadIt = (data) => {
    const element = document.createElement('a')
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element);
    element.click();
  }

  const handleResultsExport = () => {
    const resultsPool = activeResults.filter(result =>
      selectPool.includes(result.id)
    ).map(obj => obj.result)
    const lResults = resultsPool.length
    let allResults = ''
    for (let i = 0; i < lResults; i++) {
      const oderedResults = resultsPool[i].slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
      const details = oderedResults.map(obj => {
        if (obj.text !== '') {
          return obj.code + ' ' + obj.text
        }
        return obj.code
      })
      allResults += details + '\n'
    }
    downloadIt(allResults)
  }

  const handleResultsDelete = () => {
    setDelOpen(true)
  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Fragment>
      <ConfirmDialog
        open={delOpen}
        confirm={deleteComplitely}
        close={() => setDelOpen(false)}
        data={
          {
            title: 'Удалить выбранные результаты?',
            text: 'Внимание! Выбранные результаты будут уничтожены безвозвратно. Будьте внимательны!'
          }
        }
      />
      <div className="result-service-zone">
        {/* <Typography className="header">Общие результаты опроса</Typography> */}
        <Grid container justify="space-between" className="service-buttons">
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResultsExport}
              disabled={!selectPool.length}
              startIcon={<PublishIcon />}
            >
              Выгрузить
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleResultsDelete}
              disabled={!selectPool.length}
              startIcon={<DeleteIcon />}
            >
              Удалить
            </Button>
          </Box>
        </Grid>
        <Grid container justify="flex-start" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Autocomplete
              multiple
              limitTags={1}
              options={filters.cities}
              disableCloseOnSelect
              clearOnEscape
              onChange={handleCityChange}
              noOptionsText={"Опции не настроены"}
              getOptionLabel={(option) => option.title}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Город" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Autocomplete
              multiple
              limitTags={1}
              options={filters.intervievers}
              disableCloseOnSelect
              clearOnEscape
              onChange={handleChange}
              noOptionsText={"Опции не настроены"}
              getOptionLabel={(option) => option.title}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Интервьюер" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Autocomplete
              multiple
              limitTags={1}
              options={filters.sex}
              disableCloseOnSelect
              clearOnEscape
              onChange={handleChange}
              noOptionsText={"Опции не настроены"}
              getOptionLabel={(option) => option.title}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Пол" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Autocomplete
              multiple
              limitTags={1}
              options={filters.age}
              disableCloseOnSelect
              clearOnEscape
              onChange={handleChange}
              noOptionsText={"Опции не настроены"}
              getOptionLabel={(option) => option.title}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.title}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Возраст" />
              )}
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