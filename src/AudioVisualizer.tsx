import React, {
  ChangeEvent,
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

const WIDTH = 300;
const HEIGHT = 150;

export function AudioVisualizer({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!stream) {
      return;
    }

    const audioCtx = new window.AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.connect(audioCtx.destination);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const timeDomainDataArray = new Uint8Array(bufferLength);
    const frequencyDataArray = new Uint8Array(bufferLength);

    if (!canvasRef.current) {
      return;
    }

    const canvasContext = canvasRef.current.getContext('2d');

    if (!canvasContext) {
      return;
    }

    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = () => {
      const drawVisual = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(timeDomainDataArray);
      analyser.getByteFrequencyData(frequencyDataArray);

      canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

      const arraySum = frequencyDataArray.reduce((a, value) => {
        return a + value;
      }, 0);
      const average = arraySum / frequencyDataArray.length;

      canvasContext.fillStyle = 'lightgreen';
      canvasContext.fillRect(
        0,
        HEIGHT - Math.round((average / 100) * HEIGHT),
        WIDTH,
        Math.round((average / 100) * HEIGHT),
      );

      // canvasContext.fillStyle = 'rgb(200, 200, 200)';
      // canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = 'rgb(0, 40, 50)';
      canvasContext.beginPath();

      let sliceWidth = WIDTH / bufferLength;
      canvasContext.moveTo(0, HEIGHT / 2);

      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        let v = timeDomainDataArray[i] / 128.0;
        let y = (v * HEIGHT) / 2;
        canvasContext.lineTo(x, y);
        x += sliceWidth;
      }

      canvasContext.lineTo(WIDTH, HEIGHT / 2);
      canvasContext.stroke();
    };

    draw();
  }, [stream]);

  return (
    <div>
      <canvas
        className="video-visualize-canvas"
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      />
    </div>
  );
}
