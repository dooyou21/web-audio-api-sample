import React, { useEffect, useRef, useState } from 'react';
import { AudioVisualizer } from './AudioVisualizer';
import outfoxing from './outfoxing.mp3';

export function DefaultAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [stream, setStream] = useState(null);

  const handlePlay = () => {
    // @ts-ignore
    setStream(audioRef.current.captureStream());
  };

  return (
    <>
      <audio src={outfoxing} controls ref={audioRef} onPlay={handlePlay} />
      <AudioVisualizer stream={stream} />
    </>
  );
}
