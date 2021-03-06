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

const ContentInteractivity = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 0px;
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
  margin: 0px !important;
  padding: 0px !important;
  cursor: pointer;
`;

const Template3 = ({ onClickFirst, onClickSecond, onClickThird, src }) => {
  return (
    <ContainerInteractivity flexDirection="row" src={src}>
      <ContentInteractivity></ContentInteractivity>
      <ContentInteractivity>
        <div style={{ display: "flex", flex: 1 }}></div>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", marginTop: '4em' }}>
        <ButtonInteractiveLeft></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickFirst}></ButtonInteractiveLeft>
          <ButtonInteractiveLeft
            onClick={onClickSecond}
          ></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickThird}></ButtonInteractiveLeft>
        </div>
        <div style={{ display: "flex", flex: 1 }}></div>
      </ContentInteractivity>
    </ContainerInteractivity>
  );
};

export default Template3;
