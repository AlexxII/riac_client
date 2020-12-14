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

const Filters = ({ filters, setActiveFilters }) => {
  const [ddate, setDdate] = useState()

  const handleDataChange = (e) => {
    const date = e.target.value
    setDdate(date)
  }

  const handleChange = (_, __) => {

  }

  // ФИЛЬТРЫ
  const handleCityChange = (_, values) => {
    const cities = values.map(city => city.value)
    setActiveFilters({
      cities
    })
  }

  const handleStatusChahge = (_, values) => {

  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;


  return (
    <Fragment>
      <Grid container justify="flex-start" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <TextField
            style={{ width: '100%' }}
            id="date"
            type="date"
            variant="outlined"
            value={ddate}
            onChange={handleDataChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {true ?
                    <Tooltip title="Очистить">
                      <ClearIcon style={{ cursor: "pointer" }}
                        onClick={() => setDdate('')}
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
            options={filters.cities.sort((a, b) => a.category - b.category)}
            groupBy={(option) => option.category}
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
            options={filters.status}
            onChange={handleStatusChahge}
            noOptionsText={"Опции не настроены"}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Статус" />
            )}
          />
        </Grid>
        <Grid item container xs={12} sm={6} md={3} lg={3} justify="flex-start">
          <Button
            variant="contained"
          // onClick={handleResultsExport}
          // disabled={!selectPool.length}
          >
            применить
            </Button>
        </Grid>
      </Grid>
    </Fragment>
  )


}

export default Filters