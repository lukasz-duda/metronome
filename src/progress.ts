import type { Part, Unit } from "./config";

export interface Position {
  currentBeat: number;
  units: Unit[];
  partRanges: PartRange[];
}

export interface Progress {
  parts: PartProgress[];
}

export interface PartProgress {
  pause: boolean;
  partRange: PartRange;
  units: UnitProgress[];
}

export interface UnitProgress {
  unit: Unit;
  progress: number;
}

export function calculateProgress({
  currentBeat,
  partRanges,
  units,
}: Position): Progress {
  const progress: Progress = {
    parts: partRanges.map((partRange) => {
      const pause = isPause({ currentBeat, partRange, units });
      const componentUnits = pause
        ? collectComponentUnits({
            unitId: partRange.part.pauseLengthUnitId!,
            units,
          })
        : collectComponentUnits({
            unitId: partRange.part.lengthUnitId,
            units,
          });

      const partUnits: UnitBeatLength[] = componentUnits.map((unit) => {
        const unitBeatLength: UnitBeatLength = {
          unit: unit,
          beatLength: calculateBeatLength({ unitId: unit.id, units }),
        };
        return unitBeatLength;
      });

      const partProgess: PartProgress = {
        pause,
        partRange: partRange,
        units: partUnits.map((partUnit) => ({
          unit: partUnit.unit,
          progress: Math.round(
            ((currentBeat % partUnit.beatLength) / partUnit.beatLength) * 100,
          ),
        })),
      };
      return partProgess;
    }),
  };
  return progress;
}

function collectComponentUnits({
  unitId,
  units,
}: {
  unitId: string;
  units: Unit[];
}): Unit[] {
  const foundUnit = units.find((unit) => unit.id === unitId);

  if (foundUnit) {
    return [
      foundUnit,
      ...collectComponentUnits({
        unitId: foundUnit.lengthUnit,
        units,
      }),
    ];
  } else {
    return [];
  }
}

export interface UnitBeatLength {
  unit: Unit;
  beatLength: number;
}

export function calculateBeatLength({
  unitId,
  units,
}: {
  unitId?: string;
  units: Unit[];
}): number {
  if (unitId === undefined || unitId === "beat") {
    return 1;
  }

  const found = units.find((unit) => unit.id === unitId);

  if (found) {
    const beatLength = calculateBeatLength({
      unitId: found.lengthUnit,
      units: units,
    });
    return found.length * beatLength;
  } else {
    throw Error(`Unit ${unitId} not found.`);
  }
}

export function isPause({
  currentBeat,
  partRange,
  units,
}: {
  currentBeat: number;
  partRange: PartRange;
  units: Unit[];
}) {
  const part = partRange.part;
  const repeatCount = part.repetitions ?? 1;

  if (part.pauseLength && part.pauseLength > 0 && part.pauseLengthUnitId) {
    const partBeatLength =
      part.length *
      calculateBeatLength({
        unitId: part.lengthUnitId,
        units,
      });

    const pauseBeatLength =
      part.pauseLength *
      calculateBeatLength({
        unitId: part.pauseLengthUnitId,
        units,
      });

    const totalBeatLength = partBeatLength + pauseBeatLength;

    for (let repatIndex = 0; repatIndex < repeatCount; repatIndex++) {
      const partStartBeat = partRange.startBeat + repatIndex * totalBeatLength;
      const partEndBeat = partStartBeat + partBeatLength - 1;
      const pauseStartBeat = partEndBeat + 1;
      const pauseEndBeat = pauseStartBeat + pauseBeatLength - 1;

      if (currentBeat >= partStartBeat && currentBeat <= partEndBeat) {
        return false;
      }

      if (currentBeat >= pauseStartBeat && currentBeat <= pauseEndBeat) {
        return true;
      }
    }
  }

  return false;
}

export interface PartRange {
  part: Part;
  startBeat: number;
  endBeat: number;
}
