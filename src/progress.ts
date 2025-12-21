import type { Part, Unit } from "./config";

export interface Position {
  currentBeat: number;
  units: Unit[];
  parts: Part[];
}

export interface Progress {
  parts: PartProgress[];
}

export interface PartProgress {
  part: Part;
  units: UnitProgress[];
}

export interface UnitProgress {
  unit: Unit;
  progress: number;
}

export function calculateProgress({
  currentBeat,
  parts,
  units,
}: Position): Progress {
  const progress: Progress = {
    parts: parts.map((part) => {
      const partUnits: UnitBeatLength[] = units.map((unit) => {
        const unitBeatLength: UnitBeatLength = {
          unit: unit,
          beatLength: unit.length,
        };
        return unitBeatLength;
      });

      const partProgess: PartProgress = {
        part: part,
        units: partUnits.map((partUnit) => ({
          unit: partUnit.unit,
          progress:
            ((currentBeat % partUnit.beatLength) / partUnit.beatLength) * 100,
        })),
      };
      return partProgess;
    }),
  };
  return progress;
}

export interface UnitBeatLength {
  unit: Unit;
  beatLength: number;
}

export function calculateBeatLength({
  unitId,
  units,
}: {
  unitId: string;
  units: Unit[];
}): UnitBeatLength[] {
  const result: UnitBeatLength[] = [
    {
      unit: units.find((unit) => unit.id === unitId) ?? beatUnit,
      beatLength: units[0].length ?? beatUnit.length,
    },
  ];
  return result;
}

const beatUnit: Unit = {
  id: "beat",
  name: "Beat",
  length: 1,
  lengthUnit: "beat",
};
