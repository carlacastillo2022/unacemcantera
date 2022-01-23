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

const ContentInteractivity = styled.div`
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
  &:active {
    background: linear-gradient(to left, #f3f3f3, transparent);
    background-size: 100%;
    transition: background 0s;
  }
`;

const ButtonInteractiveMiddle = styled.button`
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
    background: linear-gradient(to top, #f3f3f3, transparent);
    background-size: 100%;
    transition: background 0s;
  }
`;

const Template2 = ({ onClickFirst, onClickSecond, onClickThird }) => {
  return (
    <ContainerInteractivity flexDirection="row">
      <ContentInteractivity>
        <div style={{ display: "flex", flex: 1 }}></div>
        <div style={{ display: "flex", flex: 1 }}></div>
        <ButtonInteractiveLeft
          style={{ justifyContent: "flex-end" }}
          onClick={onClickFirst}
        ></ButtonInteractiveLeft>
      </ContentInteractivity>
      <ContentInteractivity>
        <div style={{ display: "flex", flex: 1 }}></div>
        <div style={{ display: "flex", flex: 1 }}></div>
        <ButtonInteractiveMiddle
          style={{ justifyContent: "flex-start" }}
          onClick={onClickSecond}
        ></ButtonInteractiveMiddle>
      </ContentInteractivity>
      <ContentInteractivity>
        <div style={{ display: "flex", flex: 1 }}></div>
        <div style={{ display: "flex", flex: 1 }}></div>
        <ButtonInteractiveRight
          style={{ justifyContent: "flex-start" }}
          onClick={onClickThird}
        ></ButtonInteractiveRight>
      </ContentInteractivity>
    </ContainerInteractivity>
  );
};

export default Template2;
