import React from 'react';
import outfoxing from './outfoxing.mp3';

export function DefaultAudio() {
  return <audio src={outfoxing} controls />;
}
