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
  &:active {
    background-color: rgb(239, 239, 239, 0.6);
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
  &:active {
    background-color: rgb(239, 239, 239, 0.6);
    background-size: 100%;
    transition: background 0s;
  }
`;

const Template1 = ({ onClickFirst, onClickSecond }) => {
  return (
    <ContainerInteractivity flexDirection="row">
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

export default Template1;
