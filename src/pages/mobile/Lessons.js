import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import {
  useFetchLessons,
  useFetchTracking,
  useFetchQuestions,
} from "@hooks/useCourses";
import { sumDurations } from "@commons/utils";
import { Video, ThumbnailVideo } from "@components/Video";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import Steps from "@components/Steps";
import Loading from "@components/Loading";
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

const ContainerLoading = styled.div`
  width: 100%;
  height: 200px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let timeOutFetch = 2;
let isPlay = false;
let isEnd = false;

const Lesson = () => {
  const videoContainer = useRef(null);
  const videoRef = useRef(null);

  const location = useLocation();
  const history = useHistory();
  const [disabledButton, setDisabledButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [videoSelected, setVideoSelected] = useState({ item: null, index: -1 });
  const [questionary, setQuestionary] = useState([]);
  const [duration, setDuration] = useState();
  const [seconds, setSeconds] = useState(0);
  const token = location?.state?.token;
  const idCurso = location?.state?.idCurso;
  const nombreCurso = location?.state?.nombreCurso;

  const { fetch: fetchVideoByCourse, data: dataLessons } = useFetchLessons();
  const { fetch: fetchTracking, data: dataTracking } = useFetchTracking();
  const { fetch: fetchQuestions, data: dataQuestions } = useFetchQuestions();

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
      setLessons(data);
      const sumDurations_ = sumDurations(dataLessons?.data);
      setDuration(sumDurations_.formatted);
      setSeconds(sumDurations_.seconds);
      setVideoSelected(find);
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
    isPlay = true;
    timeOutFetch = 2;
  };

  const handleOnEnded = () => {
    const currentTime = videoRef?.current.getDuration();
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
        {!isLoading ? (
          questionary?.length === 0 && videoSelected?.item ? (
            <Video
              innerRef={videoRef}
              width="100%"
              height="30%"
              controls
              seek={videoSelected?.item?.ultimoMinutoVisto}
              src={`https://${videoSelected?.item?.rutaPublica}`}
              onProgress={handleOnProgress}
              onPlay={handleOnPlay}
              onEnded={handleOnEnded}
            />
          ) : questionary?.length > 0 ? (
            <QuickQuestionary
              questionary={questionary}
              videoSelected={videoSelected}
              token={token}
              onFinished={onFinished}
            />
          ) : null
        ) : (
          <ContainerLoading>
            <Loading />
          </ContainerLoading>
        )}
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
            
              videoContainer.current.scrollIntoView({ behavior: "smooth" });
              setVideoSelected({
                item,
                index,
              });
        
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
