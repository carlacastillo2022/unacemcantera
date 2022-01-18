import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import useScreenOrientation from "react-hook-screen-orientation";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import ReactPlayer from "react-player/lazy";
import Button from "@components/Button";
import screenful from "screenfull";
import styled from "styled-components";
import Loading from "@components/Loading";
import Controls from "./components/Controls";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import ArrowReplay from "@assets/images/arrow-replay.svg";
import { MdClose } from "react-icons/md";
import { isMobile } from "react-device-detect";

let player = null;
let isPlayVideo = false;
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
  background: rgba(229, 40, 32, 0.64);
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
  onPause,
  onEnded,
  onFinishTimer,
  onClickNextVideo,
  playing,
  isLoadingVideo,
  title,
  showButtonsFooter,
  isSelectedVideo,
}) => {
  const playerRef = useRef(null);
  const controlsRef = useRef(null);
  const playerContainerRef = useRef(null);
  const screenOrientation = useScreenOrientation();

  const [firstLoad, setFirstLoad] = useState(false);
  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const [isFinished, setIsFinished] = useState(false);
  const [state, setState] = useState({
    muted: false,
    played: 0,
    duration: 0,
  });

  useEffect(() => {
    if (player) {
      player.seekTo(seek ? seek : 0);
    }
  }, [seek]);

  useEffect(() => {
    if (playing) {
      isPlayVideo = true;
    }
  }, [playing]);

  const handleOnReady = (player_) => {
    if (!firstLoad) {
      player = player_;
      player.seekTo(seek ? seek : 0);
      setFirstLoad(true);
    }
    onReady && onReady(player);
  };

  const handleOnProgress = (changeState) => {
    if (count > 2) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility == "hidden") {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
    onProgress && onProgress(changeState);
  };

  const handleOnEnded = () => {
    console.log("necisot", isPlayVideo);
    if (isPlayVideo) {
      controlsRef.current.style.visibility = "hidden";
      isPlayVideo = false;
      setIsFinished(true);
    }
    onFinishTimer && onFinishTimer();
    /*if (isPlayVideo) {
      controlsRef.current.style.visibility = "visible";
      isPlayVideo = false;
      setIsFinished(true);
    }
    onFinishTimer && onFinishTimer();*/
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat == "normal" ? "remaining" : "normal"
    );
  };

  const handlePlayPause = () => {
    //if(playing)
    isPlayVideo = !playing;
    // setState({ ...state, playing: !state.playing });
    onPlay && onPlay();
  };

  const handleOnComplete = () => {
    setIsFinished(false);
    //controlsRef.current.style.visibility = "visible";
    onEnded && onEnded(playerRef.current.getDuration());
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "hidden";
    count = 0;
  };

  const hanldeMouseLeave = () => {
    //controlsRef.current.style.visibility = "hidden";
    //count = 0;
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

  /*const handleFullScreen = useFullScreenHandle();

  const [state, setState] = useState({
    playing: false,
    muted: false,
    played: 0,
    duration: 0,
  });
  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const [firstLoad, setFirstLoad] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const isPortraitMobile =
    isMobile &&
    (screenOrientation === "portrait-primary" ||
      screenOrientation === "portrait-secondary");

  useEffect(() => {
    console.log("SRC VIDEO", isPlaying, isFinished)
    if (isFinished) setIsFinished(false);
    if (isPlaying) {
      isPlayVideo = true;
      controlsRef.current.style.visibility = "hidden";
    }

    setState({ ...state, playing: isPlaying });
 
  }, [src]);

  useEffect(() => {
    if (player) {
      player.seekTo(seek ? seek : 0);
    }
  }, [seek]);

  const handleOnReady = (player_) => {
    if (!firstLoad) {
      player = player_;
      player.seekTo(seek ? seek : 0);
      setFirstLoad(true);
    }
    onReady && onReady(player);
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handlePlayPause = () => {
    isPlayVideo = true;
    setIsFinished(false);
    setState({ ...state, playing: !state.playing });
    onPlay && onPlay();
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat == "normal" ? "remaining" : "normal"
    );
  };

  const handleMouseMove = () => {
    console.log("mousemove");
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const hanldeMouseLeave = () => {
    //controlsRef.current.style.visibility = "hidden";
    //count = 0;
  };

  const handleOnEnded = () => {
    setState({ ...state, playing: false });
    if (isPlayVideo) {
      controlsRef.current.style.visibility = "visible";
      isPlayVideo = false;
      setIsFinished(true);
    }
    onFinishTimer && onFinishTimer();
    //onEnded && onEnded(playerRef.current.getDuration());
  };

  const handleOnComplete = () => {
    setIsFinished(false);
    controlsRef.current.style.visibility = "visible";
    onEnded && onEnded(playerRef.current.getDuration());
  };

  const handleOnProgress = (changeState) => {
    console.log("count", count);
    if (count > 2) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility == "visible") {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
    onProgress && onProgress(changeState);
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
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
  const { playing, muted, played } = state;*/

  return (
    <div ref={playerContainerRef}>
      <>
        <div
          style={{ position: "relative" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={hanldeMouseLeave}
        >
          <ReactPlayer
            ref={playerRef}
            width={width}
            height={height}
            url={src}
            playing={playing}
            onReady={handleOnReady}
            onProgress={handleOnProgress}
            onEnded={handleOnEnded}
            onPause={onPause}
            muted={muted}
          />
          <Controls
            ref={controlsRef}
            title={title}
            isFullScreen={screenful.isFullscreen}
            muted={muted}
            playing={playing}
            played={played}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onChangeDispayFormat={handleDisplayFormat}
            onDuration={handleDuration}
            onMute={handleMute}
            onPlayPause={handlePlayPause}
            onToggleFullScreen={toggleFullScreen}
          />
          {delayToFinalizeVideo > 0 && isFinished && (
            <ContainerLoading>
              <div
                onClick={() => {
                  setIsFinished(false);
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
                    <MdClose style={{ color: "#FFFFFF" }} />
                  )}
                </CountdownCircleTimer>
              </div>
            </ContainerLoading>
          )}
          {isLoadingVideo && (
            <ContainerLoading>
              <Loading type="Oval" color="#FFFFFF" />
            </ContainerLoading>
          )}
        </div>
        {showButtonsFooter && (
          <ContainerButtonsFooter>
            <Button
              iconLeft={ArrowReplay}
              onClick={() => {
                isPlayVideo = true;
                count = 0;
                setIsFinished(false);
                playerRef.current.seekTo(0);
                /*setState({ ...state, playing: true });*/
              }}
              styleIconLeft={{ height: "30px", width: "30px" }}
              size="small"
              styleButton={{ marginRight: "8px" }}
            />
            <Button
              label="Seguir"
              onClick={() => {
                isPlayVideo = false;
                onClickNextVideo &&
                  onClickNextVideo(playerRef?.current?.getDuration());
              }}
              iconRight={ArrowDoubleRight}
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
  onFinishTimer: PropTypes.func,
  onClickNextVideo: PropTypes.func,
};

Video.defaultProps = {};

export default Video;
