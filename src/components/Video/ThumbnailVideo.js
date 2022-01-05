import React from 'react';
import styled from 'styled-components';
import Play from '@assets/images/play.svg';

const Container = styled.div`
  height: 200px;
  width: 100%;
  position: relative;
  background: black;
`;

const Content = styled.div`
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: black;
`;

const StyledPlay = styled.img`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
  bottom: 0;
`;

const ThumbnailVideo = ({ onClick }) => {
  return (
    <Container onClick={onClick}>
      <Content>
        <StyledPlay src={Play} />
      </Content>
    </Container>
  );
};

export default ThumbnailVideo;
