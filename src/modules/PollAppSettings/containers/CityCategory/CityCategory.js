import React, { Fragment, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import ConfirmDialog from '../../../../components/ConfirmDialog'

import CategoryCard from '../../components/CategoryCard'
import CategoriesList from '../../components/CategoriesList'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_CITIES_CATEGORIES } from './queries'
import { CHANGE_CATEGORY_STATUS, SAVE_NEW_CATEGORY, DELETE_CATEGORY } from './mutaions'

const CityCategory = () => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [delId, setDelId] = useState(false)
  const [newCat, setNewCat] = useState(false)

  const {
    data: citiesCategories,
    loading: citiesCategoriesLoading,
    error: citiesCategoriesError
  } = useQuery(GET_CITIES_CATEGORIES)

  const [changeActiveStatus, { loading: changeActiveStatusLoading }] = useMutation(CHANGE_CATEGORY_STATUS, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Изменить статус не удалось. Смотрите консоль.'
      })
      console.log(e);
    },
    update: (cache, { data: { changeCategoryStatus } }) => cache.writeQuery({
      query: GET_CITIES_CATEGORIES,
      data: {
        cityCategories: citiesCategories.cityCategories.map(category => category.id === changeCategoryStatus.id ? changeCategoryStatus : category)
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
    update: (cache, { data: { saveNewCategory } }) => cache.writeQuery({
      query: GET_CITIES_CATEGORIES,
      data: {
        cityCategories: [
          ...citiesCategories.cityCategories,
          saveNewCategory
        ]
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
    if (changeActiveStatusLoading || saveNewCategoryLoading) return <LoadingStatus />
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

  const handleCategoryAdd = () => {
    setNewCat(true)
  }

  const changeActive = (category) => {
    changeActiveStatus({
      variables: {
        id: category.id,
        status: !category.active
      }
    })
  }

  const handleCategoryEdit = (data) => {
    console.log(data);
  }

  const handleCategorySave = (data) => {
    saveNewCategory({
      variables: {
        title: data
      }
    })
    setNewCat(false)
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
        <Typography  variant="body2" gutterBottom>
          Внимание! Данная настройка формирует типы населенных пунктов. Изменяйте их в случае крайней необходимости.
        </Typography>
      </div>
      <div className="categories-add-zone">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCategoryAdd}
        >
          Добавить
        </Button>
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
            content: 'Внимание! Результаты опросов учитывают тип населенного пункта, удаление приведет к потере части статистики и некорректности ее отображения.'
          }
        }
      />
      <Grid container spacing={3} xs={12}>
        <CategoriesList
          newCat={newCat}
          categories={citiesCategories.cityCategories}
          handleChangeActive={changeActive}
          handleCategoryDelete={deleteCategory}
          handleNewSave={handleCategorySave}
          close={() => setNewCat(false)}
          handleEdit={handleCategoryEdit}
        />
      </Grid>
    </Fragment>
  )
}

export default CityCategory