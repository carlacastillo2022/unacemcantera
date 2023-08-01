import React from "react";
import { Home, Lessons, Questionary, Certificate } from "@pages";
import { QueryParamProvider } from "use-query-params";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ROUTES from './constants';

const MainRouter = () => {
  return(
    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Switch>
          <Route exact path={ROUTES.HOME} render={() => <Home />}></Route>
          <Route exact path={ROUTES.LESSONS} render={() => <Lessons />}></Route>
          <Route
            exact
            path={ROUTES.QUESTIONARY}
            render={() => <Questionary />}
          ></Route>
          <Route
            exact
            path={ROUTES.CERTIFICATE}
            render={() => <Certificate />}
          ></Route>
        </Switch>
      </QueryParamProvider>
    </Router>
  )
}

export default MainRouter;