import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import ReactPlayer from "react-player/lazy";
import Button from "@components/Button";
import styled from "styled-components";
import Loading from "@components/Loading";
import Controls from "./components/Controls";
import ControlsInteractive from "./components/ControlsInteractive";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import ArrowReplay from "@assets/images/arrow-replay.svg";

let count = 0;

const ContainerButtonsFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 8px 0px;
  width: 100%;
`;

const ContainerLoading = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  margin: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.05);
`;

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

const ButtonInteractive = styled.button`
  background: transparent;
  border: 0px;
  border-radius: 10px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  background-position: center;
  transition: background-color 0.8s;
  cursor:pointer;
  &:active {
    background: linear-gradient(to right, #f3f3f3, transparent);
    background-size: 100%;
    transition: background 0s;
  }
`;

const Description = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: #333333;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  margin-top: 20px;
`;

const format = (seconds) => {
  if (isNaN(seconds)) {
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

const Video = ({
  width,
  seek,
  height,
  delayToFinalizeVideo,
  src,
  onProgress,
  onPlay,
  onEnded,
  onEndedVideoInteractive,
  onInitTimer,
  onClickNextVideo,
  playing,
  isLoadingVideo,
  title,
  showButtonsFooter,
  setPlaying,
  hasInteractivity,
  onClickFirst,
  onClickSecond,
}) => {
  const playerRef = useRef(null);
  const controlsRef = useRef(null);

  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const [end, setEnd] = useState(false);
  const [endVideoInteractive, setEndVideoInteractive] = useState(false);
  const [endTime, setEndTime] = useState(false);
  const [key, setKey] = useState("");
  const [widthVideo, setWidthVideo] = useState(width);
  const [heightVideo, setHeightVideo] = useState(height);
  const [isLoadingBuffer, setIsLoadingBuffer] = useState(false);
  const [lastMinuteSeenVideo, setLastMinuteSeenVideo] = useState(seek);
  const fullScreenHandle = useFullScreenHandle();
  const [state, setState] = useState({
    muted: false,
    played: 0,
    duration: 0,
  });

  useEffect(() => {
    if (!fullScreenHandle.active) {
      setWidthVideo(width);
      setHeightVideo(height);
    } else {
      setWidthVideo("100vw");
      setHeightVideo("100vh");
    }
  }, [fullScreenHandle.active]);

  useEffect(() => {
    if (controlsRef.current)
      controlsRef.current.style.visibility = endVideoInteractive
        ? "hidden"
        : "visible";
  }, [endVideoInteractive]);

  useEffect(() => {
    try {
      if (playerRef && playerRef.current) {
        setIsLoadingBuffer(true);
        playerRef.current.seekTo(seek);
        setState({ ...state, played: seek });
      }
    } catch (e) {}
  }, [src]);

  useEffect(() => {
    if (playerRef && playerRef.current) {
      playerRef.current.seekTo(seek);
    }
  }, [seek]);

  useEffect(() => {
    try {
      if (playerRef && playerRef.current) {
        playerRef.current.seekTo(state.played);
      }
    } catch (e) {}
  }, [key]);

  useEffect(() => {
    setKey(playing ? "playing" : "stop");
    if (playing) setEndTime(false);
    if (!hasInteractivity)
      if (controlsRef.current)
        controlsRef.current.style.visibility = !playing ? "visible" : "hidden";
  }, [playing]);

  const handlePlayPause = () => {
    if (
      lastMinuteSeenVideo &&
      Math.trunc(lastMinuteSeenVideo) ===
        Math.trunc(playerRef?.current?.getDuration())
    ) {
      setState({ ...state, played: 0 });
    }
    setPlaying(!playing);
    onPlay && onPlay();
  };

  const handleOnProgress = (changeState) => {
    if (playing) {
      if (count > 2) {
        if (controlsRef.current)
          controlsRef.current.style.visibility = "hidden";
        count = 0;
      }
      if (
        controlsRef.current &&
        controlsRef.current.style.visibility == "visible"
      ) {
        count += 1;
      }
      setState({ ...state, ...changeState });
      setLastMinuteSeenVideo(changeState.playedSeconds);
      onProgress && onProgress(changeState);
    }
  };

  const handleOnEnded = () => {
    if (!hasInteractivity) {
      setPlaying(false);
      setEnd(true);
      setEndTime(true);
      onInitTimer && onInitTimer();
    } else {
      setEndVideoInteractive(true);
      onEndedVideoInteractive &&
        onEndedVideoInteractive(playerRef.current.getDuration());
    }
  };

  //--- events controls

  const toggleFullScreen = () => {
    /*if (!screenful.isFullscreen) {
      setWidthVideo("100vw");
      setHeightVideo("100vh");
    } else {
      setWidthVideo(width);
      setHeightVideo(height);
    } */
    //screenful.toggle(playerContainerRef.current);
    if (fullScreenHandle.active) {
      fullScreenHandle.exit();
    } else {
      fullScreenHandle.enter();
    }
  };

  const handleOnComplete = () => {
    setEndTime(false);
    onEnded && onEnded(playerRef.current.getDuration());
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleMouseMove = () => {
    if (!hasInteractivity) {
      if (controlsRef.current) controlsRef.current.style.visibility = "visible";
      count = 0;
    }
  };

  const renderContentBottom = () => {
    return showButtonsFooter ? (
      <ContainerButtonsFooter>
        <Button
          iconLeft={ArrowReplay}
          styleIconLeft={{ height: "30px", width: "30px" }}
          onClick={() => {
            setEndTime(false);
            setPlaying(true);
            setState({ ...state, played: 0 });
            if (playerRef) playerRef.current.seekTo(0);
          }}
          size="small"
          styleButton={{ marginRight: "8px" }}
        />
        <Button
          label="Seguir"
          iconRight={ArrowDoubleRight}
          onClick={() => {
            setEndTime(false);
            onClickNextVideo &&
              onClickNextVideo(playerRef?.current?.getDuration());
          }}
          styleIconRight={{ height: "30px", width: "30px" }}
          size="small"
        />
      </ContainerButtonsFooter>
    ) : null;
  };

  const currentTime =
    playerRef && playerRef.current
      ? playerRef.current.getCurrentTime()
      : "00:00";

  const duration =
    playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00";

  const elapsedTime =
    timeDisplayFormat == "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  const { muted, played } = state;

  return (
    <div>
      <>
        <FullScreen handle={fullScreenHandle}>
          <div
            style={{
              width: widthVideo,
              height: heightVideo,
              background: "transparent",
              position: "relative",
            }}
            onMouseMove={handleMouseMove}
          >
            <ReactPlayer
              key={key}
              ref={playerRef}
              width={widthVideo}
              height={heightVideo}
              url={src}
              playsinline
              playing={playing}
              onProgress={handleOnProgress}
              onEnded={handleOnEnded}
              onReady={() => {
                setIsLoadingBuffer(false);
              }}
              muted={muted}
              onBuffer={() => setIsLoadingBuffer(true)}
              onBufferEnd={() => setIsLoadingBuffer(false)}
            />
            {hasInteractivity && (
              <ControlsInteractive
                ref={controlsRef}
                playing={playing}
                muted={muted}
                played={played}
                elapsedTime={elapsedTime}
                totalDuration={totalDuration}
                onPlayPause={handlePlayPause}
                onToggleFullScreen={toggleFullScreen}
                onMute={handleMute}
              />
            )}

            {!hasInteractivity && (
              <Controls
                controlsRef={controlsRef}
                showControlsPlayer={!hasInteractivity}
                title={title}
                playing={playing}
                muted={muted}
                played={played}
                elapsedTime={elapsedTime}
                totalDuration={totalDuration}
                onPlayPause={handlePlayPause}
                isFullScreen={fullScreenHandle.active}
                onToggleFullScreen={toggleFullScreen}
                onMute={handleMute}
                contentBottom={
                  fullScreenHandle.active ? renderContentBottom() : null
                }
              />
            )}
            {hasInteractivity && endVideoInteractive && (
              <ContainerInteractivity flexDirection="row">
                <FirstContentInteractivity>
                  <div style={{ display: "flex", flex: 1 }}></div>
                  <div style={{ display: "flex", flex: 1 }}></div>
                  <ButtonInteractive
                    style={{ justifyContent: "flex-end" }}
                    onClick={onClickFirst}
                  ></ButtonInteractive>
                </FirstContentInteractivity>
                <SecondContentInteractivity>
                  <div style={{ display: "flex", flex: 1 }}></div>
                  <div style={{ display: "flex", flex: 1 }}></div>
                  <ButtonInteractive
                    style={{ justifyContent: "flex-start" }}
                    onClick={onClickSecond}
                  ></ButtonInteractive>
                </SecondContentInteractivity>
              </ContainerInteractivity>
            )}
            {delayToFinalizeVideo > 0 && endTime && !playing && (
              <ContainerLoading>
                <div
                  onClick={() => {
                    setEndTime(false);
                  }}
                >
                  <CountdownCircleTimer
                    size={50}
                    strokeWidth={8}
                    isPlaying
                    duration={delayToFinalizeVideo}
                    colors={["#FFFFFF"]}
                    onComplete={handleOnComplete}
                  >
                    {({ remainingTime }) => <></>}
                  </CountdownCircleTimer>
                </div>
              </ContainerLoading>
            )}
            {isLoadingVideo ||
              (isLoadingBuffer && (
                <ContainerLoading>
                  <Loading type="Oval" color="#FFFFFF" />
                </ContainerLoading>
              ))}
          </div>
        </FullScreen>
        {renderContentBottom()}
      </>
    </div>
  );
};

Video.propTypes = {
  delayToFinalizeVideo: PropTypes.number,
  onInitTimer: PropTypes.func,
  onClickNextVideo: PropTypes.func,
};

Video.defaultProps = {};

export default Video;
