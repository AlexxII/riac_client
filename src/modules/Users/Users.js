import React, { Fragment } from 'react'

import LoadingState from '../../components/LoadingState'
import ErrorState from '../../components/ErrorState'
import UsersTable from './components/UsersTable'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_ALL_USERS, GET_AUTH_SELECTS } from './queries'
import { ADD_NEW_USER, UPDATE_USER, DELETE_USERS, RESET_PASSWORD } from './mutations'

const Users = () => {
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

  const [deleteUsers, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_USERS,
    {
      onError: (e) => {
        // setUserError('Такой пользователь существует')
        // setPasswordError(true)
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
  const [addUser, { loading: addLoading, error: addError }] = useMutation(ADD_NEW_USER,
    {
      onError: (e) => {
        // setUserError('Такой пользователь существует')
        // setPasswordError(true)
      },
      update: (cache, { data: { addNewUser } }) => cache.writeQuery({
        query: GET_ALL_USERS,
        data: {
          users: data.users.map(user => user.id === addNewUser.id ? addNewUser : user)
        }
      })
    }
  )
  const [updateUser, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER,
    {
      onError: (e) => {
        // setUserError('Такой пользователь существует')
        // setPasswordError(true)
      },
      update: (cache, { data: { updateUser } }) => cache.writeQuery({
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
  const [resetPassword] = useMutation(RESET_PASSWORD)

  if (dataLoading || selectsLoading) return (
    <LoadingState />
  )

  if (deleteLoading || addLoading) return (
    <LoadingState title='Подождите' description='Ваш запрос выполняется' />
  )

  if (dataError || selectsError) {
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />)
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

  return (
    <Fragment>
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