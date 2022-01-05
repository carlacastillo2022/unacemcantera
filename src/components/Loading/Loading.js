import React from "react";
import styled from "styled-components";
import Loader from "react-loader-spinner";

const StyledLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0px;
`;

const Loading = () => {
  return (
    <StyledLoading>
      <Loader type="ThreeDots" color="#E52820" height={50} width={50} />
    </StyledLoading>
  );
};

export default Loading;
