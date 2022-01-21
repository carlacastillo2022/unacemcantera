import React, { useEffect, useRef, useState } from "react";
import { sumDurations } from "@commons/utils";
import {
  useFetchCourse,
  useFetchLessons,
  useFetchTracking,
  useFetchQuestions,
} from "@hooks/useCourses";
import { StringParam, useQueryParam } from "use-query-params";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import CardInfo from "@components/CardInfo";
import Steps from "@components/Steps";
import { Video } from "@components/Video";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleLeftDark from "@assets/images/arrow-double-left-dark.svg";
import LockedButton from "@assets/images/locked-button.svg";
import Time from "@assets/images/time.svg";
import Lessons from "@assets/images/lessons.svg";
import Loading from "@components/Loading";
import QuickQuestionary from "@components/QuickQuestionary";

const ContainerCards = styled.div`
  margin-top: 22px;
  margin-bottom: 16px;
`;

const Paragraph = styled.p`
  font-weight: 400 !important;
  font-size: 18px;
  line-height: 28px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
`;

const ContentLeft = styled.div`
  width: 60%;
`;

const ContentRight = styled.div`
  width: 40%;
  background: #fafafa;
  border-radius: 8px;
  margin: 0px 15px;
  padding: 16px;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

let timeOutFetch = 2;
let isPlay = false;
let isEnd = false;

const Home = () => {
  const history = useHistory();
  const [token, setToken] = useQueryParam("token", StringParam);
  const [idCurso, setIdCurso] = useQueryParam("idCurso", StringParam);

  const [disabledButton, setDisabledButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectedVideo, setIsSelectedVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [lessons, setLessons] = useState([]);
  const [videoSelected, setVideoSelected] = useState({ item: null, index: -1 });
  const [duration, setDuration] = useState();
  const [questionary, setQuestionary] = useState([]);
  const [showButtonsFooter, setShowButtonsFooter] = useState(false);
  const [seek, setSeek] = useState(0);

  const { fetch: fetchVideoByCourse, data: dataLessons } = useFetchLessons();
  const { fetch: fetchTracking, data: dataTracking } = useFetchTracking();
  const { fetch: fetchQuestions, data: dataQuestions } = useFetchQuestions();
  const { fetch: fetchCourse, data: dataInfoCourse } = useFetchCourse();

  useEffect(() => {
    setSeek(videoSelected?.item?.ultimoMinutoVisto || 0);
  }, [videoSelected]);

  useEffect(() => {
    fetchCourse(token, idCurso);
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
    if (dataLessons && dataLessons?.success) {
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
        const sumDurations_ = sumDurations(dataLessons?.data);
        setDuration(sumDurations_.formatted);
        if (videoSelected.index !== -1) {
          setSeek(0);
          setVideoSelected(find);
          isPlay = true;
          setPlaying(true);
        }
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

  const handleOnProgress = (e) => {
    const currentTime = e.playedSeconds;
    if (isPlay && isSelectedVideo) {
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
    if (isPlay && isSelectedVideo) {
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

  const handleOnEndedVideoInteractive = () => {
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

  const onFinished = () => {
    setQuestionary([]);
    fetchVideoByCourse(token, videoSelected?.item?.idCurso);
  };

  const handleOnInitTimer = () => {
    setPlaying(false);
    setShowButtonsFooter(true);
  };

  const onClickQuestionary = () => {
    history.push({
      pathname: "/questionary",
      state: {
        token,
        idCurso: dataInfoCourse?.data[0].idCurso,
        nombreCurso: videoSelected?.item?.nombreCurso,
      },
    });
  };

  const onClickFirst = () => {

    const find = {
      index: videoSelected?.index + 1,
      item: lessons[videoSelected?.index + 1],
    };

    setDisabledButton(
      lessons?.find((item) => item.completoVista !== "SI") ? true : false
    );
    if (videoSelected.index !== -1) {
      setSeek(0);
      setVideoSelected(find);
      isPlay = true;
      isSelectedVideo = true;
      setPlaying(true);
    }
  };

  const onClickSecond = () => {
    /*const firstIndex = lessons.findIndex(item => item.ultimoMinutoVisto === null);
    const currentIndex = videoSelected.index + 1;

    if(firstIndex === currentIndex) {

    } else {
      const max = Math.max(firstIndex, currentIndex);
      const min = Math.min(firstIndex, currentIndex)
    }*/

    const find = {
      index: 19,
      item: lessons[19],
    };

    setDisabledButton(
      lessons?.find((item) => item.completoVista !== "SI") ? true : false
    );
    if (videoSelected.index !== -1) {
      setSeek(0);
      setVideoSelected(find);
      isPlay = true;
      isSelectedVideo = true;
      setPlaying(true);
    }
  };

  return (
    <>
      <Link
        onClick={() => {
          window.parent.location.href =
            "https://unacemcantera.com.pe/capacitaciones/";
        }}
      >
        <img src={ArrowDoubleLeft} />
        <span>Volver</span>
      </Link>
      <Content>
        <ContentLeft>
          <div style={{ margin: "16px 0px" }}>
            {questionary?.length === 0 ? (
              <>
                <Video
                  innerRef={videoRef}
                  width="100%"
                  height="100%"
                  playing={playing}
                  setPlaying={setPlaying}
                  src={
                    !isSelectedVideo
                      ? dataInfoCourse?.data?.length &&
                        `https://${dataInfoCourse?.data[0].thumbnailRutaPublica}`
                      : `https://${videoSelected?.item?.rutaPublica}`
                  }
                  seek={seek}
                  onProgress={handleOnProgress}
                  onPlay={handleOnPlay}
                  onEnded={handleOnEnded}
                  onEndedVideoInteractive={handleOnEndedVideoInteractive}
                  onClickFirst={onClickFirst}
                  onClickSecond={onClickSecond}
                  onInitTimer={handleOnInitTimer}
                  onClickNextVideo={onClickNextVideo}
                  isLoadingVideo={isLoading}
                  showButtonsFooter={
                    !isSelectedVideo ? false : true
                  }
                  delayToFinalizeVideo={!isSelectedVideo ? 0 : 5}
                  title={videoSelected?.item?.nombreVideo || ""}
                  hasInteractivity={videoSelected?.index === 12}
                  lastMinuteSeen={videoSelected?.item?.ultimoMinutoVisto}
                />
              </>
            ) : (
              <QuickQuestionary
                questionary={questionary}
                videoSelected={videoSelected}
                token={token}
                onFinished={onFinished}
              />
            )}
          </div>
          <Title type="lg">
            {!isSelectedVideo
              ? dataInfoCourse?.data?.length &&
                `${dataInfoCourse?.data[0].nombreCurso}`
              : `Lección ${videoSelected?.index + 1 || 1}: ${
                  videoSelected?.item?.nombreVideo || ""
                }`}
          </Title>

          {!isSelectedVideo && (
            <>
              <ContainerCards>
                <CardInfo
                  icon={Time}
                  title="Duración del curso"
                  subTitle={duration}
                />
                <CardInfo
                  icon={Lessons}
                  title="Lecciones"
                  subTitle={`${lessons.length} ${
                    lessons.length > 1 ? "lecciones" : "leccion"
                  }`}
                />
              </ContainerCards>
              <Paragraph>
                {lessons.length ? lessons[0].descripcionCurso : ""}
              </Paragraph>
            </>
          )}
          {isSelectedVideo && (
            <Paragraph style={{ fontSize: "18px", lineHeight: "28px" }}>
              {`Duración: ${videoSelected?.item?.duracion}/ Video`}
            </Paragraph>
          )}
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
        </ContentLeft>
        <ContentRight>
          <Steps
            lessons={lessons}
            disabledClose
            videoSelected={videoSelected}
            onCallbackVideoSelected={(item, index) => {
              isPlay = true;
              setSeek(0);
              setIsSelectedVideo(true);
              setVideoSelected({
                item,
                index,
              });
              setPlaying(true);
            }}
          />
          <Button
            disabled={disabledButton}
            onClick={onClickQuestionary}
            label="OBTENER CERTIFICADO"
            iconLeft={LockedButton}
          />
          <Paragraph style={{ fontSize: "14px" }}>
            Recuerda que debes terminar el curso en su totalidad para realizar
            el cuestionario y obtener tu certificado.
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
        </ContentRight>
      </Content>
    </>
  );
};

export default Home;
