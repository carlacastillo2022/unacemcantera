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
  cursor: pointer;
  margin: 0px !important;
  padding: 0px !important;
`;

const ContainerButtons = styled.div`
  display: flex;
  flex: 1.2;
  flex-direction: column;
  @media (min-width: 300px) {
    margin-top: 2.4em;
  }

  @media (min-width: 768px) {
    margin-top: 1.3em;
  }

  @media (min-width: 1300px) {
    margin-top: 2.5em;
  }
`;

const Template10 = ({ onClickFirst, onClickSecond, onClickThird, onClickFourth, src }) => {
  return (
    <ContainerInteractivity flexDirection="row" src={src}>
      <ContentInteractivity>
      <div style={{ display: "flex", flex: 1 }}></div>
        <ContainerButtons>
        <ButtonInteractiveLeft></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickFirst}></ButtonInteractiveLeft>
          <ButtonInteractiveLeft
            onClick={onClickSecond}
          ></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickThird}></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickFourth}></ButtonInteractiveLeft>
        </ContainerButtons>
        <div style={{ display: "flex", flex: 1 }}></div>
      </ContentInteractivity>
      <ContentInteractivity>
      </ContentInteractivity>
    </ContainerInteractivity>
  );
};

export default Template10;
