import { useCallback, useEffect, useMemo, useState } from "react";
import { useMetronome } from "./metronome";
import { Button, Progress, Space, Typography } from "antd";
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

  function reset() {
    setCurrentBeat(0);
  }

  const totalMinutes = ranges.reduce(
    (acumulator, range) => acumulator + range.minutes,
    0,
  );

  return (
    <Space vertical>
      <Space>
        <Button
          icon={<CaretRightOutlined />}
          type="primary"
          onClick={handleStart}
        >
          Start
        </Button>
        <Button
          icon={<PauseOutlined />}
          onClick={handleStop}
        >
          Stop
        </Button>
        <Button
          icon={<StepBackwardOutlined />}
          onClick={reset}
        >
          Reset
        </Button>
      </Space>
      <Typography.Text>
        Current beat: {currentBeat} | Current BPM: {bpm} | Total time:{" "}
        {totalMinutes.toFixed(1)} minutes
      </Typography.Text>
      {ranges.map((range) => (
        <DisplayPart range={range} />
      ))}
    </Space>
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
    const endBeat = beatIndex + length;
    const current = beatIndex <= currentBeat && currentBeat <= endBeat;
    const previous = beatIndex < currentBeat;
    const beats = endBeat - beatIndex;
    const bpm = tempos.find((tempo) => tempo.id === part.tempoId)?.bpm ?? 100;
    const minutes = beats / bpm;

    const range: PartRange = {
      part: part,
      startBeat: beatIndex,
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

function DisplayPart({ range }: { range: PartRange }) {
  const beats = range.endBeat - range.startBeat;
  return (
    <>
      <div>
        <Typography.Text>
          {`${range.part.name} | ${range.minutes.toFixed(1)} minutes | ${beats} beats <${range.startBeat}-${range.endBeat}>`}
        </Typography.Text>
      </div>
      <Progress percent={range.progress} />
    </>
  );
}
