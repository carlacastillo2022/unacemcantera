import React, { useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';

let player = null;

const Video = ({
  width,
  controls,
  light,
  seek,
  playIcon,
  height,
  src,
  onReady,
  onProgress,
  onPlay,
  onPause,
  onEnded,
  innerRef,
}) => {
  const [firstLoad, setFirstLoad] = React.useState(false);

  useEffect(() => {
    player && player.seekTo(seek ? seek : 0);
  }, [seek]);

  const handleOnReady = (player_) => {
    if (!firstLoad) {
      player = player_;
      player.seekTo(seek ? seek : 0);
      setFirstLoad(true);
    }
    onReady && onReady(player);
  };
  return (
    <ReactPlayer
      ref={innerRef}
      width={width}
      controls={controls}
      height={height}
      url={src}
      light={light}
      playIcon={playIcon}
      onReady={handleOnReady}
      onProgress={onProgress}
      onPlay={onPlay}
      onEnded={onEnded}
      onPause={onPause}
    />
  );
};

export default Video;