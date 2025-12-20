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
  position: number;
  beatLength: number;
}

export function calculateProgress({
  currentBeat,
  parts,
  units,
}: Position): Progress {
  const progress: Progress = {
    parts: parts.map((part) => {
      const partProgess: PartProgress = {
        part: part,
        units: units.map((unit) => ({
          beatLength: unit.length,
          position: currentBeat,
        })),
      };
      return partProgess;
    }),
  };
  return progress;
}
