import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import ReactPlayer from "react-player/lazy";
import Button from "@components/Button";
import styled from "styled-components";
import Loading from "@components/Loading";
import Controls from "./components/Controls";
import Template1 from "./components/Interactivity/Template1";
import Template2 from "./components/Interactivity/Template2";
import Template3 from "./components/Interactivity/Template3";
import Template4 from "./components/Interactivity/Template4";
import Template5 from "./components/Interactivity/Template5";
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
  templateInteractividad,
  ctas,
  onClickCTA,
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
  const [image, setImage] = useState();
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
      controlsRef.current.style.display = endVideoInteractive
        ? "none"
        : "block";
  }, [endVideoInteractive]);

  useEffect(() => {
    if (templateInteractividad) {
      setImage("");
      setEndVideoInteractive(false);
    }
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
    if (playing) {
      setEndTime(false);
    }
    if (!playing && templateInteractividad) setImage("");
    //if (!templateInteractividad)
    if (controlsRef.current)
      controlsRef.current.style.display = !playing ? "block" : "none";
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
        if (controlsRef.current) controlsRef.current.style.display = "none";
        count = 0;
      }
      if (controlsRef.current && controlsRef.current.style.display == "block") {
        count += 1;
      }
      setState({ ...state, ...changeState });
      setLastMinuteSeenVideo(changeState.playedSeconds);
      onProgress && onProgress(changeState);
    }
  };

  const handleOnEnded = () => {
    if (!templateInteractividad) {
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
    if (!templateInteractividad) {
      if (controlsRef.current) controlsRef.current.style.display = "block";
      count = 0;
    } else {
      if (controlsRef.current) controlsRef.current.style.display = "block";
      if (controlsRef.current) {
        if (endVideoInteractive) controlsRef.current.style.display = "none";
        else controlsRef.current.style.display = "block";
      }
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
            if (templateInteractividad) {
              setImage("");
              setEndVideoInteractive(false);
            }
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
            {templateInteractividad && (
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

            {!templateInteractividad && (
              <Controls
                controlsRef={controlsRef}
                showControlsPlayer={!templateInteractividad}
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

            {templateInteractividad &&
              endVideoInteractive &&
              templateInteractividad === "template1" && (
                <Template1
                  onClickFirst={() =>
                    onClickCTA(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    onClickCTA(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractividad &&
              endVideoInteractive &&
              templateInteractividad === "template2" && (
                <Template2
                  src={image}
                  onClickFirst={() =>
                    setImage(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImage(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    setImage(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractividad &&
              endVideoInteractive &&
              templateInteractividad === "template3" && (
                <Template3
                  onClickFirst={() =>
                    onClickCTA(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    onClickCTA(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    onClickCTA(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractividad &&
              endVideoInteractive &&
              templateInteractividad === "template4" && (
                <Template4
                  src={image}
                  onClickFirst={() =>
                    setImage(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImage(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractividad &&
              endVideoInteractive &&
              templateInteractividad === "template5" && (
                <Template5
                  src={image}
                  onClickFirst={() =>
                    setImage(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImage(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    setImage(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                  onClickFourth={() =>
                    setImage(ctas[`cta4`], playerRef?.current?.getDuration())
                  }
                  onClickFifth={() =>
                    setImage(ctas[`cta5`], playerRef?.current?.getDuration())
                  }
                  onClickSixth={() =>
                    setImage(ctas[`cta6`], playerRef?.current?.getDuration())
                  }
                  onClickSeventh={() =>
                    setImage(ctas[`cta7`], playerRef?.current?.getDuration())
                  }
                />
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
  ctas: PropTypes.object,
  onClickCTA: PropTypes.func,
};

Video.defaultProps = {};

export default Video;
