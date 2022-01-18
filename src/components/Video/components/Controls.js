import React, { forwardRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import IconPlay from "@assets/images/play.svg";
import {
  MdPlayArrow,
  MdPause,
  MdVolumeUp,
  MdVolumeOff,
  MdFullscreen,
  MdFullscreenExit,
} from "react-icons/md";

const IconButton = styled.button`
  border: 0px;
  background-color: transparent;
  color: #ffffff;
  position: relative;
  background-position: center;
  transition: background-color 0.8s;
  &:active {
    background: linear-gradient(to right, #c7c7c7, #efefef);
    background-size: 100%;
    transition: background 0s;
  }
`;

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${({ playing }) =>
    playing ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)"};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

const ContentTop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  h5 {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
    font-family: ${({ theme }) => theme.fonts.mainFont};
    display: -webkit-box;
    max-width: 100%;
    margin: 0 0 auto;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ContentMiddle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ContentBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px;
`;

const ContentProgress = styled.div`
  display: flex;
  flex-direction: row;
  height 8px;
  background: rgb(229, 40, 32, 0.3);
  border-radius: 5px;
  width: 100%;
`;

const Progress = styled.div`
  display: flex;
  flex-direction: row;
  width: ${({ seek }) => seek}%;
  border-radius: 5px;
  background: #e52820;
`;

const ContentControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 0px;
`;

const ControlsLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const ControlsRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const DescriptionDuration = styled.div`
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #ffffff;
    font-family: ${({ theme }) => theme.fonts.mainFont};
  }
`;

const Controls = forwardRef(
  (
    {
      title,
      isFullScreen,
      muted,
      playing,
      played,
      totalDuration,
      elapsedTime,
      onMute,
      onPlayPause,
      onChangeDispayFormat,
      onToggleFullScreen,
    },
    ref
  ) => {
    const handleOnPlayPause = () => {
      onPlayPause && onPlayPause();
    };
    
    return (
      <Container ref={ref} playing={playing}>
        {!playing && (
          <Content>
            <ContentMiddle>
              {!playing && (
                <img src={IconPlay} onClick={handleOnPlayPause}></img>
              )}
            </ContentMiddle>
          </Content>
        )}
        {playing && (
          <Content>
            {title && (
              <ContentTop>
                <h5>{title}</h5>
              </ContentTop>
            )}
            <ContentMiddle></ContentMiddle>
            <ContentBottom>
              <ContentProgress>
                <Progress seek={played * 100} />
              </ContentProgress>
              <ContentControls>
                <ControlsLeft>
                  <IconButton onClick={handleOnPlayPause}>
                    {!playing ? <MdPlayArrow /> : <MdPause />}
                  </IconButton>
                  <IconButton onClick={onMute}>
                    {!muted ? <MdVolumeUp /> : <MdVolumeOff />}
                  </IconButton>
                  <DescriptionDuration onClick={onChangeDispayFormat}>
                    <span>
                      {elapsedTime}/{totalDuration}
                    </span>
                  </DescriptionDuration>
                </ControlsLeft>
                <ControlsRight>
                  <IconButton onClick={onToggleFullScreen}>
                    {!isFullScreen ? <MdFullscreen /> : <MdFullscreenExit />}
                  </IconButton>
                </ControlsRight>
              </ContentControls>
            </ContentBottom>
          </Content>
        )}
      </Container>
    );
  }
);

Controls.propTypes = {
  title: PropTypes.string,
  isFullScreen: PropTypes.bool,
  muted: PropTypes.bool,
  playing: PropTypes.bool,
  played: PropTypes.number,
  totalDuration: PropTypes.string,
  elapsedTime: PropTypes.string,
  onMute: PropTypes.func,
  onPlayPause: PropTypes.func,
  onToggleFullScreen: PropTypes.func,
  onChangeDispayFormat: PropTypes.func,
};

export default Controls;
