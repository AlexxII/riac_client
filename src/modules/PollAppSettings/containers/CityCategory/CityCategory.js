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

import { GET_CITIES_CATEGORIES } from './queries'
import {
  CHANGE_CATEGORY_STATUS, CHANGE_CATEGORY_ORDER,
  SAVE_NEW_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY
} from './mutations'

const CityCategory = () => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [delId, setDelId] = useState(false)
  const [newOrder, setNewOrder] = useState([])

  const {
    data: citiesCategories,
    loading: citiesCategoriesLoading,
    error: citiesCategoriesError
  } = useQuery(
    GET_CITIES_CATEGORIES,
    {
      fetchPolicy: "no-cache"
    }
  )

  const [changeActiveStatus, { loading: changeActiveStatusLoading }] = useMutation(CHANGE_CATEGORY_STATUS, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Изменить статус не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { changeCityCategoryStatus } }) => cache.writeQuery({
      query: GET_CITIES_CATEGORIES,
      data: {
        cityCategoriesAll: citiesCategories.cityCategoriesAll.map(category => category.id === changeCityCategoryStatus.id ? changeCityCategoryStatus : category),
      }
    })
  })

  const [saveNewCategory, { loading: saveNewCategoryLoading }] = useMutation(SAVE_NEW_CATEGORY, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Сохранить ТНП не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { saveNewCityCategory } }) => cache.writeQuery({
      query: GET_CITIES_CATEGORIES,
      data: {
        cityCategoriesAll: [
          ...citiesCategories.cityCategoriesAll,
          saveNewCityCategory
        ]
      }
    })
  })

  const [updateCategory, { loading: updateCategoryLoading }] = useMutation(UPDATE_CATEGORY, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Обновить информацию не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { updateCityCategory } }) => cache.writeQuery({
      query: GET_CITIES_CATEGORIES,
      data: {
        cityCategoriesAll: citiesCategories.cityCategoriesAll.map(category => category.id === updateCityCategory.id ? updateCityCategory : category),
      }
    })
  })

  const [deleteCityCategory, { loading: deleteCategoryLoading }] = useMutation(DELETE_CATEGORY, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Удалить ТНП не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { deleteCityCategory } }) => cache.writeQuery({
      query: GET_CITIES_CATEGORIES,
      data: {
        cityCategoriesAll: citiesCategories.cityCategoriesAll.filter(city => city.id === deleteCityCategory.id ? false : true),
      }
    })
  })

  const [saveNewOrder, { loading: saveNewOrderLoading }] = useMutation(CHANGE_CATEGORY_ORDER, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Изменить порядок не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { saveCityCategoryOrder } }) => cache.writeQuery({
      query: GET_CITIES_CATEGORIES,
      data: {
        cityCategoriesAll: newOrder
      }
    })
  })

  const Loading = () => {
    if (changeActiveStatusLoading
      || saveNewCategoryLoading
      || updateCategoryLoading
      || deleteCategoryLoading
      || saveNewOrderLoading
    ) return <LoadingStatus />
    return null
  }

  if (citiesCategoriesLoading) return (
    <LoadingState />
  )

  if (citiesCategoriesError) {
    console.log(JSON.stringify(citiesCategoriesError));
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
    deleteCityCategory({
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
    changeActiveStatus({
      variables: {
        id: category.id,
        status: !category.active
      }
    })
  }

  const handleEditSave = (data) => {
    updateCategory({
      variables: {
        id: data.id,
        title: data.title
      }
    })
  }

  const handleCategorySave = (data) => {
    saveNewCategory({
      variables: {
        title: data
      }
    })
  }

  const saveNewSort = (data) => {
    setNewOrder(data.newOrder)
    saveNewOrder({
      variables: {
        categories: data.deltaArray
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
      <div className="category-service-zone">
        <Typography variant="h5" gutterBottom className="header">Типы населенных пунктов</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Внимание! Необдуманная манипуляция этими данными приведет к потере части статистики. Изменяйте их в случае крайней необходимости.
          Если необходимо изменить категории, лучше отредактируйте существующие. При необходимости, добавьте недостающие.
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
            title: 'Удалить тип населенного пункта?',
            content: `Внимание! Результаты опросов учитывают тип населенного пункта, удаление приведет к потере части статистики и некорректности ее отображения.`
          }
        }
      />
      <Grid container spacing={3} xs={12}>
        <SortableEditList
          data={citiesCategories.cityCategoriesAll}
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