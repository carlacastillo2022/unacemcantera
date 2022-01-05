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
      <ContentMobileView>
        <HomeMobile />
      </ContentMobileView>
    );
  return (
    <ContentDesktopView>
      <HomeDesktop />
    </ContentDesktopView>
  );
};

export const Questionary = () => {
  if (isMobile)
    return (
      <ContentMobileView>
        <QuestionaryMobile />
      </ContentMobileView>
    );
  return (
    <ContentDesktopView>
      <QuestionaryDesktop />
    </ContentDesktopView>
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
      <ContentMobileView>
        <CertificateMobile />
      </ContentMobileView>
    );
  return (
    <ContentDesktopView>
      <CertificateDesktop />
    </ContentDesktopView>
  );
};
