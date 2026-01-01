import { useCallback, useEffect, useRef } from "react";
import type { Sound } from "./config";

export interface MetronomeProps {
  bpm: number;
  onBeat?: () => void;
  sound?: Sound;
}

export interface MetronomeResult {
  start: () => Promise<void>;
  stop: () => void;
}

export function useMetronome({
  bpm,
  onBeat,
  sound,
}: MetronomeProps): MetronomeResult {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const schedulerIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const bpmRef = useRef(bpm);
  const nextBeatTimeRef = useRef(0);

  const lookaheadMs = 25;
  const scheduleAheadSec = 0.1;

  const ensureContext = async () => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      audioCtxRef.current = ctx;
    }
    return audioCtxRef.current!;
  };

  const playClick = useCallback((time: number) => {
    const ctx = audioCtxRef.current!;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.2, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    osc.connect(gain).connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  }, []);

  const playFrequency = useCallback((time: number, frequency: number) => {
    const ctx = audioCtxRef.current!;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = frequency;

    osc.connect(gain).connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  }, []);

  const soundRef = useRef(sound);

  const playSound = useCallback(
    (time: number) => {
      switch (soundRef.current) {
        case "a4":
          playFrequency(time, 440);
          break;
        case "click":
        default:
          playClick(time);
          break;
      }
    },
    [playClick, playFrequency],
  );

  const audioTimeToDomTime = (ctx: AudioContext, audioTime: number) => {
    const nowAudio = ctx.currentTime;
    const nowDom = performance.now();
    return nowDom + (audioTime - nowAudio) * 1000;
  };

  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current!;

    while (nextBeatTimeRef.current < ctx.currentTime + scheduleAheadSec) {
      const audioTime = nextBeatTimeRef.current;
      const domTime = audioTimeToDomTime(ctx, audioTime);

      playSound(audioTime);
      if (nextBeatTimeRef.current !== startTimeRef.current)
        setTimeout(() => {
          onBeat?.();
        }, domTime - performance.now());

      nextBeatTimeRef.current += 60 / bpmRef.current;
    }
  }, [playSound, onBeat]);

  const start = useCallback(async () => {
    const ctx = await ensureContext();

    nextBeatTimeRef.current = ctx.currentTime;
    startTimeRef.current = ctx.currentTime;

    if (schedulerIdRef.current !== null) {
      clearInterval(schedulerIdRef.current);
    }

    schedulerIdRef.current = window.setInterval(scheduler, lookaheadMs);
  }, [scheduler]);

  const stop = useCallback(() => {
    if (schedulerIdRef.current !== null) {
      clearInterval(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  return { start, stop };
}
