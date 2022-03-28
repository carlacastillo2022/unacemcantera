import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  useFetchQuestionsCourse,
  useFetchResponseQuestionary,
} from "@hooks/useCourses";
import { useHistory, useLocation } from "react-router-dom";
import ROUTES from "@routes/constants";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import Animation from "@components/Animation";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import RadioNormal from "@assets/images/radio-normal.svg";
import RadioSelected from "@assets/images/radio-selected.svg";
import LockedButton from "@assets/images/locked-button.svg";
import BackgroundQuestionary from "@assets/images/background-questionary.png";
import Dialog from "@components/Dialog";

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
  flex-direction: row;
`;

const ContentLeft = styled.div`
  width: 60%;
  margin-right: 25px;
  max-height: 700px;
  overflow: scroll;
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

const ContentRight = styled.div`
  display: flex;
  justify-content: center;
  width: 40%;
  margin-left: 25px;
`;

const DialogContainer = styled.div`
  display: flex; 
  align-items: center; 
  flex-direction: column;
`;

const Questionary = () => {
  const location = useLocation();
  const history = useHistory();

  const token = location?.state?.token;
  const idCurso = location?.state?.idCurso;
  const nombreCurso = location?.state?.nombreCurso;

  const { fetch: fetchQuestionsCourse, data: dataQuestionsCourse } =
    useFetchQuestionsCourse();
  const { fetch: fetchResponseQuestionary, data: dataResponseQuestionary } =
    useFetchResponseQuestionary();
  const [questionary, setQuestionary] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const [currentNumberQuestion, setCurrentNumberQuestion] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchQuestionsCourse(token, idCurso);
  }, []);

  useEffect(() => {
    if (dataQuestionsCourse?.success) {
      if (dataQuestionsCourse?.data?.length > 0) {
        setQuestionary(dataQuestionsCourse?.data);
      }
    }
  }, [dataQuestionsCourse]);

  useEffect(() => {
    if (dataResponseQuestionary) {
      if (dataResponseQuestionary?.success) {
        history.push({
          pathname: ROUTES.CERTIFICATE,
          state: {
            token,
            idCurso,
          },
        });
      } else {
        setOpen(true);
      }
    }
  }, [dataResponseQuestionary]);

  const onSelectedAlternative = (index, index_) => {
    const responses_ = questionary[index].alternativas.map((element, i) => {
      if (i === index_) {
        element["respuesta"] = true;
      } else {
        element["respuesta"] = false;
      }
      return element;
    });
    let copyResponses = [...questionary];
    copyResponses[index]["alternativas"] = responses_;
    setQuestionary(copyResponses);
  };

  const checkAnswers = () => {
    fetchResponseQuestionary(token, idCurso, questionary);
  };

  const onNextQuestion = () => {
    if (currentQuestion === null || currentQuestion?.item?.esRespuestaCorrecta === 'false') {
      setDisabledButton(true);
      setOpen(true);
    } else {
      if (currentNumberQuestion === questionary.length - 1) {
        setDisabledButton(false);
      } else {
        setCurrentNumberQuestion(currentNumberQuestion + 1);
        setCurrentQuestion(null);
      }
    }
  }

  return (
    <>
      <Dialog modalIsOpen={open} onClose={() => setOpen(false)} title="Test de conocimiento" labelButton="intentar otra vez">
        <DialogContainer>
          <Title style={{ textAlign: 'center', margin: '20px 0px 10px' }} type="lg">Respuesta incorrecta</Title>
          <Paragraph style={{ margin: '10px 0px 20px', textAlign: 'center' }}>No te preocupes. Puedes intertarlo una vez más.</Paragraph>
        </DialogContainer>
      </Dialog>
      <Link
        onClick={() => {
          history.goBack();
        }}
      >
        <img src={ArrowDoubleLeft} />
        <span>Volver</span>
      </Link>
      <Content>
        <ContentLeft>
          <div style={{ margin: "16px 0px" }}>
            <Title type="lg">TEST DE CONOCIMIENTO</Title>
          </div>
          {!showQuestions && (
            <>
              <Title type="md">{nombreCurso}</Title>
              <Paragraph>
                Prueba tus conocimientos para obtener tu certificado mediante
                este cuestionario. ¡Mucha suerte!
              </Paragraph>
              <div
                style={{
                  marginTop: "100px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={() => {
                    setShowQuestions(true);
                  }}
                  size="medium"
                  label="Comenzar"
                  iconRight={ArrowDoubleRight}
                />
              </div>
            </>
          )}
          {showQuestions &&
            questionary.map((item, index) =>
              index === currentNumberQuestion ? (
                <Animation typeAnimation="fade">
                  <CardQuestion>
                    <Title type="md">{`${currentNumberQuestion + 1 < 9
                      ? `0${currentNumberQuestion + 1}`
                      : `${currentNumberQuestion + 1}`
                      }.- ${item?.pregunta}`}</Title>
                    {item.alternativas &&
                      item.alternativas.map(
                        (item_, index_) =>
                          item_?.alternativa && (
                            <Alternative>
                              {index_ === currentQuestion?.index ? (
                                <img
                                  src={RadioSelected}
                                  onClick={() => {
                                    onSelectedAlternative(index, index_)
                                    setCurrentQuestion({
                                      item: item_,
                                      index: index_
                                    });
                                  }}
                                />
                              ) : (
                                <img
                                  src={RadioNormal}
                                  onClick={() => {
                                    onSelectedAlternative(index, index_)
                                    setCurrentQuestion({
                                      item: item_,
                                      index: index_
                                    });
                                  }}
                                />
                              )}
                              <Paragraph style={{ marginLeft: "4px" }}>
                                {item_?.alternativa}
                              </Paragraph>
                            </Alternative>
                          )
                      )}
                  </CardQuestion>
                </Animation>
              ) : null
            )}
          {showQuestions && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button 
                size="small" 
                disabled={currentQuestion === null}
                iconRight={ArrowDoubleRight} 
                onClick={onNextQuestion}
                label="Siguiente pregunta"
              />
              <Title type="md">{`Pregunta: ${currentNumberQuestion + 1}/${questionary.length
                }`}</Title>
            </div>
          )}
          {showQuestions && (
            <div
              style={{
                marginTop: "44px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => {
                  if (!disabledButton) checkAnswers();
                }}
                disabled={disabledButton}
                size="medium"
                label="OBTENER CERTIFICADO"
                iconLeft={LockedButton}
              />
            </div>
          )}
        </ContentLeft>
        <ContentRight>
          <img
            style={{
              maxWidth: "300px",
              maxHeight: "600px",
              borderRadius: "8px",
            }}
            src={BackgroundQuestionary}
          />
        </ContentRight>
      </Content>
    </>
  );
};

export default Questionary;
