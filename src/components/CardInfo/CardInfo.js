import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  background: white;
  border-radius: 0px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px;
  margin: 0px 0px;
  text-align:center ;
  padding-left: 25px;
  padding-right: 25px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const StyledIcon = styled.div``;

const StyledTitle = styled.h3`
  font-weight: 700 !important;
  font-size: 14px;
  color: black;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  line-height: 20px;
`;
const StyledSubTitle = styled.h4`
  font-weight: 400 !important;
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  line-height: 20px;
`;

const CardInfo = ({ icon, title, subTitle }) => {
  return (
    <Container>
      {icon && <StyledIcon>{<img src={icon} />}</StyledIcon>}
      <Content>
        <StyledTitle type="md">{title}</StyledTitle>
        <StyledSubTitle>{subTitle}</StyledSubTitle>
      </Content>
    </Container>
  );
};

CardInfo.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

export default CardInfo;
