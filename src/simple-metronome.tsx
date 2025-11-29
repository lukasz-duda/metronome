import { play } from "./audio";
import { useMetronome } from "./metronome";

export function SimpleMetronome() {
  const { start, stop } = useMetronome({ onBeat: play });

  return (
    <>
      <button onClick={() => start(100)}>play</button>
      <button onClick={stop}>stop</button>
    </>
  );
}
