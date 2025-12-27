import { Progress, Space, Typography } from "antd";
import type { Unit } from "./config";
import { calculateProgress, type PartRange } from "./progress";

export function PartsProgress({
  currentBeat,
  partRanges,
  units,
}: {
  currentBeat: number;
  partRanges: PartRange[];
  units: Unit[];
}) {
  const { parts } = calculateProgress({
    currentBeat,
    partRanges,
    units,
  });

  const partProgress = parts[0];

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
