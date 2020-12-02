import React, { Fragment, useState } from 'react'

import UsersTable from './components/UsersTable'

import LoadingState from '../../components/LoadingState'
import ErrorState from '../../components/ErrorState'
import SystemNoti from '../../components/SystemNoti'
import LoadingStatus from '../../components/LoadingStatus'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_ALL_USERS, GET_AUTH_SELECTS } from './queries'
import { ADD_NEW_USER, UPDATE_USER, DELETE_USERS, RESET_PASSWORD } from './mutations'

const Users = () => {
  const [noti, setNoti] = useState(false)
  const {
    loading: dataLoading,
    error: dataError,
    data
  } = useQuery(GET_ALL_USERS)
  const {
    loading: selectsLoading,
    error: selectsError,
    data: selects
  } = useQuery(GET_AUTH_SELECTS)

  const [deleteUsers, { loading: deleteLoading }] = useMutation(DELETE_USERS,
    {
      onError: (e) => {
        setNoti({
          type: 'error',
          text: 'Удалить не удалось. Смотрите консоль.'
        })
        console.log(e);
      },
      update: (cache, { data: { deleteUsers } }) => cache.writeQuery({
        query: GET_ALL_USERS,
        data: {
          users: data.users.filter(user => {
            for (let i = 0; i < deleteUsers.length; i++) {
              if (deleteUsers[i].id === user.id) return false
            }
            return true
          })
        }
      })
    }
  )
  const [addUser, { loading: addLoading }] = useMutation(ADD_NEW_USER,
    {
      onError: (e) => {
        setNoti({
          type: 'error',
          text: 'Добавить не удалось. Смотрите консоль.'
        })
        console.log(e);
      },
      update: (cache, { data: { addNewUser } }) => cache.writeQuery({
        query: GET_ALL_USERS,
        data: {
          users: [
            ...data.users,
            addNewUser
          ]
        }
      })
    }
  )

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER,
    {
      onError: (e) => {
        setNoti({
          type: 'error',
          text: 'Обновить не удалось. Смотрите консоль.'
        })
        console.log(e);
      },
      update: (cache, { data: { updateUser } }) => cache.writeQuery({
        query: GET_ALL_USERS,
        data: {
          users: data.users.map(user => user.id === updateUser.id ? updateUser : user)
        }
      })
    }
  )
  const [resetPassword] = useMutation(RESET_PASSWORD)

  if (dataLoading || selectsLoading) return (
    <LoadingState />
  )

  if (dataError || selectsError) {
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const addNewUser = (data) => {
    addUser({
      variables: {
        user: data
      }
    })
  }

  const handleUsersDelete = (data) => {
    deleteUsers({
      variables: {
        users: data
      }
    })
  }

  const handleUserUpdate = ({ id, data }) => {
    updateUser({
      variables: {
        id,
        data
      }
    })
  }

  const resetPass = ({ id, password }) => {
    resetPassword({
      variables: {
        id,
        password
      }
    })
  }

  const Loading = () => {
    if (deleteLoading) return <LoadingStatus />
    if (addLoading) return <LoadingStatus />
    if (updateLoading) return <LoadingStatus />
    return null
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

      <UsersTable
        users={data.users}
        selects={selects}
        addNewUser={addNewUser}
        deleteUsers={handleUsersDelete}
        updateUser={handleUserUpdate}
        resetPassword={resetPass}
      />
    </Fragment>
  )
}

export default Users