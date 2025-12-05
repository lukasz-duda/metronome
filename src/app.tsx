import { useState, type SyntheticEvent } from "react";
import { AdvancedMetronome, type Part } from "./advanced-metronome";
import { Flex } from "antd";
import TextArea from "antd/es/input/TextArea";

const initialParts = [
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
];

export function App() {
  const [parts, setParts] = useState<Part[]>(() => {
    const jsonParts = localStorage.getItem("parts");
    if (jsonParts) {
      const parsed = JSON.parse(jsonParts);
      return parsed as Part[];
    } else {
      return initialParts;
    }
  });

  function changeParts(event: SyntheticEvent<HTMLTextAreaElement>) {
    const jsonParts = event.currentTarget.value;
    const parsed = JSON.parse(jsonParts);
    setParts(parsed);
    localStorage.setItem("parts", jsonParts);
  }

  return (
    <Flex
      vertical
      gap={12}
    >
      <TextArea
        value={JSON.stringify(parts)}
        onChange={changeParts}
      />
      <AdvancedMetronome parts={parts} />
    </Flex>
  );
}
