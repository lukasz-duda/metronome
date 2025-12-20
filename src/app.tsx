import { useState, type SyntheticEvent } from "react";
import { AdvancedMetronome } from "./advanced-metronome";
import { Button, Flex, Space, Tabs } from "antd";
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

  return (
    <Tabs
      items={[
        {
          key: "metronome",
          label: "Metronome",
          children: <AdvancedMetronome {...config} />,
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
                value={JSON.stringify(config)}
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
