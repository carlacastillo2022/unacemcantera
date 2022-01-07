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
`;

const ContentDesktopView = styled.div`
  padding: 28px 16px 70px;
  background: #ffffff;
  height: 120%;
  margin: 0 5%;
  border-radius: 8px;
  max-width: 1169px;
`;

const ContentMobileView = styled.div`
  padding: 28px 16px 70px;
  background: #ffffff;
  height: 100%;
`;

export const Home = () => {
  if (isMobile)
    return (
      <Container>
        <ContentMobileView>
          <HomeMobile />
        </ContentMobileView>
        <Footer />
      </Container>
    );
  return (
    <Container>
      <ContentDesktopView>
        <HomeDesktop />
      </ContentDesktopView>
      <Footer />
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
        <Footer />
      </Container>
    );
  return (
    <Container>
      <ContentDesktopView>
        <QuestionaryDesktop />
      </ContentDesktopView>
      <Footer />
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
        <Footer />
      </Container>
    );
  return (
    <Container>
      <ContentDesktopView>
        <CertificateDesktop />
      </ContentDesktopView>
      <Footer />
    </Container>
  );
};
