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
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import RadioNormal from "@assets/images/radio-normal.svg";
import RadioSelected from "@assets/images/radio-selected.svg";
import LockedButton from "@assets/images/locked-button.svg";
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
  const [open, setOpen] = useState(false);

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
    let isValidResponse = true;
    const responses_ = questionary[index].alternativas.map((element, i) => {
      if (i === index_) {
        isValidResponse = element.esRespuestaCorrecta === "true";
        element["respuesta"] = true;
      } else {
        element["respuesta"] = false;
      }
      return element;
    });
    let copyResponses = [...questionary];
    copyResponses[index]["alternativas"] = responses_;
    setQuestionary(copyResponses);
    if (!isValidResponse) {
      setOpen(true);
    }
    const listBoolean = copyResponses.map((item) => {
      const newItem = item.alternativas.find(
        (item) =>
          item?.esRespuestaCorrecta === "true" && item?.respuesta === true
      );
      return !newItem ? false : true;
    });
    const validResponse = listBoolean.includes(false);
    setDisabledButton(validResponse);
  };

  const checkAnswers = () => {
    fetchResponseQuestionary(token, idCurso, questionary);
  };

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

      <div style={{ margin: "16px 0px" }}>
        <Title type="lg">TEST DE CONOCIMIENTO</Title>
      </div>
      {!showQuestions && (
        <>
          <Title type="lg">{nombreCurso}</Title>
          <Paragraph>
            Prueba tus conocimientos para obtener tu certificado mediante este
            cuestionario. ¡Mucha suerte!
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
                console.log(location);
              }}
              label="Comenzar"
              iconRight={ArrowDoubleRight}
            />
          </div>
        </>
      )}
      {showQuestions &&
        questionary.map((item, index) => (
          <CardQuestion key={`q${index}`}>
            <Title type="md">{`${index + 1 < 9 ? `0${index + 1}` : `${index + 1}`
              }.- ${item?.pregunta}`}</Title>
            {item.alternativas &&
              item.alternativas.map(
                (item_, index_) =>
                  item_?.alternativa && (
                    <Alternative key={`a${index_}`}>
                      {item_?.respuesta ? (
                        <img
                          src={RadioSelected}
                          onClick={() => onSelectedAlternative(index, index_)}
                        />
                      ) : (
                        <img
                          src={RadioNormal}
                          onClick={() => onSelectedAlternative(index, index_)}
                        />
                      )}
                      <Paragraph style={{ marginLeft: "4px" }}>
                        {item_?.alternativa}
                      </Paragraph>
                    </Alternative>
                  )
              )}
          </CardQuestion>
        ))}
      {showQuestions && (
        <div
          style={{
            marginTop: "44px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={checkAnswers}
            label="OBTENER CERTIFICADO"
            iconLeft={LockedButton}
            disabled={disabledButton}
          />
        </div>
      )}
    </>
  );
};

export default Questionary;
