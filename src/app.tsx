import { useState, type SyntheticEvent } from "react";
import { AdvancedMetronome } from "./advanced-metronome";
import { Button, Flex, Form, InputNumber, Space, Tabs } from "antd";
import TextArea from "antd/es/input/TextArea";
import { initialConfig, type AdvancedMetronomeConfig } from "./config";
import { RollbackOutlined } from "@ant-design/icons";

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

  const exerciseBpm =
    config.tempos.find((tempo) => tempo.id === "e")?.bpm ?? 100;

  function changeExerciseBpm(value: number | null) {
    if (value === null) return;

    const newTempos = config.tempos.map((tempo) => {
      if (tempo.id === "e") {
        return {
          ...tempo,
          bpm: value,
        };
      } else {
        return tempo;
      }
    });

    const newConfig = {
      ...config,
      tempos: newTempos,
    };

    setConfig(newConfig);
    localStorage.setItem("config", JSON.stringify(newConfig));
  }

  return (
    <Tabs
      items={[
        {
          key: "metronome",
          label: "Metronome",
          children: (
            <>
              <Form>
                <Form.Item label="Exercise BPM">
                  <InputNumber
                    value={exerciseBpm}
                    onChange={changeExerciseBpm}
                  />
                </Form.Item>
              </Form>
              <AdvancedMetronome {...config} />
            </>
          ),
        },
        {
          key: "config",
          label: "Configuration",
          children: (
            <Flex
              vertical
              gap={12}
            >
              <TextArea
                value={JSON.stringify(config, null, 2)}
                onChange={changeConfig}
                style={{ height: "calc(100vh - 150px)" }}
              />
              <Space>
                <Button
                  icon={<RollbackOutlined />}
                  danger
                  onClick={resetConfig}
                >
                  Resetuj konfigurację
                </Button>
              </Space>
            </Flex>
          ),
        },
      ]}
    />
  );
}
