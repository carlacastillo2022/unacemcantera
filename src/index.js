import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import loadable from '@loadable/component'
import Loading from "@components/Loading";
import "./scss/style.scss";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const ContainerLoading = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppLoadable = loadable(() => import("./App"), {
  fallback: (
    <ContainerLoading>
      <Loading />
    </ContainerLoading>
  ),
});

ReactDOM.render(<AppLoadable />, document.getElementById("root"));
