import { useState, type SyntheticEvent } from "react";
import { play } from "./audio";
import { useMetronome } from "./metronome";

export function SimpleMetronome() {
  const [bpm, setBpm] = useState(100);

  function changeBpm(event: SyntheticEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    const newBpm = Number(value);
    setBpm(newBpm);
  }

  const { start, stop } = useMetronome({ onBeat: play });

  return (
    <>
      <input
        type="number"
        value={bpm}
        onChange={changeBpm}
      />
      <button onClick={() => start(bpm)}>play</button>
      <button onClick={stop}>stop</button>
    </>
  );
}
