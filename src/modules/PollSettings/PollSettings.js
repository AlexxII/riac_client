import React, { Fragment } from 'react'

import VerticalTabs from '../../components/VerticalTabs'
import HorizontalTabs from '../../components/HorizontalTabs'

import CommonSetting from './containers/Common'
import ConfigEditor from './containers/ConfigEditor'
import DeletePoll from './containers/DeletePoll';
import CititesEditor from './containers/CitiesEditor';
import ReoderEditor from './containers/ReoderEditor'
import { Hidden } from '@material-ui/core'

const PollSettings = ({ id, code }) => {
  const data = [
    {
      label: 'Общие',
      padding: 3,
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
      <Hidden xsDown>
        <VerticalTabs data={data} />
      </Hidden>
      <Hidden smUp>
        <HorizontalTabs data={data} />
      </Hidden>
    </Fragment>
  )
}

export default PollSettings