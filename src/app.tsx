import { useState, type SyntheticEvent } from "react";
import {
  AdvancedMetronome,
  type AdvancedMetronomeConfig,
} from "./advanced-metronome";
import { Button, Flex, Space } from "antd";
import TextArea from "antd/es/input/TextArea";

const initialConfig: AdvancedMetronomeConfig = {
  parts: [
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
  ],
};

export function App() {
  const [config, setConfig] = useState<AdvancedMetronomeConfig>(() => {
    const jsonConfig = localStorage.getItem("config");
    if (jsonConfig) {
      const parsed = JSON.parse(jsonConfig);
      return parsed as AdvancedMetronomeConfig;
    } else {
      return initialConfig;
    }
  });

  function changeConfig(event: SyntheticEvent<HTMLTextAreaElement>) {
    const jsonConfig = event.currentTarget.value;
    try {
      const parsed = JSON.parse(jsonConfig);
      setConfig(parsed);
      localStorage.setItem("config", jsonConfig);
    } catch {
      /* empty */
    }
  }

  function resetConfig() {
    setConfig(initialConfig);
  }

  return (
    <Flex
      vertical
      gap={12}
    >
      <Space>
        <Button onClick={resetConfig}>Resetuj konfigurację</Button>
      </Space>
      <TextArea
        value={JSON.stringify(config)}
        onChange={changeConfig}
      />
      <AdvancedMetronome {...config} />
    </Flex>
  );
}
