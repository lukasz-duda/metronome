import { useCallback, useEffect, useMemo, useState } from "react";
import { useMetronome } from "./metronome";
import { Button, Flex, Space, Typography } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { useWakeLock } from "./wake-lock";
import {
  defaultPauseSound,
  defaultSound,
  type AdvancedMetronomeConfig,
} from "./config";
import { PartProgress } from "./part-progress";
import { calculateRanges, type PartRange } from "./length";
import { DisplayPart } from "./display-part";
import { calculateProgress } from "./progress";

export function AdvancedMetronome({
  units,
  parts,
  tempos,
}: AdvancedMetronomeConfig) {
  const [currentBeat, setCurrentBeat] = useState(0);

  const ranges: PartRange[] = calculateRanges({
    parts,
    currentBeat,
    units,
    tempos,
  });

  const endBeat = useMemo(
    () => ranges.at(ranges.length - 1)?.endBeat,
    [ranges],
  );

  const end = currentBeat === endBeat;

  const handleBeat = useCallback(function () {
    setCurrentBeat((prevBeat) => prevBeat + 1);
  }, []);

  const currentRange = ranges.find((range) => range.current);

  const currentTempoId = currentRange?.part.tempoId ?? parts[0].tempoId;
  const bpm = tempos.find((tempo) => tempo.id === currentTempoId)?.bpm ?? 100;

  const { parts: partProgresses } = calculateProgress({
    currentBeat,
    partRanges: currentRange ? [currentRange] : [],
    units,
  });

  const currentPartProgress = partProgresses[0];

  const pause = currentPartProgress?.pause ?? false;

  const sound = pause
    ? (currentRange?.part.pauseSound ?? defaultPauseSound)
    : defaultSound;

  const { start, stop } = useMetronome({ bpm, onBeat: handleBeat, sound });

  useEffect(() => {
    if (end) {
      stop();
    }
  }, [end, stop]);

  const { releaseWakeLock, requestScreenWakeLock } = useWakeLock();

  const [started, setStarted] = useState(false);

  function handleStart() {
    if (started) {
      return;
    }

    start();
    requestScreenWakeLock();
    setStarted(true);
  }

  function handleStop() {
    if (started) {
      stop();
      releaseWakeLock();
      setStarted(false);
    }
  }

  const totalMinutes = ranges.reduce(
    (acumulator, range) => acumulator + range.minutes,
    0,
  );

  return (
    <Flex
      vertical
      gap={12}
    >
      <Flex justify="space-between">
        <Typography.Text>
          Current beat: {currentBeat} | Current BPM: {bpm} | Total time:{" "}
          {totalMinutes.toFixed(1)} minutes
        </Typography.Text>
        <Space>
          {started ? (
            <Button
              icon={<PauseOutlined />}
              type="primary"
              onClick={handleStop}
            />
          ) : (
            <Button
              icon={<CaretRightOutlined />}
              type="primary"
              onClick={handleStart}
            />
          )}
        </Space>
      </Flex>
      {currentPartProgress && (
        <PartProgress partProgress={currentPartProgress} />
      )}
      <div>
        {ranges.map((range) => (
          <DisplayPart
            key={range.part.id}
            range={range}
            onStepBackward={setCurrentBeat}
          />
        ))}
      </div>
    </Flex>
  );
}
