import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledSubTitle = styled.h4`
  font-weight: 400 !important;
  line-height: 24px;
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;

const SubTitle = ({ children, elementId }) => {
  return (
    <StyledSubTitle id={elementId}>
      {children}
    </StyledSubTitle>
  );
};

SubTitle.propTypes = {
  children: PropTypes.node,
  elementId: PropTypes.string,
};

export default SubTitle;
