import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import HomeMobile from "@pages/mobile/Home";
import LessonsMobile from "@pages/mobile/Lessons";
import QuestionaryMobile from "@pages/mobile/Questionary";
import CertificateMobile from "@pages/mobile/Certificate";

import HomeDesktop from "@pages/desktop/Home";
import QuestionaryDesktop from "@pages/desktop/Questionary";
import CertificateDesktop from "@pages/desktop/Certificate";
import Footer from "@components/Footer";

const Container = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  position: relative;
  background-color: #EBEBEB;
  width:100% ;
  padding-top:30px;
`;

const ContentDesktopView = styled.div`
  background: #EBEBEB;
  margin: 0px ;
 
  margin-bottom: 0px;
  width:96% ;

`;

const ContentMobileView = styled.div`
  padding: 28px 16px 70px;
  height: auto;
  margin-bottom: 0px;
  width:96% ;
  background: #EBEBEB;
`;

export const Home = () => {
  if (isMobile)
    return (
      <Container>
        <ContentMobileView>
          <HomeMobile />
        </ContentMobileView>
      </Container>
    );
  return (
    <Container>
      <ContentDesktopView>
        <HomeDesktop />
      </ContentDesktopView>
    </Container>
  );
};

export const Questionary = () => {
  if (isMobile)
    return (
      <Container>
        <ContentMobileView>
          <QuestionaryMobile />
        </ContentMobileView>
      </Container>
    );
  return (
    <Container>
      <ContentDesktopView>
        <QuestionaryDesktop />
      </ContentDesktopView>
    </Container>
  );
};

export const Lessons = () => {
  return (
    <ContentMobileView>
      <LessonsMobile />
    </ContentMobileView>
  );
};

export const Certificate = () => {
  if (isMobile)
    return (
      <Container>
        <ContentMobileView>
          <CertificateMobile />
        </ContentMobileView>
      </Container>
    );
  return (
    <Container>
      <ContentDesktopView>
        <CertificateDesktop />
      </ContentDesktopView>
    </Container>
  );
};
