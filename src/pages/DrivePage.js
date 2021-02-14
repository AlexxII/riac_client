import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import SettingBar from '../components/SettingBar'
import PollDrive from "../modules/PollDrive";

const DrivePage = () => {
  let { id, code } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Опрос ` + code + ` - вбивание`} />
      <PollDrive pollId={id} />
    </Fragment>
  )
}

export default DrivePage