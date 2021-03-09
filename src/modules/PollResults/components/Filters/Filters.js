import React, { Fragment, useEffect, useState } from 'react'

import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import FlatPicker from '../../../../components/FlatPicker'

const Filters = ({ filters, pollFilters, cities, setActiveFilters, quota }) => {
  const [avaiableFilters, setAviableFilters] = useState()
  const [newFilter, setNewFilters] = useState(null)
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    if (avaiableFilters) {
      setAviableFilters({
        ...avaiableFilters,
        intervs: filters.intervievers
          .map(interv => ({
            value: interv.id,
            title: interv.username
          }))
          .map(interv => ({
            ...interv,
            count: quota.users[interv.value] !== undefined ? quota.users[interv.value] : 0
          }))
      })
    }
  }, [quota])

  useEffect(() => {
    const ageDef = pollFilters.age.reduce((acum, item) => {
      if (item.active) {
        acum[item.id] = item.code
      }
      return acum
    }, {})
    const sexDef = pollFilters.sex.reduce((acum, item) => {
      if (item.active) {
        acum[item.id] = item.code
      }
      return acum
    }, {})
    const customDef = pollFilters.custom.reduce((acum, item) => {
      if (item.active) {
        acum[item.id] = item.code
      }
      return acum
    }, {})
    const filter = {
      cities: cities
        .slice()
        .sort((a, b) => a.category.id > b.category.id ? 1 : -1)
        .sort((a, b) => a.category.order > b.category.order ? 1 : -1)
        .map(city => ({
          value: city.id,
          title: city.title,
          category: city.category.title
        })).map(city => ({
          ...city,
          count: quota.cities[city.value] !== undefined ? quota.cities[city.value] : 0
        })),
      intervs: filters.intervievers.map(interv => ({
        value: interv.id,
        title: interv.username,
      })).map(interv => ({
        ...interv,
        count: quota.users[interv.value] !== undefined ? quota.users[interv.value] : 0
      })),
      age: filters.ageCategories
        .filter(
          age => ageDef[age.id]
        )
        .map(
          age => ({
            value: ageDef[age.id] ? ageDef[age.id] : null,
            title: age.title
          })
        ),
      sex: filters.sex
        .filter(
          sex => sexDef[sex.id]
        )
        .map(
          sex => ({
            value: sexDef[sex.id] ? sexDef[sex.id] : null,
            title: sex.title
          })
        ),
      custom: filters.customFilters
        .filter(
          custom => customDef[custom.id]
        )
        .map(
          custom => ({
            value: customDef[custom.id] ? customDef[custom.id] : null,
            title: custom.title
          })
        ),
      status: filters.status
    }
    setAviableFilters(filter)
  }, [])

  // ФИЛЬТРЫ
  const handleDataChange = (dates) => {
    setNewFilters(prevState => ({
      ...prevState,
      date: dates
    }))
    setUpdated(true)
  }

  const handleAgeChange = (_, values) => {
    console.log(values);
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

  const handleCustomChange = (_, values) => {
    const customAr = values.map(obj => obj.value)
    setNewFilters(prevState => ({
      ...prevState,
      custom: customAr.length ? customAr : null
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
          <FlatPicker options={{
            mode: "multiple",
            dateFormat: "d.m.Y",
          }}
            handleDataChange={handleDataChange}
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
            renderTags={selected => {
              if (selected.length > 1) {
                return (
                  <Fragment>
                    <Chip size="small" label={selected[0].title.slice(0, 25) + '...'} />{' +' + (selected.length - 1)}
                  </Fragment>
                )
              } else {
                return (
                  <Chip size="small" label={selected[0].title.slice(0, 25) + '...'} />
                );
              }
            }}
            renderOption={(option, { selected }) => (
              <Fragment>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </Grid>
                  <Grid>
                    <Chip
                      variant="outlined"
                      size="small" label={option.value ? option.value : 'пусто'} />
                  </Grid>
                </Grid>
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
            renderOption={(option, { selected }) => (
              <Fragment>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid>
                    {option.title}
                  </Grid>
                  <Grid>
                    <Chip
                      variant="outlined"
                      size="small" label={option.value} />
                  </Grid>
                </Grid>
              </Fragment>
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
            renderTags={selected => {
              if (selected.length > 1) {
                return (
                  <Fragment>
                    <Chip size="small" label={selected[0].title.slice(0, 25) + '...'} />{' +' + (selected.length - 1)}
                  </Fragment>
                )
              } else {
                return (
                  <Chip size="small" label={selected[0].title.slice(0, 25) + '...'} />
                );
              }
            }}
            renderOption={(option, { selected }) => (
              <Fragment>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </Grid>
                  <Grid>
                    <Chip size="small" label={option.count} />
                  </Grid>
                </Grid>
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
            renderTags={selected => {
              if (selected.length > 1) {
                return (
                  <Fragment>
                    <Chip size="small" label={selected[0].title.slice(0, 25) + '...'} />{' +' + (selected.length - 1)}
                  </Fragment>
                )
              } else {
                return (
                  <Chip size="small" label={selected[0].title.slice(0, 25) + '...'} />
                );
              }
            }}
            renderOption={(option, { selected }) => (
              <Fragment>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </Grid>
                  <Grid>
                    <Chip size="small" label={option.count} />
                  </Grid>
                </Grid>
              </Fragment>
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
            options={avaiableFilters.custom}
            disableCloseOnSelect
            clearOnEscape
            onChange={handleCustomChange}
            size="small"
            noOptionsText={"Опции не настроены"}
            getOptionLabel={(option) => option.title}
            renderTags={selected => {
              if (selected.length > 1) {
                return (
                  <Fragment>
                    <Chip size="small" label={selected[0].title.slice(0, 25) + '...'} />{' +' + (selected.length - 1)}
                  </Fragment>
                )
              } else {
                return (
                  <Chip size="small" label={selected[0].title.slice(0, 25) + '...'} />
                );
              }
            }}
            renderOption={(option, { selected }) => (
              <Fragment>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </Grid>
                  <Grid>
                    <Chip
                      variant="outlined"
                      size="small" label={option.value ? option.value : 'пусто'} />
                  </Grid>
                </Grid>
              </Fragment>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Настраиваемый фильтр" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Autocomplete
            options={[
              {
                value: true,
                title: 'Обработан'
              },
              {
                value: false,
                title: 'Не обработан'
              }
            ]}
            onChange={handleStatusChange}
            size="small"
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