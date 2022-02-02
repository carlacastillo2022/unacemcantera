import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import RadioNormal from "@assets/images/radio-normal.svg";
import RadioSelected from "@assets/images/radio-selected.svg";
import RadioSelectedSuccess from "@assets/images/radio-selected-success.svg";
import RadioSelectedDanger from "@assets/images/radio-selected-danger.svg";
import { useFetchResponse } from "@hooks/useCourses";

const Paragraph = styled.p`
  font-weight: 400 !important;
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  color: ${({ color }) => color};
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
  const [responses, setResponses] = useState(questionary);
  const { fetch: fetchResponse, data: dataResponse } = useFetchResponse();
  const [disabledButton, setDisabledButton] = useState(true);
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);
  const [indexAlternativeSelected, setIndexAlternativeSelected] = useState(-1);

  useEffect(() => {
    if (dataResponse?.success) {
      setShowSuccessResponse(true);
    }
  }, [dataResponse]);

  const onSelectedAlternative = (index, index_) => {
    setIndexAlternativeSelected(index_);
    const responses_ = responses[index].alternativas.map((element, i) => {
      if (i === index_) {
        element["respuesta"] = true;
      } else {
        element["respuesta"] = false;
      }
      return element;
    });

    let copyResponses = [...responses];
    copyResponses[index]["alternativas"] = responses_;
    setResponses(copyResponses);
    const listBoolean = responses.map((item) => {
      const newItem = item.alternativas.find(
        (item) => item?.respuesta != undefined
      );
      return !newItem ? false : true;
    });
    const validResponse = listBoolean.includes(false);
    setDisabledButton(validResponse);
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

  if (showSuccessResponse) {
    return (
      <Content>
        <div
          style={{
            margin: "16px 0px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Title type="md" style={{ color: "#E52820" }}>
            {" "}
            {`Lección ${
              videoSelected?.index + 1 || 1
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
                  item.alternativas.map((item_, index_) =>
                    item_?.alternativa &&
                    index_ === indexAlternativeSelected ? (
                      <Alternative
                        key={`a${index_}`}
                        onClick={() => onSelectedAlternative(index, index_)}
                      >
                        <img
                          src={
                            item_?.esRespuestaCorrecta === "true" &&
                            item_?.respuesta === true
                              ? RadioSelectedSuccess
                              : RadioSelectedDanger
                          }
                        />
                        <Paragraph
                          style={{ marginLeft: "4px" }}
                          color={
                            item_?.esRespuestaCorrecta === "true" &&
                            item_?.respuesta === true
                              ? "#28a745"
                              : "#dc3545"
                          }
                        >
                          {item_?.alternativa}
                          <b>
                            {item_?.esRespuestaCorrecta === "true" &&
                            item_?.respuesta === true
                              ? " (Respuesta correcta)"
                              : " (Respuesta incorrecta)"}
                          </b>
                        </Paragraph>
                      </Alternative>
                    ) : null
                  )}
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
            <Button onClick={onFinished} size="medium" label="Continuar" />
          </div>
        </CardQuestion>
      </Content>
    );
  }
  return (
    <Content>
      <div
        style={{
          margin: "16px 0px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Title type="md" style={{ color: "#E52820" }}>
          {" "}
          {`Lección ${videoSelected?.index + 1 || 1}: Repasando lo aprendido.`}
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
                item.alternativas.map(
                  (item_, index_) =>
                    item_?.alternativa && (
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
                    )
                )}
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
            onClick={() => {
              if (!disabledButton) onClickSendResponse();
            }}
            disabled={disabledButton}
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
          <Link
            onClick={() => {
              if (!disabledButton) onFinished();
            }}
            isDisabled={disabledButton}
          >
            <span>Continuar siguiente lección</span>
            <img src={ArrowDoubleRight} />
          </Link>
        </div>
      </CardQuestion>
    </Content>
  );
};

export default QuickQuestionary;
