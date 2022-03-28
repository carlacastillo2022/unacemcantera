import React, { useEffect, useRef, useState } from "react";
import { sumDurations } from "@commons/utils";
import { useFetchLessons, useFetchCourse } from "@hooks/useCourses";
import { StringParam, useQueryParam } from "use-query-params";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import ROUTES from "@routes/constants";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import CardInfo from "@components/CardInfo";
import { Video } from "@components/Video";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleLeftDark from "@assets/images/arrow-double-left-dark.svg";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import Time from "@assets/images/time.svg";
import Lessons from "@assets/images/lessons.svg";

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

const Home = () => {
  const history = useHistory();
  const [token, setToken] = useQueryParam("token", StringParam);
  const [idCurso, setIdCurso] = useQueryParam("idCurso", StringParam);
  const playerRef = useRef(null);

  const [lessons, setLessons] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [videoSelected, setVideoSelected] = useState({ item: null, index: -1 });
  const [duration, setDuration] = useState();
  const { fetch: fetchVideoByCourse, data: dataLessons } = useFetchLessons();
  const { fetch: fetchCourse, data: dataInfoCourse } = useFetchCourse();

  useEffect(() => {
    fetchCourse(token, idCurso);
    fetchVideoByCourse(token, idCurso);
  }, []);

  useEffect(() => {
    if (dataLessons?.success) {
      const data = dataLessons?.data;
      let find = null;
      if (data.length > 0) {
        if (videoSelected?.item) {
          find = {
            index: videoSelected?.index + 1,
            item: data[videoSelected?.index + 1],
          };
        } else {
          find = {
            index: 0,
            item: data[0],
          };
        }
      }
      setLessons(data);
      const sumDurations_ = sumDurations(dataLessons?.data);
      setDuration(sumDurations_.formatted);
      setVideoSelected(find);
    }
  }, [dataLessons]);

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
      <>
        <div style={{ margin: "16px 0px" }}>
          {/* dataInfoCourse?.data?.length ? (
            <Video
              playerRef={playerRef}
              width="100%"
              height="30%"
              src={`https://${dataInfoCourse?.data[0].thumbnailRutaPublica}`}
              title={dataInfoCourse?.data[0].nombreCurso || ""}
              playing={playing}
              setPlaying={setPlaying}
            />
          ) : null */}
        </div>
        {dataInfoCourse?.data?.length && (
          <Title type="lg">{dataInfoCourse?.data[0].nombreCurso || ""}</Title>
        )}
        <>
          <div style={{ marginTop: "18px" }}>
            <Button
              onClick={() => {
                history.push({
                  pathname: ROUTES.LESSONS,
                  state: {
                    token,
                    idCurso,
                    nombreCurso: videoSelected?.item?.nombreCurso,
                  },
                });
              }}
              label="Comenzar"
              iconRight={ArrowDoubleRight}
            />
          </div>
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
            {dataInfoCourse?.data?.length
              ? dataInfoCourse?.data[0].descripcionCurso
              : ""}
          </Paragraph>
        </>
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
      </>
    </>
  );
};

export default Home;
