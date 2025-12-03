import { useCallback, useEffect, useMemo, useState } from "react";
import { useMetronome } from "./metronome";
import { Button, Flex, Progress, Space, Typography } from "antd";
import { play } from "./audio";

interface AdvancedMetronomeProps {
  parts: Part[];
}

interface Part {
  id: string;
  name: string;
  bpm: number;
  length: number;
}

export function AdvancedMetronome({ parts }: AdvancedMetronomeProps) {
  const [currentBeat, setCurrentBeat] = useState(0);

  const ranges: PartRange[] = calculateRanges({ parts, currentBeat });

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
    setCurrentBeat(0);
    start();
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
        <Button onClick={stop}>stop</Button>
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
}: {
  parts: Part[];
  currentBeat: number;
}): PartRange[] {
  const ranges: PartRange[] = [];

  let beatIndex = 0;

  for (let partIndex = 0; partIndex < parts.length; partIndex++) {
    const part = parts[partIndex];

    const endBeat = beatIndex + part.length;
    const current = beatIndex <= currentBeat && currentBeat <= endBeat;
    const previous = beatIndex < currentBeat;

    const range: PartRange = {
      part: part,
      startBeat: beatIndex,
      endBeat: endBeat,
      current,
      progress: current
        ? ((currentBeat - beatIndex) / part.length) * 100
        : previous
          ? 100
          : 0,
    };

    ranges.push(range);
    beatIndex = range.endBeat;
  }

  return ranges;
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
