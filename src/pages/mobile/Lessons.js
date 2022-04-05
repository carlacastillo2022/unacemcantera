import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import {
  useFetchLessons,
  useFetchTracking,
  useFetchQuestions,
} from "@hooks/useCourses";
import { Video } from "@components/Video";
import ROUTES from "@routes/constants";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import Steps from "@components/Steps";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleLeftDark from "@assets/images/arrow-double-left-dark.svg";
import LockedButton from "@assets/images/locked-button.svg";
import QuickQuestionary from "@components/QuickQuestionary";

const Paragraph = styled.p`
  font-weight: 400 !important;
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;

const DescriptionVideo = styled.div`
  font-weight: 400 !important;
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;

let currentTimeViewed = 0;

const Lesson = () => {
  const videoContainer = useRef(null);
  const playerRef = useRef(null);

  const location = useLocation();
  const history = useHistory();
  const [disabledButton, setDisabledButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [videoSelected, setVideoSelected] = useState({ item: null, index: -1 });
  const [questionary, setQuestionary] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [seek, setSeek] = useState(0);

  const token = location?.state?.token;
  const idCurso = location?.state?.idCurso;
  const nombreCurso = location?.state?.nombreCurso;

  const { fetch: fetchVideoByCourse, data: dataLessons } = useFetchLessons();
  const { fetch: fetchTracking } = useFetchTracking();
  const { fetch: fetchQuestions, data: dataQuestions } = useFetchQuestions();

  useEffect(() => {
    currentTimeViewed = videoSelected?.item?.ultimoMinutoVisto || 0;
    setSeek(currentTimeViewed);
  }, [videoSelected]);

  useEffect(() => {
    setIsLoading(true);
    fetchVideoByCourse(token, idCurso);
  }, []);

  useEffect(() => {
    setIsLoading(false);
    if (dataQuestions?.success) {
      if (dataQuestions?.data?.length > 0) {
        setQuestionary(dataQuestions?.data);
      } else {
        updateStepsFlow(lessons);
      }
    }
  }, [dataQuestions]);

  useEffect(() => {
    setIsLoading(false);
    if (dataLessons?.success) {
      const data = dataLessons?.data;
      updateStepsFlow(data);
    }
  }, [dataLessons]);

  const onFinished = () => {
    setIsLoading(true);
    setQuestionary([]);
    fetchVideoByCourse(token, idCurso);
  };

  const onClickQuestionary = () => {
    history.push({
      pathname: ROUTES.QUESTIONARY,
      state: {
        token,
        idCurso: videoSelected?.item?.idCurso,
        nombreCurso: videoSelected?.item?.nombreCurso,
      },
    });
  };

  const handleOnProgress = (e) => {
    const currentTime = e.playedSeconds;
    currentTimeViewed = currentTime;
    fetchTracking(
      token,
      videoSelected?.item?.idCurso,
      videoSelected?.item?.idVideo,
      currentTime
    );
  };

  const handleOnEnded = (currentTime) => {
    currentTimeViewed = currentTime;
    const lessonsUpdated = updateTrackingVideoSelected();
    setLessons(lessonsUpdated);
    updateDisabledButton(lessonsUpdated)
    fetchTracking(
      token,
      videoSelected?.item?.idCurso,
      videoSelected?.item?.idVideo,
      currentTime,
      true
    );
    
  };

  const handleOnEndedTimer = (currentTime) => { 
    currentTimeViewed = currentTime;
    fetchQuestions(
      token,
      videoSelected?.item?.idCurso,
      videoSelected?.item?.idVideo
    )
  };

  const onClickNextVideo = (currentTime) => {
    setIsLoading(true);
    setPlaying(false);
    fetchQuestions(
      token,
      videoSelected?.item?.idCurso,
      videoSelected?.item?.idVideo
    );
  };

  const onClickPrevVideo = video => {
    setQuestionary([]);
    setVideoSelected(video);
    setPlaying(true);
  }

  const onClickCTA = (idVideo, currentTime) => {
    const find = {
      index: lessons.findIndex((item) => item.idVideo === idVideo),
      item: lessons.find((item) => item.idVideo === idVideo),
    };
    updateDisabledButton(lessons);
    if (videoSelected.index !== -1) {
      setVideoSelected(find);
      setPlaying(true);
    }
  };

  const updateTrackingVideoSelected = () => {
    const lessonsUpdated = lessons.map((item) => {      
      if(item?.idVideo === videoSelected.item?.idVideo) { 
        return ({
          ...item,
          completoVista: (
            Math.trunc(currentTimeViewed) === Math.trunc(item.ultimoMinutoVisto || 0) ||
            Math.trunc(currentTimeViewed) === Math.trunc(playerRef.current?.getDuration() || 0)
          ) ? "SI": "NO",
          ultimoMinutoVisto: currentTimeViewed <= parseFloat(item.ultimoMinutoVisto || 0) ? item.ultimoMinutoVisto : currentTimeViewed,
        })
      }
      return item;
    });
    return lessonsUpdated;
  }

  const updateStepsFlow = (data) => {
    setLessons(data);
    if (data.length - 1 > videoSelected.index) {
      let find = null;
      if (data.length > 0) {
        if (videoSelected?.item) {
          if (videoSelected?.index + 1 < data?.length) {
            find = {
              index: videoSelected?.index + 1,
              item: data[videoSelected?.index + 1],
            };
          }
        } else {
          find = {
            index: 0,
            item: data[0],
          };
        }
      }
      updateDisabledButton(data);
      setVideoSelected(find);
      setPlaying(true);
    } else {
      const find = {
        index: data.length - 1,
        item: data[data.length - 1],
      };
      updateDisabledButton(data)
      setVideoSelected(find);
      setPlaying(false);
    }
  }

  const updateDisabledButton = data => {
    setDisabledButton(
      data?.find((item) => item?.completoVista !== "SI")
      ? true
      : false
    );
  }

  return (
    <div ref={videoContainer}>
      <Link
        onClick={() => {
          history.goBack();
        }}
      >
        <img src={ArrowDoubleLeft} />
        <span>{nombreCurso}</span>
      </Link>

      <div style={{ margin: "16px 0px" }}>
        {questionary?.length === 0 && videoSelected?.item ? (
          <Video
            playerRef={playerRef}
            width="100%"
            height="30%"
            playing={playing}
            setPlaying={setPlaying}
            seek={seek}
            src={`https://${videoSelected?.item?.rutaPublica}`}
            onProgress={handleOnProgress}
            onEnded={handleOnEnded}
            onEndedTimer={handleOnEndedTimer}
            onClickNextVideo={onClickNextVideo}
            onClickPrevVideo={onClickPrevVideo}
            onClickCTA={onClickCTA}
            isLoadingVideo={isLoading}
            showButtonsFooter
            delayToFinalizeVideo={5}
            templateInteractivity={videoSelected?.item?.templateInteractividad}
            ctas={
              videoSelected?.item?.ctas
                ? JSON.parse(videoSelected?.item?.ctas)
                : null
            }
            videoSelected={videoSelected}
          />
        ) : questionary?.length > 0 ? (
          <QuickQuestionary
            questionary={questionary}
            videoSelected={videoSelected}
            token={token}
            onFinished={onFinished}
          />
        ) : null}
      </div>
      {videoSelected?.item && (
        <>
          <Title type="lg">
            {`Lección ${videoSelected?.index + 1 || 1}: ${
              videoSelected?.item?.nombreVideo || ""
            }`}
          </Title>
          {videoSelected?.item?.descripcionVideo && (
            <DescriptionVideo dangerouslySetInnerHTML= {{__html: videoSelected?.item?.descripcionVideo}}>
            </DescriptionVideo> 
          )}
        </>
      )}

      <>
        <Steps
          lessons={lessons}
          videoSelected={videoSelected}
          onCallbackVideoSelected={(item, index) => {
            setQuestionary([]);
            videoContainer.current.scrollIntoView({ behavior: "smooth" });
            setVideoSelected({
              item,
              index,
            });
            setPlaying(true);
          }}
        />
      </>

      <>
        <Button
          onClick={onClickQuestionary}
          disabled={disabledButton}
          label="OBTENER CERTIFICADO"
          iconLeft={LockedButton}
        />
      </>
      <Paragraph>
        Recuerda que debes terminar el curso en su totalidad para realizar el
        cuestionario y obtener tu certificado.
      </Paragraph>
      <Link
        style={{ color: "#333333", fontWeight: 700, marginTop: "20px" }}
        onClick={() => {
          window.parent.location.href =
            "https://unacemcantera.com.pe/capacitaciones/";
        }}
      >
        <img src={ArrowDoubleLeftDark} />
        <span>Ver todos los cursos</span>
      </Link>
    </div>
  );
};

export default Lesson;
