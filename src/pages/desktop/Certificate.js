import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useFetchEmail, useFetchDownloadCertificate } from "@hooks/useCourses";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import BackgroundQuestionary from "@assets/images/background-questionary.png";
import { useHistory, useLocation } from "react-router-dom";
import { validateEmail } from "@commons/utils";

const Paragraph = styled.p`
  font-weight: 400 !important;
  font-size: 14px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;

const StyledInput = styled.input`
  background: #fafafa;
  border: 1px solid #eeeeee;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 16px;
  margin: 8px 0px;
  width: 60%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentLeft = styled.div`
  width: 60%;
  margin-right: 25px;
`;

const ContentRight = styled.div`
  width: 40%;
  margin-left: 25px;
`;

const Certificate = () => {
  const locationRoute = useLocation();
  const history = useHistory();

  const token = locationRoute?.state?.token;
  const idCurso = locationRoute?.state?.idCurso;
  const [valueInput, setValueInput] = useState("");
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const { fetch: fetchSendEmail, data: dataEmail } = useFetchEmail();
  const { fetch: fetchDownloadCertificate, data: dataDownloadCertificate } =
    useFetchDownloadCertificate();

  useEffect(() => {
    if (dataEmail) {
      if (dataEmail?.success) {
        alert(dataEmail?.data);
      }
    }
  }, [dataEmail]);

  useEffect(() => {
    if (dataDownloadCertificate) {
      const url = window.URL.createObjectURL(
        new Blob([dataDownloadCertificate])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificado.pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();
    }
  }, [dataDownloadCertificate]);

  useEffect(() => {
    setIsDisabledButton(!validateEmail(valueInput));
  }, [valueInput]);

  const sendEmail = () => {
    if (valueInput) {
      fetchSendEmail(token, idCurso, valueInput);
    } else {
      toast.error("Es necesario ingresar el correo electrónico.");
    }
  };

  const downloadCertificate = () => {
    fetchDownloadCertificate(token, idCurso);
  };

  return (
    <>
      <Link
        onClick={() => {
          history.replace({
            pathname: "/",
            state: {
              token,
              idCurso
            },
          });
        }}
      >
        <img src={ArrowDoubleLeft} /> <span>Volver</span>
      </Link>
      <Content>
        <ContentLeft>
          <div style={{ margin: "16px 0px" }}>
            <Title type="lg">¡Felicidades!</Title>
          </div>
          <Paragraph>
            Lograste aprobar el test de concimientos sobre este curso. Ya puedes
            obtener tu certificado.
          </Paragraph>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={downloadCertificate}
              label="Descargar certificado"
              size="medium"
              iconRight={ArrowDoubleRight}
            />
          </div>
          <div style={{ margin: "16px 0px" }}>
            <Title type="md">Obtener un certificado personalizado</Title>
          </div>
          <Paragraph>
            Si deseas que tus datos aparezcan en tu certificado, por favor
            ingresa tu correo electrónico asociado:
          </Paragraph>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <StyledInput
              value={valueInput}
              onChange={(event) => {
                setValueInput(event.target.value);
              }}
              placeholder="ingresa tu correo electrónico"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Button
              onClick={sendEmail}
              label="Enviar"
              size="medium"
              iconRight={ArrowDoubleRight}
              disabled={isDisabledButton}
            />
          </div>
        </ContentLeft>
        <ContentRight>
          <img
            style={{ maxWidth: "300px", borderRadius: "8px" }}
            src={BackgroundQuestionary}
          />
        </ContentRight>
      </Content>
    </>
  );
};

export default Certificate;
