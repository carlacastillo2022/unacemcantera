import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import {
  useFetchLessons,
  useFetchTracking,
  useFetchQuestions,
} from "@hooks/useCourses";
import { Video } from "@components/Video";
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

let timeOutFetch = 2;
let isPlay = false;
let isEnd = false;

const Lesson = () => {
  const videoContainer = useRef(null);

  const location = useLocation();
  const history = useHistory();
  const [disabledButton, setDisabledButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [videoSelected, setVideoSelected] = useState({ item: null, index: -1 });
  const [questionary, setQuestionary] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [showButtonsFooter, setShowButtonsFooter] = useState(false);
  const [seek, setSeek] = useState(0);

  const token = location?.state?.token;
  const idCurso = location?.state?.idCurso;

  const { fetch: fetchVideoByCourse, data: dataLessons } = useFetchLessons();
  const { fetch: fetchTracking, data: dataTracking } = useFetchTracking();
  const { fetch: fetchQuestions, data: dataQuestions } = useFetchQuestions();

  useEffect(() => {
    setSeek(videoSelected?.item?.ultimoMinutoVisto || 0);
  }, [videoSelected]);

  useEffect(() => {
    fetchVideoByCourse(token, idCurso);
  }, []);

  useEffect(() => {
    if (dataTracking?.success && isEnd) {
      isEnd = false;
      setIsLoading(true);
      fetchQuestions(
        token,
        videoSelected?.item?.idCurso,
        videoSelected?.item?.idVideo
      );
      //fetchVideoByCourse(token, idCurso);
    }
  }, [dataTracking]);

  useEffect(() => {
    setIsLoading(false);
    if (dataQuestions?.success) {
      if (dataQuestions?.data?.length > 0) {
        setQuestionary(dataQuestions?.data);
      } else {
        fetchVideoByCourse(token, idCurso);
      }
    }
  }, [dataQuestions]);

  useEffect(() => {
    if (dataLessons?.success) {
      const data = dataLessons?.data;
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
        setDisabledButton(
          data?.find((item) => item.completoVista !== "SI") ? true : false
        );

        setSeek(0);
        setVideoSelected(find);
        isPlay = true;
        setPlaying(true);
      } else {
        isPlay = false;
        const find = {
          index: data.length - 1,
          item: data[data.length - 1],
        };
        setDisabledButton(
          data?.find((item) => item.completoVista !== "SI") ? true : false
        );
        setVideoSelected(find);
        setPlaying(false);
      }
    }
  }, [dataLessons]);

  const onFinished = () => {
    setQuestionary([]);
    fetchVideoByCourse(token, idCurso);
  };

  const onClickQuestionary = () => {
    history.push({
      pathname: "/questionary",
      state: {
        token,
        idCurso: videoSelected?.item?.idCurso,
        nombreCurso: videoSelected?.item?.nombreCurso,
      },
    });
  };

  const handleOnProgress = (e) => {
    const currentTime = e.playedSeconds;
    if (isPlay) {
      if (currentTime > timeOutFetch) {
        timeOutFetch = currentTime + timeOutFetch;
        fetchTracking(
          token,
          videoSelected?.item?.idCurso,
          videoSelected?.item?.idVideo,
          currentTime
        );
      }
    }
  };

  const handleOnPlay = () => {
    isEnd = false;
    isPlay = !playing;
    timeOutFetch = 2;
    setPlaying(!playing);
  };

  const handleOnEnded = (currentTime) => {
    if (isPlay) {
      isPlay = false;
      isEnd = true;
      fetchTracking(
        token,
        videoSelected?.item?.idCurso,
        videoSelected?.item?.idVideo,
        currentTime,
        true
      );
    }
  };

  const handleOnInitTimer = () => {
    setPlaying(false);
    setShowButtonsFooter(true);
  };

  const onClickNextVideo = (currentTime) => {
    isPlay = false;
    isEnd = true;
    setPlaying(false);
    fetchTracking(
      token,
      videoSelected?.item?.idCurso,
      videoSelected?.item?.idVideo,
      currentTime,
      true
    );
  };

  const onClickCTA = (idVideo, currentTime) => {
    const find = {
      index: lessons.findIndex((item) => item.idVideo === idVideo),
      item: lessons.find((item) => item.idVideo === idVideo),
    };
    setDisabledButton(
      lessons?.find((item) => item.completoVista !== "SI") ? true : false
    );
    if (videoSelected.index !== -1) {
      setSeek(0);
      setVideoSelected(find);
      isPlay = true;
      setPlaying(true);
    }
  };

  return (
    <div ref={videoContainer}>
      <Link
        onClick={() => {
          history.goBack();
        }}
      >
        <img src={ArrowDoubleLeft} />
        <span>Volver</span>
      </Link>

      <div style={{ margin: "16px 0px" }}>
        {questionary?.length === 0 && videoSelected?.item ? (
          <Video
            width="100%"
            height="30%"
            playing={playing}
            setPlaying={setPlaying}
            seek={seek}
            src={`https://${videoSelected?.item?.rutaPublica}`}
            onProgress={handleOnProgress}
            onPlay={handleOnPlay}
            onEnded={handleOnEnded}
            onInitTimer={handleOnInitTimer}
            onClickNextVideo={onClickNextVideo}
            onClickCTA={onClickCTA}
            isLoadingVideo={isLoading}
            showButtonsFooter
            delayToFinalizeVideo={5}
            title={videoSelected?.item?.nombreVideo || ""}
            templateInteractividad={videoSelected?.item?.templateInteractividad}
            ctas={
              videoSelected?.item?.ctas
                ? JSON.parse(videoSelected?.item?.ctas)
                : null
            }
            lastMinuteSeen={videoSelected?.item?.ultimoMinutoVisto}
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
        <Title type="lg">
          {`Lección ${videoSelected?.index + 1 || 1}: ${
            videoSelected?.item?.nombreVideo || ""
          }`}
        </Title>
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
