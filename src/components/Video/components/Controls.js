import React, { forwardRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "@components/Button";
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
  border-radius: 5px;
  background-color: transparent;
  color: #ffffff;
  position: relative;
  background-position: center;
  transition: background 0.8s;
  cursor: pointer;
  &:active {
    background-color: rgb(239, 239, 239, 0.6);
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
  background: rgba(0, 0, 0, 0.05);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent);
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

const format = (seconds) => {
  if (!seconds) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const Controls = ({
  controlsRef,
  containerControlsRef,
  currentTime,
  duration,
  playing,
  played,
  muted,
  isFullScreen,
  contentBottom,
  onPlayPause,
  onMuted,
  onToggleFullScreen
}) => {
  const handleOnPlayPause = () => {
    onPlayPause && onPlayPause();
  };

  const handleOnMuted = () => {
    onMuted && onMuted();
  }

  const handleOnFullScreen = () => {
    onToggleFullScreen && onToggleFullScreen();
  }

  const formatCurrentTime = format(currentTime);
  const formatDuration = format(duration);

  return (
    <Container ref={containerControlsRef}>
      {!playing && (
        <Content style={{ flex: 1, position: "absolute", height: "100%" }}>
          <ContentMiddle>
            <img src={IconPlay} onClick={handleOnPlayPause}></img>
          </ContentMiddle>
        </Content>
      )}
      <Content style={{ flex: 1 }}>
        <ContentMiddle></ContentMiddle>
        <ContentBottom>
          {contentBottom && (
            <div style={{ width: "100%" }}>{contentBottom}</div>
          )}
          {playing && (
            <div ref={controlsRef} style={{ width: "100%", display: "none" }}>
              <ContentProgress>
                <Progress seek={played * 100} />
              </ContentProgress>
              <ContentControls>
                <ControlsLeft>
                  <IconButton onClick={handleOnPlayPause}>
                    {!playing ? <MdPlayArrow /> : <MdPause />}
                  </IconButton>
                  <IconButton onClick={handleOnMuted}>
                    {!muted ? <MdVolumeUp /> : <MdVolumeOff />}
                  </IconButton>
                  <DescriptionDuration>
                    <span>
                      {formatCurrentTime}/{formatDuration}
                    </span>
                  </DescriptionDuration>
                </ControlsLeft>
                <ControlsRight>
                  <IconButton onClick={handleOnFullScreen}>
                    {!isFullScreen ? <MdFullscreen /> : <MdFullscreenExit />}
                  </IconButton>
                </ControlsRight>
              </ContentControls>
            </div>
          )}
        </ContentBottom>
      </Content>
    </Container>
  );
};

Controls.propTypes = {
  containerControlsRef: PropTypes.object,
  controlsRef: PropTypes.object,
  isFullScreen: PropTypes.bool,
  muted: PropTypes.bool,
  playing: PropTypes.bool,
  played: PropTypes.number,
  totalDuration: PropTypes.string,
  elapsedTime: PropTypes.string,
  contentBottom: PropTypes.node,
  onMuted: PropTypes.func,
  onPlayPause: PropTypes.func,
  onToggleFullScreen: PropTypes.func,
};

export default Controls;
