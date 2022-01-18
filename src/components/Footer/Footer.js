import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: #000000;
  flex-direction: column;
  display: flex;
  width: 100vw;
  align-items: center;
  padding: 12px 0px;
  position: absolute;
  bottom: 0;
`;

const StyledTitle = styled.h4`
  font-weight: 700;
  font-size: 12px;
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  line-height: 28px;
`;

const StyledDescription = styled.span`
  font-weight: 400;
  font-size: 9px;
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  line-height: 16px;
`;

const Footer = ({ style }) => {
  return (
    <Container style={style}>
      <StyledTitle>© 2020 UNACEM</StyledTitle>
      <StyledDescription>
        <strong>Unión Andina de Cementos S.A.A </strong> Av. Atocongo 2440.
        Villa María del Triunfo.
      </StyledDescription>
      <StyledDescription>Lima, Perú. T (511) 217 0200</StyledDescription>
    </Container>
  );
};

export default Footer;
