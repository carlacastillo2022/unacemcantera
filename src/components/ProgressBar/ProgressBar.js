import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ContainerBar = styled.div`
  background-color: #ffffff;
  height: 10px;
  border-radius: 100px;
  width: 75%;
`;

const Bar = styled.div`
  height: 10px;
  background-color: #e52820;
  border-radius: 100px;
  width: ${({ width }) => width}%;
`;

const Percentage = styled.label`
  font-size: 25px;
  font-weight: 700;
  line-height: 30px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  width: 25%;
  text-align: right;
`;

const Title = styled.span`
  font-family: ${({ theme }) => theme.fonts.mainFont};
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
`;

const ProgressBar = ({ percentage }) => {
  return (
    <>
      <Title>Tu progreso</Title>
      <Container>
        <ContainerBar>
          <Bar width={percentage}></Bar>
        </ContainerBar>
        <Percentage>{percentage}%</Percentage>
      </Container>
    </>
  );
};


ProgressBar.propTypes = {
  percentage: PropTypes.number,
};

export default ProgressBar;
