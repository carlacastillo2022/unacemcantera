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
  width: 100%;
  border: 0px;
  border-radius: 10px;
  display: block;
  height: 25px;
  transition: background-color 0.8s;
  cursor: pointer;
  padding: 0px !important;
  @media (min-width: 300px) {
    margin: 4px 0px 0px !important;
    height: 10px;
  }

  @media (min-width: 600px) {
    margin: 5px 0px 0px !important;
    height: 22px;
  }

  @media (min-width: 768px) {
    margin: 5px 0px 0px !important;
    height: 27px;
  }

`;

const Content = styled.div`
  display: block;
  margin-top: 42%;
`;

const Template5 = ({
  onClickFirst,
  onClickSecond,
  onClickThird,
  onClickFourth,
  onClickFifth,
  onClickSixth,
  onClickSeventh,
  src,
}) => {
  return (
    <ContainerInteractivity flexDirection="row" src={src}>
      <ContentInteractivity></ContentInteractivity>
      <ContentInteractivity>
        <Content>
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
          <ButtonInteractiveLeft
            onClick={onClickSeventh}
          ></ButtonInteractiveLeft>
        </Content>
      </ContentInteractivity>
    </ContainerInteractivity>
  );
};

export default Template5;
