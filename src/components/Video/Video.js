import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import ReactPlayer from "react-player/lazy";
import Button from "@components/Button";
import screenful from "screenfull";
import styled from "styled-components";
import Loading from "@components/Loading";
import Controls from "./components/Controls";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import ArrowReplay from "@assets/images/arrow-replay.svg";
import { MdClose } from "react-icons/md";

let count = 0;

const ContainerButtonsFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 8px;
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
  padding: 0px 18px;
`;

const SecondContentInteractivity = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 0px 18px;
`;

const ButtonInteractive = styled.button`
  background: red;
  border: 0px;
  min-height: 45px;
  min-width: 200px;
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
  onReady,
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
  const playerContainerRef = useRef(null);

  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const [end, setEnd] = useState(false);
  const [endVideoInteractive, setEndVideoInteractive] = useState(false);
  const [endTime, setEndTime] = useState(false);
  const [key, setKey] = useState("");
  const [isLoadingBuffer, setIsLoadingBuffer] = useState(false);
  const [state, setState] = useState({
    muted: false,
    played: 0,
    duration: 0,
  });

  useEffect(() => {
    console.log("SEEK CAMBIADO", seek)
    if (playerRef && playerRef.current) {
      playerRef.current.seekTo(seek);
    }
  }, [seek]);

  useEffect(() => {
    try {
      if (playerRef && playerRef.current) {
        console.log("playerRef.current", playerRef.current);
        playerRef.current.seekTo(state.played);
      }
    } catch (e) {}
  }, [key]);

  useEffect(() => {
    setKey(playing ? "playing" : "stop");
    if (playing) setEndTime(false);
    controlsRef.current.style.visibility = !playing ? "visible" : "hidden";
  }, [playing]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    onPlay && onPlay();
  };

  const handleOnProgress = (changeState) => {
    if (playing) {
      if (count > 2) {
        controlsRef.current.style.visibility = "hidden";
        count = 0;
      }
      if (controlsRef.current.style.visibility == "visible") {
        count += 1;
      }
      setState({ ...state, ...changeState });
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
    screenful.toggle(playerContainerRef.current);
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
      controlsRef.current.style.visibility = "visible";
      count = 0;
    }
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

  console.log("HAS INTERACTIVITY", hasInteractivity);

  return (
    <div ref={playerContainerRef}>
      <>
        <div style={{ position: "relative" }} onMouseMove={handleMouseMove}>
          <ReactPlayer
            key={key}
            ref={playerRef}
            width={width}
            height={height}
            url={src}
            playing={playing}
            onProgress={handleOnProgress}
            onEnded={handleOnEnded}
            muted={muted}
            onBuffer={() => setIsLoadingBuffer(true)}
            onBufferEnd={() => setIsLoadingBuffer(false)}
          />

          <Controls
            ref={controlsRef}
            title={title}
            playing={playing}
            muted={muted}
            played={played}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onPlayPause={handlePlayPause}
            onToggleFullScreen={toggleFullScreen}
            onMute={handleMute}
          />
          {hasInteractivity && endVideoInteractive && (
            <ContainerInteractivity flexDirection="row">
              <FirstContentInteractivity>
                <div style={{ display: "flex", flex: 1 }}></div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                  onClick={onClickFirst}
                ></div>
              </FirstContentInteractivity>
              <SecondContentInteractivity>
                <div style={{ display: "flex", flex: 1 }}></div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                  onClick={onClickSecond}
                ></div>
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
                  strokeWidth={6}
                  isPlaying
                  duration={delayToFinalizeVideo}
                  colors={["#FFFFFF"]}
                  onComplete={handleOnComplete}
                >
                  {({ remainingTime }) => (
                    <MdClose style={{ color: "#000000" }} />
                  )}
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

        {showButtonsFooter && (end || endVideoInteractive) && (
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
        )}
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
