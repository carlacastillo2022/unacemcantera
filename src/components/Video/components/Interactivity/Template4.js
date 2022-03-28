import React from "react";
import styled from "styled-components";

const ContainerInteractivity = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  margin: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${({ flexDirection }) => flexDirection};
  background-image: url(${({ src }) => src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position-x: center;
  background-position-y: center;
`;

const FirstContentInteractivity = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 0px;
`;

const SecondContentInteractivity = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 0px;
`;

const ButtonInteractiveRight = styled.button`
  background: transparent;
  border: 0px;
  border-radius: 10px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  background-position: center;
  transition: background-color 0.8s;
  cursor: pointer;
  margin: 0px !important;
  padding: 0px !important;
  &:active {
    background: linear-gradient(to right, #f3f3f3, transparent);
    background-size: 100%;
    transition: background 0s;
  }
`;

const ButtonInteractiveLeft = styled.button`
  background: transparent;
  border: 0px;
  border-radius: 10px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  background-position: center;
  transition: background-color 0.8s;
  cursor: pointer;
  margin: 0px !important;
  padding: 0px !important;
  &:active {
    background: linear-gradient(to left, #f3f3f3, transparent);
    background-size: 100%;
    transition: background 0s;
  }
`;

const Template4 = ({ onClickFirst, onClickSecond, src }) => {
  return (
    <ContainerInteractivity flexDirection="row" src={src}>
      <FirstContentInteractivity>
        <div style={{ display: "flex", flex: 1 }}></div>
        <div style={{ display: "flex", flex: 1 }}></div>
        <ButtonInteractiveLeft
          style={{ justifyContent: "flex-end" }}
          onClick={onClickFirst}
        ></ButtonInteractiveLeft>
      </FirstContentInteractivity>
      <SecondContentInteractivity>
        <div style={{ display: "flex", flex: 1 }}></div>
        <div style={{ display: "flex", flex: 1 }}></div>
        <ButtonInteractiveRight
          style={{ justifyContent: "flex-start" }}
          onClick={onClickSecond}
        ></ButtonInteractiveRight>
      </SecondContentInteractivity>
    </ContainerInteractivity>
  );
};

export default Template4;
