import React, { Fragment, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import ConfirmDialog from '../../../../components/ConfirmDialog'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_CITIES_CATEGORIES } from './queries'
import { SAVE_NEW_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from './mutations'

const DocEntry = () => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()

  const {
    data: citiesCategories,
    loading: citiesCategoriesLoading,
    error: citiesCategoriesError
  } = useQuery(GET_CITIES_CATEGORIES)

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
        cityCategories: [
          ...citiesCategories.cityCategories,
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
        cityCategories: citiesCategories.cityCategories.map(category => category.id === updateCityCategory.id ? updateCityCategory : category)
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
        cityCategories: citiesCategories.cityCategories.filter(city => city.id === deleteCityCategory.id ? false : true)
      }
    })
  })

  const Loading = () => {
    if (saveNewCategoryLoading
      || updateCategoryLoading
      || deleteCategoryLoading
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
        <Typography variant="h5" gutterBottom className="header">Ввод документов</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
        </Typography>
      </div>
      <Grid container spacing={3} xs={12}>
      </Grid>
    </Fragment>
  )
}

export default DocEntry