import React from "react";
import { ThemeProvider } from "styled-components";
import { IconContext } from "react-icons";
import theme from "./theme";
import AppStyles from "./theme/appStyles";
import MainRouter from "@routes";

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <IconContext.Provider
          value={{
            className: "react-icons",
            size: 30,
          }}
        >
          <AppStyles />
          <MainRouter />
        </IconContext.Provider>
      </ThemeProvider>
    </>
  );
};

export default App;
