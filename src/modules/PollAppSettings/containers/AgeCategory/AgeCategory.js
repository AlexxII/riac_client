import React, { Fragment, useState, useContext } from 'react'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import { SysnotyContext } from '../../../../containers/App/notycontext'

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import ConfirmDialog from '../../../../components/ConfirmDialog'

import SortableEditList from '../../components/SortableEditList'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_AGE_CATEGORIES } from './queries'
import {
  CHANGE_AGE_CATEGORY_STATUS, CHANGE_CATEGORY_ORDER,
  SAVE_NEW_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY
} from './mutations'

const AgeCategory = () => {
  const [setNoti] = useContext(SysnotyContext);
  const [loadingMsg, setLoadingMsg] = useState()
  const [delId, setDelId] = useState(false)
  const [newOrder, setNewOrder] = useState([])

  const {
    data: ageCategories,
    loading: ageCategoriesLoading,
    error: ageCategoriesError
  } = useQuery(GET_AGE_CATEGORIES)

  const [changeActiveStatus, { loading: changeActiveStatusLoading }] = useMutation(CHANGE_AGE_CATEGORY_STATUS, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Изменить статус категории не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { changeAgeCategoryStatus } }) => cache.writeQuery({
      query: GET_AGE_CATEGORIES,
      data: {
        ageCategories: ageCategories.ageCategoriesAll.map(category => category.id === changeAgeCategoryStatus.id ? changeAgeCategoryStatus : category)
      }
    })
  })

  const [saveNewCategory, { loading: saveNewCategoryLoading }] = useMutation(SAVE_NEW_CATEGORY, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Сохранить категорию не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { saveNewAgeCategory } }) => cache.writeQuery({
      query: GET_AGE_CATEGORIES,
      data: {
        ageCategoriesAll: [
          ...ageCategories.ageCategoriesAll,
          saveNewAgeCategory
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
    update: (cache, { data: { updateAgeCategory } }) => cache.writeQuery({
      query: GET_AGE_CATEGORIES,
      data: {
        ageCategoriesAll: ageCategories.ageCategoriesAll.map(category => category.id === updateAgeCategory.id ? updateAgeCategory : category)
      }
    })
  })

  const [deleteCityCategory, { loading: deleteCategoryLoading }] = useMutation(DELETE_CATEGORY, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Удалить категорию не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { deleteAgeCategory } }) => cache.writeQuery({
      query: GET_AGE_CATEGORIES,
      data: {
        ageCategoriesAll: ageCategories.ageCategoriesAll.filter(city => city.id === deleteAgeCategory.id ? false : true)
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
    update: (cache, { data }) => cache.writeQuery({
      query: GET_AGE_CATEGORIES,
      data: {
        ageCategoriesAll: newOrder
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

  if (ageCategoriesLoading) return (
    <LoadingState />
  )

  if (ageCategoriesError) {
    console.log(JSON.stringify(ageCategoriesError));
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
        ages: data.deltaArray
      }
    })
  }

  return (
    <Fragment>
      <Loading />
      <div className="age-service-zone">
        <Typography variant="h5" gutterBottom className="header">Категории возраста</Typography>
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
            title: 'Удалить категорию возраста?',
            content: `Внимание! Результаты опросов учитывают возраст респондента, удаление приведет к потере части статистики и некорректности ее отображения.`
          }
        }
      />
      <Grid container spacing={3} xs={12}>
        <SortableEditList
          data={ageCategories.ageCategoriesAll}
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

export default AgeCategory