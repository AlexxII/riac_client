import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import SettingBar from '../components/SettingBar'
import DriveWrap from "../containers/DriveWrap";

const DrivePage = () => {
  let { id, code } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Опрос ` + code + ` - вбивание`} />
      <DriveWrap id={id}/>
    </Fragment>
  )
}

export default DrivePage