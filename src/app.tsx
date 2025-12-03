import { AdvancedMetronome } from "./advanced-metronome";

export function App() {
  return (
    <AdvancedMetronome
      parts={[
        {
          id: "p1",
          name: "Part 1",
          bpm: 100,
          length: 4,
        },

        {
          id: "p2",
          name: "Part 2",
          bpm: 150,
          length: 8,
        },
      ]}
    />
  );
}
