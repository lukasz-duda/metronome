import { useRef } from "react";

export interface MetronomeProps {
  onBeat: () => void;
}

export interface MetronomeResult {
  start: (bpm: number) => void;
  stop: () => void;
}

export function useMetronome({ onBeat }: MetronomeProps) {
  const intervalId = useRef<number | null>(null);

  function start(bpm: number) {
    const delay = (60 / bpm) * 1000;
    stop();
    intervalId.current = setInterval(onBeat, delay);
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
