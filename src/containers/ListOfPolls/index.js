import React from 'react'
import PollCard from '../../components/PollCard'

const ListOfPolls = ({ data }) => {

  return data.polls.map((poll, i) => (
    <PollCard key={i} data={poll} />
  ))
}

export default ListOfPolls