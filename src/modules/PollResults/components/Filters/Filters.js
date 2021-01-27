import React, { Fragment, useState } from 'react'

import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Button from '@material-ui/core/Button';

const Filters = ({ filters, cities, setActiveFilters }) => {
  const [avaiableFilters] = useState({
    age: filters.ageCategories.map(
      age => ({
        value: age.id,
        title: age.title
      })
    ),
    cities: cities
      .slice()
      .sort((a, b) => a.category.id > b.category.id ? 1 : -1)
      .sort((a, b) => a.category.order > b.category.order ? 1 : -1)
      .map(city => ({
        value: city.id,
        title: city.title,
        category: city.category.title
      })),
    intervs: filters.intervievers.map(interv => ({
      value: interv.id,
      title: interv.username,
    })),
    sex: filters.sex,
    status: filters.status
  })
  const [newFilter, setNewFilters] = useState(null)
  const [updated, setUpdated] = useState(false)

  // ФИЛЬТРЫ
  const handleDataChange = (e) => {
    const RegExp = /(\d{4})-(\d{2})-(\d{2})/
    const date = e.target.value
    setNewFilters(prevState => ({
      ...prevState,
      date: e.target.value.replace(RegExp, '$3.$2.$1'),
      shownDate: date
    }))
    setUpdated(true)
  }

  const cleareDate = () => {
    setNewFilters(prevState => ({
      ...prevState,
      date: null,
      shownDate: null
    }))
    setUpdated(true)
  }

  const handleAgeChange = (_, values) => {
    const ages = values.map(age => age.value)
    setNewFilters(prevState => ({
      ...prevState,
      ages: ages.length ? ages : null
    }))
    setUpdated(true)
  }

  const handleSexChange = (_, value) => {
    setNewFilters(prevState => ({
      ...prevState,
      sex: value ? value.value : null
    }))
    setUpdated(true)
  }

  const handleCityChange = (_, values) => {
    const ct = values.map(city => city.value)
    setNewFilters(prevState => ({
      ...prevState,
      cities: ct.length ? ct : null
    }))
    setUpdated(true)
  }

  const handleInterviewersChange = (_, values) => {
    const intervs = values.map(interv => interv.value)
    setNewFilters(prevState => ({
      ...prevState,
      intervs: intervs.length ? intervs : null
    }))
    setUpdated(true)
  }

  const handleStatusChange = (_, value) => {
    setNewFilters(prevState => ({
      ...prevState,
      status: value ? value.value : null
    }))
    setUpdated(true)
  }

  const handleFilter = () => {
    setActiveFilters(newFilter)
    setUpdated(false)
  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  if (!avaiableFilters) return <p></p>

  return (
    <Fragment>
      <Grid container justify="flex-start" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <TextField
            style={{ width: '100%' }}
            id="date"
            type="date"
            variant="outlined"
            value={newFilter ? newFilter.shownDate ? newFilter.shownDate : '' : ''}
            onChange={handleDataChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {true ?
                    <Tooltip title="Очистить">
                      <ClearIcon style={{ cursor: "pointer" }}
                        onClick={cleareDate}
                      />
                    </Tooltip>
                    :
                    ""
                  }
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Autocomplete
            multiple
            limitTags={1}
            options={avaiableFilters.age}
            disableCloseOnSelect
            clearOnEscape
            onChange={handleAgeChange}
            size="small"
            noOptionsText={"Опции не настроены"}
            getOptionLabel={(option) => option.title}
            renderOption={(option, { selected }) => (
              <Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.title}
              </Fragment>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Возраст" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Autocomplete
            options={avaiableFilters.sex}
            onChange={handleSexChange}
            size="small"
            noOptionsText={"Опции не настроены"}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Пол" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Autocomplete
            multiple
            limitTags={1}
            options={avaiableFilters.cities}
            groupBy={(option) => option.category}
            disableCloseOnSelect
            clearOnEscape
            onChange={handleCityChange}
            size="small"
            noOptionsText={"Опции не настроены"}
            getOptionLabel={(option) => option.title}
            renderOption={(option, { selected }) => (
              <Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.title}
              </Fragment>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Город"
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container justify="flex-start" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Autocomplete
            multiple
            limitTags={1}
            options={avaiableFilters.intervs}
            disableCloseOnSelect
            clearOnEscape
            onChange={handleInterviewersChange}
            size="small"
            noOptionsText={"Опции не настроены"}
            getOptionLabel={(option) => option.title}
            renderOption={(option, { selected }) => (
              <Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.title}
              </Fragment>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Интервьюер" />
            )}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3} lg={3}>
          <Autocomplete
            options={avaiableFilters.status}
            onChange={handleStatusChange}
            size="small"
            noOptionsText={"Опции не настроены"}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Статус" />
            )}
          />
        </Grid> */}
        <Grid item container xs={12} sm={6} md={3} lg={3} justify="flex-start">
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            disabled={!updated}
          >
            применить
            </Button>
        </Grid>
      </Grid>
    </Fragment>
  )
}
export default Filters