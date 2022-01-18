import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Loader from "react-loader-spinner";

const StyledLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0px;
`;

const Loading = ({ color, type }) => {
  return (
    <StyledLoading>
      <Loader type={type} color={color} height={50} width={50} />
    </StyledLoading>
  );
};

Loading.propTypes = {
  type: PropTypes.string,
};

Loading.defaultProps = {
  type: 'ThreeDots'
};

export default Loading;
