import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container'

import ListOfPolls from '../ListOfPolls'
import AddFab from "../../components/AddFab";

const HomeWrap = () => {

  const addNewPoll = () => {
    console.log('AddFabb button pressed');
  }

  return (
    <Fragment>
      <Container maxWidth="md">
        <ListOfPolls />
      </Container>
      <AddFab onClick={addNewPoll} />
    </Fragment>
  )
}

export default HomeWrap