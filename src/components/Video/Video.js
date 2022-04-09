import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { isIOS, isSafari } from "react-device-detect";
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
import Template6 from "./components/Interactivity/Template6";
import Template7 from "./components/Interactivity/Template7";
import Template8 from "./components/Interactivity/Template8";
import Template9 from "./components/Interactivity/Template9";
import Template10 from "./components/Interactivity/Template10";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import ArrowDoubleLeftWhite from "@assets/images/arrow-double-left-white.svg";
import ArrowReplay from "@assets/images/arrow-replay.svg";

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
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  margin-top: 5px;
`;

let timeOutControlsBar = null;
let timerForProgress = 0;

const cancelSubscriptions = () => {
  if(timeOutControlsBar)
    clearTimeout(timeOutControlsBar)
};

const Video = ({
  playerRef,
  width,
  height,
  src,
  playing,
  seek,
  isLoadingVideo,
  videoSelected,
  templateInteractivity,
  delayToFinalizeVideo,
  showButtonsFooter,
  onClickPrevVideo,
  onClickCTA,
  onClickNextVideo,
  onProgress,
  onEnded,
  onEndedTimer,
}) => {
  const controlsRef = useRef(null);
  const containerControlsRef = useRef(null);

  const [widthVideo, setWidthVideo] = useState(width);
  const [heightVideo, setHeightVideo] = useState(height);
  const [isPlaying, setIsPlaying] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [endVideo, setEndVideo] = useState(false);
  const [actionBackButton, setActionBackButton] = useState({
    video: null,
    click: null,
    idNextVideo: null
  });
  const [cancelTimeCounter, setCancelTimeCounter] = useState(false);
  const [key, setKey] = useState();
  const [isLoadingBuffer, setIsLoadingBuffer] = useState(false);
  const [imageInteractivity, setImageInteractivity] = useState();
  const fullScreenHandle = useFullScreenHandle();

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
    playerRef.current?.seekTo(`${seek - 4}`);
  }, [seek])

  useEffect(() => {
    setIsPlaying(playing)
  }, [playing, src])

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.style.display = "none";
    setIsLoadingBuffer(true);
    timerForProgress = 0;
    cancelSubscriptions();
    setKey(src)
    setEndVideo(false);
    setImageInteractivity(null)
    if(actionBackButton.idNextVideo !== videoSelected?.item?.idVideo) {
      setActionBackButton({
        video: null,
        click: null,
        idNextVideo: null
      })
    }
  }, [src])

  useEffect(() => {
    if(endVideo) {
      setCancelTimeCounter(false);
      setTimeout(()=> {
        if (containerControlsRef.current && templateInteractivity) {
          containerControlsRef.current.style.display = "none";
          playerRef.current?.seekTo(playerRef.current?.getDuration() || 0);
        } else {
          containerControlsRef.current.style.display = "flex";
        }
        setIsPlaying(false);
      },1);
    } else {
      if (containerControlsRef.current) 
        containerControlsRef.current.style.display = "flex";
    }
  }, [endVideo])

  const handleMouseMove = () => {
    if(!endVideo) {
      cancelSubscriptions();
      if (controlsRef.current) controlsRef.current.style.display = "block";
      timeOutControlsBar = setTimeout(() => {
        if (controlsRef.current) controlsRef.current.style.display = "none";
      }, 3000);
    }
  };

  const handleOnProgress = (changeState) => {
    setPlayed(changeState.played);
    if (timerForProgress > 2) {
      timerForProgress = 0;
      onProgress && onProgress(changeState);
    } else {
      timerForProgress += 1;
    }
  };

  const handlePlayPause = () => {
    if(cancelTimeCounter) replayVideo()
    else setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleFullScreen = () => {
    if (fullScreenHandle.active) {
      fullScreenHandle.exit();
    } else {
      fullScreenHandle.enter();
    }
  }

  const handleOnEnded = () => {
    setEndVideo(true);
    onEnded && onEnded(playerRef.current.getDuration());
  };

  const handleOnComplete = () => {
    setCancelTimeCounter(true);
    onEndedTimer && onEndedTimer(playerRef.current.getDuration());
  };

  const handleOnClickInteractivity = (currentVideo, idVideo, duration) => {
    setActionBackButton({
      video: currentVideo,
      click: 'click on interactivity',
      idNextVideo: idVideo
    });
    onClickCTA && onClickCTA(idVideo, duration);
  }

  const replayVideo = () => {
    setPlayed(0);
    playerRef.current?.seekTo(0);
    setIsPlaying(true);
    setEndVideo(false);
  }
 
  const renderContentBottom = () => {
    return showButtonsFooter ? (
      <ContainerButtonsFooter>
        {actionBackButton.click && (<Button
          label="Volver"
          iconLeft={ArrowDoubleLeftWhite}
          onClick={() => {
            const videoBackButton = actionBackButton.video;
            setActionBackButton({
              video: null,
              click: null,
              idNextVideo: null
            })
            onClickPrevVideo &&
              onClickPrevVideo(videoBackButton);
          }}
          styleIconRight={{ height: "30px", width: "30px" }}
          size="small"
        />)}
        <Button
          iconLeft={ArrowReplay}
          styleIconLeft={{ height: "30px", width: "30px" }}
          onClick={() => replayVideo()}
          size="small"
          styleButton={{ marginRight: "8px", marginLeft: "8px"}}
        />
        <Button
          label="Seguir"
          disabled={!endVideo}
          iconRight={ArrowDoubleRight}
          onClick={() => {
            setEndVideo(false);
            onClickNextVideo &&
              onClickNextVideo(playerRef.current?.getDuration());
          }}
          styleIconRight={{ height: "30px", width: "30px" }}
          size="small"
        />
      </ContainerButtonsFooter>
    ) : null;
  };

  const currentTime = playerRef.current?.getCurrentTime();
  const duration = playerRef.current?.getDuration();
  const ctas = videoSelected?.item?.ctas ? JSON.parse(videoSelected?.item?.ctas): null

  return (
    <div>
      <>
        <FullScreen handle={fullScreenHandle}>
          <div
            style={{
              width: widthVideo,
              minHeight: heightVideo,
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
              playing={isPlaying}
              autoPlay={isPlaying}
              muted={isMuted}
              onError={()=> {
                if(isIOS || isSafari)
                  setIsPlaying(!isPlaying)
              }}
              onEnded={handleOnEnded}
              onProgress={handleOnProgress}
              onReady={() => {
                setIsLoadingBuffer(false);
              }} 
              onBuffer={() => setIsLoadingBuffer(true)}
              onBufferEnd={() => setIsLoadingBuffer(false)}
              type='video/mp4'
            />
                      
            <Controls
              controlsRef={controlsRef}
              containerControlsRef={containerControlsRef}
              player={playerRef.current}
              playing={isPlaying}
              played={played}
              currentTime={currentTime}
              duration={duration}
              muted={isMuted}
              isFullScreen={fullScreenHandle.active}
              onMuted={handleMute}
              onPlayPause={handlePlayPause}
              onToggleFullScreen={handleToggleFullScreen}
              contentBottom={
                fullScreenHandle.active ? renderContentBottom() : null
              }
            /> 

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template1" && (
                <Template1
                  onClickFirst={() => handleOnClickInteractivity(videoSelected, ctas[`cta1`], playerRef?.current?.getDuration())}
                  onClickSecond={() => handleOnClickInteractivity(videoSelected, ctas[`cta2`], playerRef?.current?.getDuration())}
                />
              )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template2" && (
                <Template2
                  src={imageInteractivity}
                  onClickFirst={() =>
                    setImageInteractivity(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImageInteractivity(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    setImageInteractivity(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template3" && (
                <Template3
                  onClickFirst={() => handleOnClickInteractivity(videoSelected, ctas[`cta1`], playerRef?.current?.getDuration())}
                  onClickSecond={() => handleOnClickInteractivity(videoSelected, ctas[`cta2`], playerRef?.current?.getDuration())}
                  onClickThird={() => handleOnClickInteractivity(videoSelected, ctas[`cta3`], playerRef?.current?.getDuration())}
                />
              )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template4" && (
                <Template4
                  src={imageInteractivity}
                  onClickFirst={() =>
                    setImageInteractivity(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImageInteractivity(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template5" && (
                <Template5
                  src={imageInteractivity}
                  onClickFirst={() =>
                    setImageInteractivity(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImageInteractivity(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    setImageInteractivity(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                  onClickFourth={() =>
                    setImageInteractivity(ctas[`cta4`], playerRef?.current?.getDuration())
                  }
                  onClickFifth={() =>
                    setImageInteractivity(ctas[`cta5`], playerRef?.current?.getDuration())
                  }
                  onClickSixth={() =>
                    setImageInteractivity(ctas[`cta6`], playerRef?.current?.getDuration())
                  }
                  onClickSeventh={() =>
                    setImageInteractivity(ctas[`cta7`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {showButtonsFooter && endVideo && !templateInteractivity && !cancelTimeCounter && (
              <ContainerLoading>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "19px",
                  }}
                  onClick={()=> {
                    setCancelTimeCounter(true);
                  }}
                >
                  <>
                    <CountdownCircleTimer
                      size={50}
                      strokeWidth={8}
                      isPlaying
                      duration={delayToFinalizeVideo}
                      colors={["#FFFFFF"]}
                      onComplete={() => handleOnComplete()}
                    />
                    <Description>Cargando próximo video...</Description>
                  </>
                </div>
              </ContainerLoading>
            )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template6" && (
                <Template6
                  src={imageInteractivity}
                  onClickFirst={() =>
                    setImageInteractivity(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImageInteractivity(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template7" && (
                <Template7
                  src={imageInteractivity}
                  onClickFirst={() =>
                    setImageInteractivity(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImageInteractivity(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    setImageInteractivity(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                  onClickFourth={() =>
                    setImageInteractivity(ctas[`cta4`], playerRef?.current?.getDuration())
                  }
                  onClickFifth={() =>
                    setImageInteractivity(ctas[`cta5`], playerRef?.current?.getDuration())
                  }
                  onClickSixth={() =>
                    setImageInteractivity(ctas[`cta6`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template8" && (
                <Template8
                  src={imageInteractivity}
                  onClickFirst={() =>
                    setImageInteractivity(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImageInteractivity(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    setImageInteractivity(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                  onClickFourth={() =>
                    setImageInteractivity(ctas[`cta4`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template9" && (
                <Template9
                  src={imageInteractivity}
                  onClickFirst={() =>
                    setImageInteractivity(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImageInteractivity(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    setImageInteractivity(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                  onClickFourth={() =>
                    setImageInteractivity(ctas[`cta4`], playerRef?.current?.getDuration())
                  }
                  onClickFifth={() =>
                    setImageInteractivity(ctas[`cta5`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {templateInteractivity &&
              endVideo &&
              templateInteractivity === "template10" && (
                <Template10
                  src={imageInteractivity}
                  onClickFirst={() =>
                    setImageInteractivity(ctas[`cta1`], playerRef?.current?.getDuration())
                  }
                  onClickSecond={() =>
                    setImageInteractivity(ctas[`cta2`], playerRef?.current?.getDuration())
                  }
                  onClickThird={() =>
                    setImageInteractivity(ctas[`cta3`], playerRef?.current?.getDuration())
                  }
                  onClickFourth={() =>
                    setImageInteractivity(ctas[`cta4`], playerRef?.current?.getDuration())
                  }
                />
              )}

            {isLoadingVideo || isLoadingBuffer && (
                <ContainerLoading>
                  <Loading type="Oval" color="#FFFFFF" />
                </ContainerLoading>
              )}
          </div>
        </FullScreen>
        {renderContentBottom()}
      </>
    </div>
  );
};

Video.defaultProps = {
  seek: 0,
};

Video.propTypes = {
  playerRef: PropTypes.object.isRequired,
  delayToFinalizeVideo: PropTypes.number,
  onInitTimer: PropTypes.func,
  onClickNextVideo: PropTypes.func,
  ctas: PropTypes.object,
  onClickCTA: PropTypes.func,
};

Video.defaultProps = {};

export default Video;
