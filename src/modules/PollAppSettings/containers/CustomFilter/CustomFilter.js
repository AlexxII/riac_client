import React, { Fragment, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import ConfirmDialog from '../../../../components/ConfirmDialog'

import SortableEditList from '../../components/SortableEditList'

import { useQuery, useMutation } from '@apollo/client'

import { GET_CUSTOM_FILTERS } from './queries'
import {
  SAVE_NEW_FILTER, CHANGE_FILTERS_ORDER,
  CHANGE_FILTER_STATUS,
  DELETE_FILTER, UPDATE_FILTER
} from './mutaions'

const CityCategory = () => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [delId, setDelId] = useState(false)
  const [newOrder, setNewOrder] = useState([])

  const {
    data: customFilters,
    loading: customFiltersLoading,
    error: customFiltersError
  } = useQuery(
    GET_CUSTOM_FILTERS,
    {
      fetchPolicy: "no-cache"
    }
  )

  const [changeFilterStatus, { loading: changeFilterStatusLoading }] = useMutation(CHANGE_FILTER_STATUS, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Отключить активность не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { changeCustomFilterStatus } }) => cache.writeQuery({
      query: GET_CUSTOM_FILTERS,
      data: {
        customFiltersAll: customFilters.customFiltersAll.map(category => category.id === changeCustomFilterStatus.id ? changeCustomFilterStatus : category)
      }
    })
  })

  const [saveNewFilter, { loading: saveNewFilterLoading }] = useMutation(SAVE_NEW_FILTER, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Сохранить фильтр не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { saveNewCustomFilter } }) => cache.writeQuery({
      query: GET_CUSTOM_FILTERS,
      data: {
        customFiltersAll: [
          ...customFilters.customFiltersAll,
          saveNewCustomFilter
        ]
      }
    })
  })

  const [updateFilter, { loading: updateFilterLoading }] = useMutation(UPDATE_FILTER, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Обновить информацию не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { updateCustomFilter } }) => cache.writeQuery({
      query: GET_CUSTOM_FILTERS,
      data: {
        customFiltersAll: customFilters.customFiltersAll.map(category => category.id === updateCustomFilter.id ? updateCustomFilter : category)
      }
    })
  })

  const [deleteCustomFilter, { loading: deleteCusomFilterLoading }] = useMutation(DELETE_FILTER, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Удалить категорию не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { deleteCustomFilter } }) => cache.writeQuery({
      query: GET_CUSTOM_FILTERS,
      data: {
        customFiltersAll: customFilters.customFiltersAll.filter(city => city.id === deleteCustomFilter.id ? false : true)
      }
    })
  })

  const [saveNewOrder, { loading: saveNewOrderLoading }] = useMutation(CHANGE_FILTERS_ORDER, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Изменить порядок не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data }) => cache.writeQuery({
      query: GET_CUSTOM_FILTERS,
      data: {
        customFiltersAll: newOrder
      }
    })
  })

  const Loading = () => {
    if (changeFilterStatusLoading
      || saveNewFilterLoading
      || updateFilterLoading
      || deleteCusomFilterLoading
      || saveNewOrderLoading
    ) return <LoadingStatus />
    return null
  }

  if (customFiltersLoading) return (
    <LoadingState />
  )

  if (customFiltersError) {
    console.log(JSON.stringify(customFiltersError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const deleteCategory = (id) => {
    setDelId(id)
  }
  const handleDelConfirm = () => {
    deleteCustomFilter({
      variables: {
        id: delId
      }
    })
    setDelId(false)
  }

  const handleDelDialogClose = () => {
    setDelId(false)
  }

  const changeActive = (category) => {
    changeFilterStatus({
      variables: {
        id: category.id,
        status: !category.active
      }
    })
  }

  const handleEditSave = (data) => {
    updateFilter({
      variables: {
        id: data.id,
        title: data.title
      }
    })
  }

  const handleCategorySave = (data) => {
    saveNewFilter({
      variables: {
        title: data
      }
    })
  }

  const saveNewSort = (data) => {
    setNewOrder(data.newOrder)
    saveNewOrder({
      variables: {
        filters: data.deltaArray
      }
    })
  }

  return (
    <Fragment>
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Loading />
      <div className="age-service-zone">
        <Typography variant="h5" gutterBottom className="header">Настриваемый фильтр</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          В данном разделе настраивается фильтрация по полям, которые может задать сам пользователь.
        </Typography>
      </div>
      <ConfirmDialog
        open={delId}
        confirm={handleDelConfirm}
        close={handleDelDialogClose}
        config={{
          closeBtn: "Отмена",
          confirmBtn: "Удалить"
        }}
        data={
          {
            title: 'Удалить фильтр?'
          }
        }
      />
      <Grid container spacing={3} xs={12}>
        <SortableEditList
          data={customFilters.customFiltersAll}
          handleChangeActive={changeActive}
          handleCategoryDelete={deleteCategory}
          handleNewSave={handleCategorySave}
          handleEdit={handleEditSave}
          saveNewSort={saveNewSort}
        />
      </Grid>
    </Fragment>
  )
}

export default CityCategory