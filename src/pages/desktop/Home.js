import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { sumDurations } from "@commons/utils";
import {
  useFetchCourse,
  useFetchLessons,
  useFetchTracking,
  useFetchQuestions,
} from "@hooks/useCourses";
import { StringParam, useQueryParam } from "use-query-params";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import ROUTES from "@routes/constants";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import Steps from "@components/Steps";
import { Video } from "@components/Video";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleLeftDark from "@assets/images/arrow-double-left-dark.svg";
import LockedButton from "@assets/images/locked-button.svg";
import QuickQuestionary from "@components/QuickQuestionary";

const Paragraph = styled.p`
  font-weight: 400 !important;
  font-size: 20px;
  line-height: 32px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;
const Intro = styled.span`
 font-weight: 700 !important;
  font-size: 20px;
  line-height: 32px;
  font-family: ${({ theme }) => theme.fonts.mainFont};


`;
const DescriptionVideo = styled.div`
  font-weight: 400 !important;
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;
const CardsContainer = styled.div`
  width: 100%;
  height: 70px;
  display:flex;
  justify-content:space-between ;

  margin-top:25px;
  margin-bottom:30px;
`;
const Card = styled.div`

background-color: white;
width:49.5%;
height:100%;
display:flex ;
justify-content:center ;
flex-direction:column ;
align-items:center ;
  h1{
  font-weight: 700 !important;
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.mainFont};

  }
  p{
    font-weight: 400 !important;
  font-size: 14px;
  line-height: 20px;
  margin:0px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  }
  
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  width:100%;

`;

const ContentLeft = styled.div`
  width: 70%;
  margin-right:35px;
`;

const ContentRight = styled.div`
  width: 100%;
  background: white;
  border-radius: 0px;
  margin: 0px;
  padding: 0px;
  overflow: scroll;
  height: 100%;
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

let currentTimeViewed = 0;

const Home = () => {
  const history = useHistory();
  const location = useLocation();

  const [token, setToken] = useQueryParam("token", StringParam);
  const [idCurso, setIdCurso] = useQueryParam("idCurso", StringParam);
  const playerRef = useRef(null);

  const [disabledButton, setDisabledButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectedVideo, setIsSelectedVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [videoSelected, setVideoSelected] = useState({ item: null, index: -1 });
  const [duration, setDuration] = useState();
  const [questionary, setQuestionary] = useState([]);
  const [seek, setSeek] = useState(0);

  const { fetch: fetchVideoByCourse, data: dataLessons } = useFetchLessons();
  const { fetch: fetchTracking } = useFetchTracking();
  const { fetch: fetchQuestions, data: dataQuestions } = useFetchQuestions();
  const { fetch: fetchCourse, data: dataInfoCourse } = useFetchCourse();

  useEffect(() => {
    currentTimeViewed = videoSelected?.item?.ultimoMinutoVisto || 0;
    setSeek(currentTimeViewed);
  }, [videoSelected]);

  useEffect(() => {
    if (location.state?.token) setToken(location.state?.token);
    if (location.state?.idCurso) setIdCurso(location.state?.idCurso);
    const token_ = token || location.state?.token;
    const idCurso_ = idCurso || location.state?.idCurso;
    fetchCourse(token_, idCurso_);
    fetchVideoByCourse(token_, idCurso_);
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
    if (dataLessons && dataLessons?.success) {
      const data = dataLessons?.data;
      updateStepsFlow(data);
    }
  }, [dataLessons]);

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
    setIsSelectedVideo(true);
    setVideoSelected(video);
    setPlaying(true);
  }

  const onFinished = () => {
    setIsLoading(true);
    setQuestionary([]);
    fetchVideoByCourse(token, videoSelected?.item?.idCurso);
  };

  const onClickQuestionary = () => {
    history.push({
      pathname: ROUTES.QUESTIONARY,
      state: {
        token,
        idCurso: idCurso,
        nombreCurso: videoSelected?.item?.nombreCurso,
      },
    });
  };

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
      if (isSelectedVideo) {
        if (item?.idVideo === videoSelected.item?.idVideo) {
          return ({
            ...item,
            completoVista: (
              Math.trunc(currentTimeViewed) === Math.trunc(item.ultimoMinutoVisto || 0) ||
              Math.trunc(currentTimeViewed) === Math.trunc(playerRef.current?.getDuration() || 0)
            ) ? "SI" : "NO",
            ultimoMinutoVisto: currentTimeViewed <= parseFloat(item.ultimoMinutoVisto || 0) ? item.ultimoMinutoVisto : currentTimeViewed,
          })
        }
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
      calculateSumVideosDuration(data);
      if (videoSelected.index !== -1) {
        setVideoSelected(find);
        setPlaying(true);
      }
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

  const calculateSumVideosDuration = data => {
    const sumDurations_ = sumDurations(data);
    setDuration(sumDurations_.formatted);
  }


  return (
    <>
      <Link
        onClick={() => {

          window.history.back();

        }}
      >
        <img src={ArrowDoubleLeft} />
        <span>{dataInfoCourse?.data?.length > 0 && `${dataInfoCourse?.data[0].nombreCurso}`}</span>
      </Link>
      <Content >

        <ContentLeft>
          <Title type="lg"  >
            {!isSelectedVideo
              ? dataInfoCourse?.data?.length &&
              `${dataInfoCourse?.data[0].nombreCurso}`
              : `Lección ${videoSelected?.index + 1 || 1}: ${videoSelected?.item?.nombreVideo || ""
              }`}
          </Title>
          <div style={{ margin: "16px 0px" }}>
            {questionary?.length === 0 ? (
              <>
                {isSelectedVideo ? (<Video
                  playerRef={playerRef}
                  width="100%"
                  height="100%"
                  playing={playing}
                  setPlaying={setPlaying}
                  src={`https://${videoSelected?.item?.rutaPublica}`}
                  seek={seek}
                  onProgress={handleOnProgress}
                  onEnded={handleOnEnded}
                  onEndedTimer={handleOnEndedTimer}
                  onClickCTA={onClickCTA}
                  onClickNextVideo={onClickNextVideo}
                  onClickPrevVideo={onClickPrevVideo}
                  isLoadingVideo={isLoading}
                  showButtonsFooter={true}
                  delayToFinalizeVideo={5}
                  templateInteractivity={videoSelected?.item?.templateInteractividad}
                  ctas={
                    videoSelected?.item?.ctas
                      ? JSON.parse(videoSelected?.item?.ctas)
                      : null
                  }
                  videoSelected={videoSelected}
                />) : null}
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


          {!isSelectedVideo && (
            <>
              <Title type="lg"  >{!dataLessons ? "" : dataLessons.data[0].nombreCurso}</Title>
              <Intro style={{ color: "black", fontWeight: 700, marginTop: "20px" }}>1.Introducción</Intro>
              <Paragraph>
                {lessons.length ? lessons[0].descripcionCurso : ""}
              </Paragraph>
            </>
          )}
          {isSelectedVideo && (
            <>
              <Paragraph style={{ fontSize: "18px", lineHeight: "28px" }}>
                {`Duración: ${videoSelected?.item?.duracion}/ Video`}
              </Paragraph>
              {videoSelected?.item?.descripcionVideo && (
                <DescriptionVideo dangerouslySetInnerHTML={{ __html: videoSelected?.item?.descripcionVideo }}>
                </DescriptionVideo>
              )}
            </>
          )}
          <Link
            style={{ color: "#333333", fontWeight: 700, marginTop: "20px" }}
            onClick={() => {
              window.history.back();
            }}
          >
            <img src={ArrowDoubleLeftDark} />
            <span>Ver todos los cursos</span>
          </Link>
        </ContentLeft>
        <div style={{ flexDirection: 'column', margin: '0px', display: 'flex', padding: "0px", width: '30%', height: '740px' }}>
          <CardsContainer>
            <Card>
              <h1>Duracion del curso </h1>
              <p>{duration}</p>
            </Card>
            <Card>
              <h1>Total de Lecciones </h1>
              <p>{lessons.length} lecciones</p>
            </Card>
          </CardsContainer>
          <ContentRight>
            <Steps
              lessons={lessons}
              disabledClose
              videoSelected={videoSelected}
              onCallbackVideoSelected={(item, index) => {
                setQuestionary([]);
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
            <Paragraph style={{ margin: '10px', fontSize: "14px" }}>
              Recuerda que debes terminar el curso en su totalidad para realizar
              el cuestionario y obtener tu certificado.
            </Paragraph>
            <Link
              style={{ margin: '10px', color: "#333333", fontWeight: 700, marginTop: "20px" }}
              onClick={() => {
                window.history.back();
              }}
            >
              <img src={ArrowDoubleLeftDark} />
              <span>Ver todos los cursos</span>
            </Link>
          </ContentRight>
        </div>
      </Content>
    </>
  );
};

export default Home;
