import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledTitleXL = styled.h1`
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  line-height: 36px;
`;

const StyledTitleLG = styled.h2`
  font-weight: 700;
  font-size: 25px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  line-height: 30px;
`;

const StyledTitleMD = styled.h3`
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  line-height: 20px;
  font-size: 18px;
`;

const Title = ({ children, type, elementId, style }) => {
  if (type === 'xl')
    return (
      <StyledTitleXL id={elementId} style={style}>
        {children}
      </StyledTitleXL>
    );
  if (type === 'lg')
    return (
      <StyledTitleLG id={elementId} style={style}>
        {children}
      </StyledTitleLG>
    );
  if (type === 'md')
    return (
      <StyledTitleMD id={elementId} style={style}>
        {children}
      </StyledTitleMD>
    );
};

Title.defaultProps = {
  type: 'xl',
};

Title.propTypes = {
  elementId: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  type: PropTypes.oneOf(['xl', 'lg', 'md']),
};

export default Title;
