import { useCallback, useEffect, useRef } from "react";

export interface MetronomeProps {
  bpm?: number;
  onBeat: () => void;
}

export interface MetronomeResult {
  start: () => void;
  stop: () => void;
}

export function useMetronome({ bpm = 100, onBeat }: MetronomeProps) {
  const intervalId = useRef<number | null>(null);

  const stop = useCallback(function () {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  const start = useCallback(
    function () {
      const delay = (60 / bpm) * 1000;
      stop();
      intervalId.current = setInterval(onBeat, delay);
    },
    [bpm, onBeat, stop],
  );

  useEffect(() => {
    if (intervalId.current) {
      stop();
      start();
    }
  }, [start, stop]);

  const result: MetronomeResult = {
    start,
    stop,
  };

  return result;
}
