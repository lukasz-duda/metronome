import { useRef } from "react";

export interface MetronomeResult {
  start: (bpm: number) => void;
  stop: () => void;
}

export function useMetronome() {
  const intervalId = useRef<number | null>(null);

  function start(bpm: number) {
    const delay = (60 / bpm) * 1000;
    stop();
    intervalId.current = setInterval(play, delay);
  }

  function play() {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = 600;
    const gainNode = audio.createGain();
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.05);
  }

  function stop() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  }

  const result: MetronomeResult = {
    start,
    stop,
  };

  return result;
}
