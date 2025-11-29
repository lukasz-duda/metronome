import { useMetronome } from "./metronome";

export function SimpleMetronome() {
  const { start, stop } = useMetronome();

  return (
    <>
      <button onClick={() => start(100)}>play</button>
      <button onClick={stop}>stop</button>
    </>
  );
}
