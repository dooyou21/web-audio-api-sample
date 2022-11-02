import React, {
  ChangeEvent,
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

type VisualizeViewMode = 'bar' | 'line';

const WIDTH = 300;
const HEIGHT = 150;

export function AudioVisualizer({ stream }: { stream: MediaStream | null }) {
  const [viewMode, setViewMode] = useState<VisualizeViewMode>('line');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleChangeOption = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'bar' || e.target.value === 'line') {
      setViewMode(e.target.value);
    }
  };

  useEffect(() => {
    if (!stream) {
      return;
    }

    const audioCtx = new window.AudioContext();
    var analyser = audioCtx.createAnalyser();

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

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
      analyser.getByteTimeDomainData(dataArray);

      canvasContext.fillStyle = 'rgb(200, 200, 200)';
      canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = 'rgb(0, 40, 50)';
      canvasContext.beginPath();

      let sliceWidth = WIDTH / bufferLength;
      canvasContext.moveTo(0, HEIGHT / 2);

      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
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
      <div>
        <label>
          view mode:{' '}
          <select onChange={handleChangeOption} value={viewMode}>
            <option value="line">line</option>
            <option value="bar">bar</option>
          </select>
        </label>
      </div>
      <div>
        {viewMode === 'line' && (
          <canvas
            className="video-visualize-canvas"
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
          />
        )}
      </div>
    </div>
  );
}
