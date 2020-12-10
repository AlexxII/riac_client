import React, { Fragment } from 'react'

import AdaptiveTabs from '../../components/AdaptiveTabs'

import CommonSetting from './containers/Common'
import ConfigEditor from './containers/ConfigEditor'
import DeletePoll from './containers/DeletePoll';
import CititesEditor from './containers/CitiesEditor';
import ReoderEditor from './containers/ReoderEditor';

const PollSettings = ({ id, code }) => {
  const data = [
    {
      label: 'Общие',
      component: <CommonSetting id={id} />
    },
    {
      label: 'Порядок отображения',
      component: <ReoderEditor id={id} />
    },
    {
      label: 'Конфиг',
      component: <ConfigEditor id={id} />
    },
    {
      label: 'Города',
      component: <CititesEditor id={id} />
    },
    {
      label: 'Удаление',
      component: <DeletePoll id={id} code={code} />
    }
  ]
  return (
    <Fragment>
      <AdaptiveTabs data={data} />
    </Fragment>
  )
}

export default PollSettings