import { Progress, Space, Typography } from "antd";
import { type PartProgress } from "./progress";

export function PartProgress({ partProgress }: { partProgress: PartProgress }) {
  return (
    <Space vertical>
      {partProgress &&
        partProgress.units.map(
          (unitProgress) =>
            unitProgress.unit.displayName && (
              <Space>
                <Progress
                  type="circle"
                  percent={unitProgress.progress}
                  strokeColor={partProgress.pause ? "red" : undefined}
                />
                <Typography.Text>
                  {partProgress.pause && "PAUSE "}
                  {unitProgress.unit.displayName}
                </Typography.Text>
              </Space>
            ),
        )}
    </Space>
  );
}
