import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ProgressBar from "@components/ProgressBar";
import ArrowUp from "@assets/images/arrow-up.svg";
import ArrowDown from "@assets/images/arrow-down.svg";
import Close from "@assets/images/close.svg";
import Lock from "@assets/images/lock.svg";
import { useHistory } from "react-router-dom";

const StyledArrowUp = styled.img`
  height: 16px;
  width: 16px;
  margin-top: ${({ marginTop }) => marginTop}px;
`;

const StyledArrowDown = styled.img`
  height: 16px;
  width: 16px;
  margin-top: ${({ marginTop }) => marginTop}px;
`;

const StyledLock = styled.img`
  margin: 20px 9px;
  height: 32px;
  width: 32px;
`;

const Container = styled.div`
  margin: 0px -16px;
  padding-bottom: 24px;
`;

const ContainerProgress = styled.div`
  background: #f3f3f3;
  margin: 0px -16px;
  padding: 16px;
`;

const ContainerTitle = styled.div`
  display: flex;
  justify-content: space-between;
  background: #fafafa;
  margin: 24px -16px 0px;
  padding: 16px;
  span {
    font-weight: 700;
    font-size: 20px;
    line-height: 27px;
    font-family: ${({ theme }) => theme.fonts.mainFont};
  }
`;

const Circle = styled.div`
  background: ${({ isLight }) => (isLight ? "#E52820" : "#EEEEEE")};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-weight: 700;
    color: ${({ isLight }) => (isLight ? "#ffffff" : "rgba(0, 0, 0, 0.6)")};
    font-size: 16px;
    line-height: 20px;
    font-family: ${({ theme }) => theme.fonts.mainFont};
  }
`;

const VerticalBar = styled.div`
  width: 3px;
  height: ${({ height }) => height}px;
  background: ${({ isLight }) => (isLight ? "#E52820" : "#EEEEEE")};
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: 81px;
  height: ${({ height }) => height}px;
  background: ${({ background }) => background};
  cursor: pointer;
`;

const ContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentRight = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: flex-start;
`;

const Title = styled.span`
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  color: #333333;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  display: -webkit-box;
  max-width: 100%;
  margin: 0 0 auto;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: #333333;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  margin-top: 10px;
`;

let isCompleted = true;

const Steps = ({
  lessons,
  onCallbackVideoSelected,
  videoSelected,
  disabledClose,
}) => {
  const history = useHistory();

  isCompleted = true;

  const onClick = (index, item) => {
    onCallbackVideoSelected && onCallbackVideoSelected(item, index);
  };

  const reducerSum = (accumulator, currentValue) => {
    if (currentValue?.completoVista) {
      return accumulator + 1;
    }
    return accumulator;
  };

  const renderLockStep = (index, item) => {
    return (
      <Content
        key={index}
        height={index === 0 ? 81 : 97}
        background={index === videoSelected?.index ? "#f3f3f3" : "#fafafa"}
        style={{
          padding: index === 0 ? "16px 16px 0px" : "0px 16px 0px",
        }}
      >
        <ContentLeft>
          {index > 0 && <VerticalBar height={20} />}
          <Circle>
            <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
          </Circle>
          {index !== lessons.length - 1 && (
            <VerticalBar height={index === 0 ? 49 : 45} />
          )}
        </ContentLeft>
        <StyledLock src={Lock} />
        <ContentRight
          style={{
            marginTop: index > 0 ? 20 : 0,
          }}
        >
          <Title>{item.nombreVideo}</Title>
          <Description>{`Duración: ${item.duracion}/ Video`}</Description>
        </ContentRight>
        {index === videoSelected?.index ? (
          <StyledArrowUp src={ArrowUp} marginTop={index > 0 ? 26 : 6} />
        ) : (
          <StyledArrowDown src={ArrowDown} marginTop={index > 0 ? 26 : 6} />
        )}
      </Content>
    );
  };

  const renderUnlockStep = (index, item) => {
    return (
      <Content
        key={index}
        height={index === 0 ? 81 : 97}
        background={index === videoSelected?.index ? "#f3f3f3" : "#fafafa"}
        onClick={() => onClick(index, item)}
        style={{
          padding: index === 0 ? "16px 16px 0px" : "0px 16px 0px",
        }}
      >
        <ContentLeft>
          {index > 0 && <VerticalBar height={20} isLight />}
          <Circle isLight>
            <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
          </Circle>
          {index !== lessons.length - 1 && (
            <VerticalBar height={index === 0 ? 49 : 45} isLight />
          )}
        </ContentLeft>
        <ContentRight
          marginTop={index > 0 ? 20 : 0}
          style={{
            marginTop: index > 0 ? 20 : 0,
            marginLeft: "18px",
          }}
        >
          <Title>{item.nombreVideo}</Title>
          <Description>{`Duración: ${item.duracion}/ Video`}</Description>
        </ContentRight>
        {index === videoSelected?.index ? (
          <StyledArrowUp src={ArrowUp} marginTop={index > 0 ? 26 : 6} />
        ) : (
          <StyledArrowDown src={ArrowDown} marginTop={index > 0 ? 26 : 6} />
        )}
      </Content>
    );
  };

  const advancedLessons = lessons.reduce(reducerSum, 0);

  if (lessons && lessons.length > 0)
    return (
      <>
        <ContainerTitle>
          <span>Lecciones</span>
          {!disabledClose && (
            <div
              onClick={() => {
                history.goBack();
              }}
            >
              <img src={Close} />
            </div>
          )}
        </ContainerTitle>
        <ContainerProgress>
          <ProgressBar
            percentage={`${parseInt((100 * advancedLessons) / lessons.length)}`}
          ></ProgressBar>
        </ContainerProgress>
        <Container>
          {lessons.map((item, index) => {
            if (isCompleted) {
              isCompleted = item?.completoVista
                ? item?.completoVista === "SI"
                : item?.completoVista;
              return renderUnlockStep(index, item);
            } else {
              isCompleted = item?.completoVista
                ? item?.completoVista === "SI"
                : item?.completoVista;
              return renderLockStep(index, item);
            }
          })}
        </Container>
      </>
    );
  return <></>;
};

Steps.propTypes = {
  lessons: PropTypes.array,
  onCallbackVideoSelected: PropTypes.func,
  videoSelected: PropTypes.object,
};

export default Steps;
