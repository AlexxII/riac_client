import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home, Drive, Results, Analyze, Tester } from '../../pages'

const Router = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/"} exact component={Home} />
        <Route path={"/results/:id/:code"} component={Results} />
        <Route path={"/drive/:id/:code"} component={Drive} />
        <Route path={"/analyze"} component={Analyze} />
        <Route path={"/tester"} component={Tester} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router