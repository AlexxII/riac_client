import React, { Fragment } from 'react'

import AdaptiveTabs from '../../components/AdaptiveTabs'

import DocEntry from './containers/DocEntry'
import DocView from './containers/DocView'
import SdpCheckConfig from './containers/SdpCheckConfig'

const SdpCheck = ({ id }) => {
  const data = [
    {
      label: 'Ввод',
      component: <DocEntry id={id} />
    },
    {
      label: 'Отображение',
      component: <DocView id={id} />
    },
    // {
    //   label: 'Настройка',
    //   component: <SdpCheckConfig id={id} />
    // }
  ]
  return (
    <Fragment>
      <AdaptiveTabs data={data} />
    </Fragment>
  )
}

export default SdpCheck