import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import RadioNormal from "@assets/images/radio-normal.svg";
import RadioSelected from "@assets/images/radio-selected.svg";
import LockedButton from "@assets/images/locked-button.svg";
import { useHistory, useLocation } from "react-router-dom";
import { useFetchResponse, useFetchLessons } from "@hooks/useCourses";

const Paragraph = styled.p`
  font-weight: 400 !important;
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;

const CardQuestion = styled.div`
  background: #fafafa;
  border-radius: 4px;
  padding: 16px;
  margin: 8px 0px;
`;

const Alternative = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuickQuestionary = ({
  questionary,
  videoSelected,
  token,
  onFinished,
}) => {
  const history = useHistory();
  const [responses, setResponses] = useState(questionary);
  const { fetch: fetchResponse, data: dataResponse } = useFetchResponse();

  useEffect(() => {
    if (dataResponse?.success) {
      onFinished();
    }
  }, [dataResponse]);

  const onSelectedAlternative = (index, index_) => {
    const responses_ = responses[index].alternativas.map((element, i) => {
      if (i === index_) element["respuesta"] = true;
      else element["respuesta"] = false;
      return element;
    });

    let copyResponses = [...responses];
    copyResponses[index]["alternativas"] = responses_;
    setResponses(copyResponses);
  };

  const onClickSendResponse = () => {
    const listBoolean = responses.map((item) => {
      const newItem = item.alternativas.find(
        (item) => item?.respuesta != undefined
      );
      return !newItem ? false : true;
    });
    const validResponse = listBoolean.includes(false);
    if (!validResponse) {
      fetchResponse(
        token,
        videoSelected?.item?.idCurso,
        videoSelected?.item?.idVideo,
        responses
      );
    } else {
      alert("Es necesario seleccionar una de las alternativas");
    }
  };

  return (
    <div>
      <Content>
        <div style={{ margin: "16px 0px" }}>
          <Title type="lg" style={{ color: "#E52820" }}>
            {" "}
            {`Lección ${
              (videoSelected?.index + 1) || 1
            }: Repasando lo aprendido.`}
          </Title>
        </div>
        <CardQuestion>
          {responses.length > 0 &&
            responses.map((item, index) => (
              <div key={`r${index}`}>
                <Title type="md">{`${
                  index + 1 < 9 ? `0${index + 1}` : `${index + 1}`
                }.- ${item?.pregunta}`}</Title>
                {item.alternativas &&
                  item.alternativas.map((item_, index_) => (
                    <Alternative
                      key={`a${index_}`}
                      onClick={() => onSelectedAlternative(index, index_)}
                    >
                      {item_?.respuesta ? (
                        <img src={RadioSelected} />
                      ) : (
                        <img src={RadioNormal} />
                      )}
                      <Paragraph style={{ marginLeft: "4px" }}>
                        {item_?.alternativa}
                      </Paragraph>
                    </Alternative>
                  ))}
              </div>
            ))}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              margin: "24px 0px",
            }}
          >
            <Button
              onClick={onClickSendResponse}
              size="medium"
              label="Enviar respuesta"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Link onClick={onFinished}>
              <span>Continuar siguiente lección</span>
              <img src={ArrowDoubleRight} />
            </Link>
          </div>
        </CardQuestion>
      </Content>
    </div>
  );
};

export default QuickQuestionary;
