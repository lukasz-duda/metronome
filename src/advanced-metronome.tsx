import { useCallback, useEffect, useMemo, useState } from "react";
import { useMetronome } from "./metronome";
import { Button, Flex, Progress, Space, Typography } from "antd";
import { play } from "./audio";
import {
  CaretRightOutlined,
  PauseOutlined,
  StepBackwardOutlined,
} from "@ant-design/icons";
import { useWakeLock } from "./wake-lock";

export interface AdvancedMetronomeConfig {
  units: Unit[];
  tempos: Tempo[];
  parts: Part[];
}

export interface Unit {
  id: string;
  name: string;
  length: number;
  lengthUnit: string;
}

export interface Tempo {
  id: string;
  name: string;
  bpm: number;
}

export interface Part {
  id: string;
  name: string;
  tempoId: string;
  length: number;
  lengthUnitId: string;
  repetitions?: number;
  pauseLength?: number;
  pauseLengthUnitId?: string;
}

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
    play();
    setCurrentBeat((prevBeat) => prevBeat + 1);
  }, []);

  const currentTempoId = ranges.find((range) => range.current)?.part.tempoId;
  const bpm = tempos.find((tempo) => tempo.id === currentTempoId)?.bpm ?? 100;

  const { start, stop } = useMetronome({ bpm, onBeat: handleBeat });

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

function calculateRanges({
  parts,
  currentBeat,
  units,
  tempos,
}: {
  parts: Part[];
  currentBeat: number;
  units: Unit[];
  tempos: Tempo[];
}): PartRange[] {
  const ranges: PartRange[] = [];

  let beatIndex = 0;

  for (let partIndex = 0; partIndex < parts.length; partIndex++) {
    const part = parts[partIndex];

    const length = partLength({ part, units });
    const startBeat = beatIndex + 1;
    const endBeat = startBeat + length - 1;
    const current = startBeat <= currentBeat && currentBeat <= endBeat;
    const previous = startBeat < currentBeat;
    const beats = endBeat - startBeat + 1;
    const bpm = tempos.find((tempo) => tempo.id === part.tempoId)?.bpm ?? 100;
    const minutes = beats / bpm;

    const range: PartRange = {
      part: part,
      startBeat,
      endBeat: endBeat,
      current,
      progress: current
        ? Math.round(((currentBeat - beatIndex) / length) * 100)
        : previous
          ? 100
          : 0,
      minutes,
    };

    ranges.push(range);
    beatIndex = range.endBeat;
  }

  return ranges;
}

function partLength({ part, units }: { part: Part; units: Unit[] }): number {
  const repetitions = part.repetitions ?? 1;
  const partLength =
    part.length * unitLength({ queryUnit: part.lengthUnitId, units });
  const pauseLength =
    part.pauseLength && part.pauseLengthUnitId
      ? part.pauseLength *
        unitLength({ queryUnit: part.pauseLengthUnitId, units })
      : 0;
  const partAndPauseLength = partLength + pauseLength;
  return repetitions * partAndPauseLength;
}

function unitLength({
  queryUnit,
  units,
}: {
  queryUnit: string;
  units: Unit[];
}): number {
  const unit = units.find((u) => u.id === queryUnit);
  if (unit) {
    return unit.length * unitLength({ queryUnit: unit.lengthUnit, units });
  } else {
    return 1;
  }
}

interface PartRange {
  part: Part;
  startBeat: number;
  endBeat: number;
  current: boolean;
  progress: number;
  minutes: number;
}

function DisplayPart({
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
          {`${range.part.name} | ${range.minutes.toFixed(1)} minutes | ${range.part.length} beats <${range.startBeat}-${range.endBeat}>`}
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
