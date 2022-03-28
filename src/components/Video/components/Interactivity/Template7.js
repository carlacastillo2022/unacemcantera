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
  height: 25px;
  align-items: center;
  justify-content: flex-end;
  background-position: center;
  transition: background-color 0.8s;
  cursor: pointer;
  margin: 0px !important;
  padding: 0px !important;
  @media (min-width: 300px) {
    height: 15px;
  }

  @media (min-width: 600px) {
    height: 30px;
  }

  @media (min-width: 1300px) {
    height: 27px;
  }

`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  @media (min-width: 300px) {
    margin-top: 1.5em;
  }
  @media (min-width: 900px) {
    margin-top: 3em;
  }
`;

const Template7 = ({
  onClickFirst,
  onClickSecond,
  onClickThird,
  onClickFourth,
  onClickFifth,
  onClickSixth,
  src,
}) => {
  return (
    <ContainerInteractivity flexDirection="row" src={src}>
      <ContentInteractivity></ContentInteractivity>
      <ContentInteractivity>
        <Content>
          <ButtonInteractiveLeft></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickFirst}></ButtonInteractiveLeft>
          <ButtonInteractiveLeft
            onClick={onClickSecond}
          ></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickThird}></ButtonInteractiveLeft>
          <ButtonInteractiveLeft
            onClick={onClickFourth}
          ></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickFifth}></ButtonInteractiveLeft>
          <ButtonInteractiveLeft onClick={onClickSixth}></ButtonInteractiveLeft>
        </Content>
      </ContentInteractivity>
    </ContainerInteractivity>
  );
};

export default Template7;
