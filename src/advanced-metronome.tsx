import { useCallback, useEffect, useMemo, useState } from "react";
import { useMetronome } from "./metronome";
import { Button, Progress, Space, Typography } from "antd";
import { play } from "./audio";

export interface AdvancedMetronomeConfig {
  units: Unit[];
  parts: Part[];
}

export interface Unit {
  name: string;
  description: string;
  length: number;
  lengthUnit: string;
}

export interface Part {
  id: string;
  name: string;
  bpm: number;
  length: number;
  lengthUnit: string;
}

export function AdvancedMetronome({ units, parts }: AdvancedMetronomeConfig) {
  const [currentBeat, setCurrentBeat] = useState(0);

  const ranges: PartRange[] = calculateRanges({ parts, currentBeat, units });

  const endBeat = useMemo(
    () => ranges.at(ranges.length - 1)?.endBeat,
    [ranges],
  );

  const end = currentBeat === endBeat;

  const handleBeat = useCallback(function () {
    play();
    setCurrentBeat((prevBeat) => prevBeat + 1);
  }, []);

  const bpm = ranges.find((range) => range.current)?.part.bpm;

  const { start, stop } = useMetronome({ bpm, onBeat: handleBeat });

  useEffect(() => {
    if (end) {
      stop();
    }
  }, [end, stop]);

  function handleStart() {
    reset();
    start();
  }

  function reset() {
    setCurrentBeat(0);
  }

  return (
    <Space vertical>
      <Space>
        <Button
          type="primary"
          onClick={handleStart}
        >
          Start
        </Button>
        <Button onClick={stop}>Stop</Button>
        <Button onClick={reset}>Reset</Button>
      </Space>
      <Typography.Text>Current beat: {currentBeat}</Typography.Text>
      <Typography.Text>Current BPM: {bpm}</Typography.Text>
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
}: {
  parts: Part[];
  currentBeat: number;
  units: Unit[];
}): PartRange[] {
  const ranges: PartRange[] = [];

  let beatIndex = 0;

  for (let partIndex = 0; partIndex < parts.length; partIndex++) {
    const part = parts[partIndex];

    const endBeat = beatIndex + partLength({ part, units });
    const current = beatIndex <= currentBeat && currentBeat <= endBeat;
    const previous = beatIndex < currentBeat;

    const range: PartRange = {
      part: part,
      startBeat: beatIndex,
      endBeat: endBeat,
      current,
      progress: current
        ? Math.round(
            ((currentBeat - beatIndex) / partLength({ part, units })) * 100,
          )
        : previous
          ? 100
          : 0,
    };

    ranges.push(range);
    beatIndex = range.endBeat;
  }

  return ranges;
}

function partLength({ part, units }: { part: Part; units: Unit[] }): number {
  return part.length * unitLength({ queryUnit: part.lengthUnit, units });
}

function unitLength({
  queryUnit,
  units,
}: {
  queryUnit: string;
  units: Unit[];
}): number {
  const unit = units.find((u) => u.name === queryUnit);
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
}

function DisplayPart({ range }: { range: PartRange }) {
  return (
    <>
      <Typography.Title>{range.part.name}</Typography.Title>
      <Progress
        type="circle"
        percent={range.progress}
      />
    </>
  );
}
