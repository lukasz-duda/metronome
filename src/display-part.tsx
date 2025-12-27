import { Button, Flex, Progress, Typography } from "antd";
import type { PartRange } from "./length";
import { StepBackwardOutlined } from "@ant-design/icons";

export function DisplayPart({
  range,
  onStepBackward,
}: {
  range: PartRange;
  onStepBackward: (beatIndex: number) => void;
}) {
  return (
    <>
      <div>
        <Typography.Text>
          {`${range.part.name} | ${range.minutes.toFixed(1)} minutes | ${range.endBeat - range.startBeat + 1} beats <${range.startBeat}-${range.endBeat}>`}
        </Typography.Text>
      </div>
      <Flex gap={12}>
        <Progress percent={range.progress} />
        <Button
          icon={<StepBackwardOutlined />}
          onClick={() => onStepBackward(range.startBeat - 1)}
        />
      </Flex>
    </>
  );
}
