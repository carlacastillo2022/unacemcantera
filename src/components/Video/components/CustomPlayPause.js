import React, { Component } from 'react';
import styled from 'styled-components';
import { Media, withMediaProps } from 'react-media-player';
import Play from '@assets/images/play.svg';
import MiniPlay from '@assets/images/mini-play.svg';
import MiniPause from '@assets/images/mini-pause.svg';

const Container = styled.div`
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const StyledPlay = styled(Play)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
  bottom: 0;
`;

const StyledControls = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 30px;
  display: flex;
  padding: 3px 10px;
`;

const StyledMiniPlay = styled(MiniPlay)`
  width: 12px;
  height: 12px;
`;

const StyledMiniPause = styled(MiniPause)`
  width: 12px;
  height: 12px;
`;

class CustomPlayPause extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCirclePlay: true,
    };
  }

  componentDidMount() {
    this.props.media.seekTo(2);
  }

  shouldComponentUpdate({ media }) {
    return this.props.media.isPlaying !== media.isPlaying;
  }

  _handlePlayPause = (lockPlayPause) => {
    const { showCirclePlay } = this.state;
    const { media } = this.props;
    if (lockPlayPause) {
      if (showCirclePlay) {
        media.seekTo(media.currentTime);
        media.playPause();
        this.setState({ showCirclePlay: false });
      }
    } else {
      media.seekTo(media.currentTime);
      media.playPause();
    }
  };

  render() {
    const { media, style } = this.props;
    const { showCirclePlay } = this.state;
    return (
      <>
        <Container style={style} onClick={() => this._handlePlayPause(true)}>
          {media.isPlaying ? null : showCirclePlay ? <StyledPlay /> : null}
        </Container>
        <StyledControls>
          {!showCirclePlay && (
            <div onClick={() => this._handlePlayPause(false)}>
              {media.isPlaying ? <StyledMiniPause /> : <StyledMiniPlay />}
            </div>
          )}
        </StyledControls>
      </>
    );
  }
}

export default withMediaProps(CustomPlayPause);
