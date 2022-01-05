import React from "react";
import { Home, Lessons, Questionary, Certificate } from "@pages";
import { ThemeProvider } from "styled-components";
import { QueryParamProvider } from "use-query-params";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import theme from "./theme";
import AppStyles from "./theme/appStyles";

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppStyles />
        <Router>
          <QueryParamProvider ReactRouterRoute={Route}>
            <Switch>
              <Route exact path="/" render={() => <Home />}></Route>
              <Route exact path="/lessons" render={() => <Lessons />}></Route>
              <Route
                exact
                path="/questionary"
                render={() => <Questionary />}
              ></Route>
              <Route
                exact
                path="/certificate"
                render={() => <Certificate />}
              ></Route>
            </Switch>
          </QueryParamProvider>
        </Router>
      </ThemeProvider>
    </>
  );
};

export default App;
