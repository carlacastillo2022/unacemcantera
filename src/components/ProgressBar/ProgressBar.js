import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 20px;
`;

const ContainerBar = styled.div`
  background-color: #ffffff;
  height: 10px;
  border-radius: 0px;
  width: 100%;
`;

const Bar = styled.div`
  height: 29px;
  background-color: #e52820;
  border-radius: 0px;
  width: ${({ width }) => width}%;
  display:flex ;
  justify-content:end;
`;

const Percentage = styled.label`
  font-size: 16px;
  font-weight: 500;
  line-height: 30px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  width: 25%;
  text-align: right;
  padding-right:7px;
`;

const Title = styled.span`
  font-family: ${({ theme }) => theme.fonts.mainFont};
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
  padding-top: 20px;
`;

const ProgressBar = ({ percentage }) => {
  return (
    <>
      <Title>Tu progreso</Title>
      <Container>
        <ContainerBar>
          <Bar width={percentage}><Percentage>{percentage}%</Percentage></Bar>
        </ContainerBar>

      </Container>
    </>
  );
};


ProgressBar.propTypes = {
  percentage: PropTypes.string,
};

export default ProgressBar;
