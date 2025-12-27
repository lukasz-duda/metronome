import type { Part, Tempo, Unit } from "./config";

export function calculateRanges({
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

    const bpm = tempos.find((tempo) => tempo.id === part.tempoId)?.bpm ?? 100;
    const length = partLength({ part, units, bpm });
    const startBeat = beatIndex + 1;
    const endBeat = startBeat + length - 1;
    const current = startBeat <= currentBeat && currentBeat <= endBeat;
    const previous = startBeat < currentBeat;
    const beats = endBeat - startBeat + 1;
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
      bpm,
    };

    ranges.push(range);
    beatIndex = range.endBeat;
  }

  return ranges;
}

function partLength({
  part,
  units,
  bpm,
}: {
  part: Part;
  units: Unit[];
  bpm: number;
}): number {
  const repetitions = part.repetitions ?? 1;
  const partLength =
    part.length *
    unitLength({ queryUnit: part.lengthUnitId, part, units, bpm });
  const pauseLength =
    part.pauseLength && part.pauseLengthUnitId
      ? part.pauseLength *
        unitLength({ queryUnit: part.pauseLengthUnitId, part, units, bpm })
      : 0;
  const partAndPauseLength = partLength + pauseLength;
  return repetitions * partAndPauseLength;
}

function unitLength({
  queryUnit,
  part,
  units,
  bpm,
}: {
  queryUnit: string;
  part: Part;
  units: Unit[];
  bpm: number;
}): number {
  const unit = units.find((u) => u.id === queryUnit);
  if (unit) {
    return (
      unit.length * unitLength({ queryUnit: unit.lengthUnit, units, part, bpm })
    );
  } else if (queryUnit === "minute") {
    return bpm;
  } else {
    return 1;
  }
}

export interface PartRange {
  part: Part;
  startBeat: number;
  endBeat: number;
  current: boolean;
  progress: number;
  minutes: number;
  bpm: number;
}
