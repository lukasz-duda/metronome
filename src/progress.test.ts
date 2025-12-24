import { describe, expect, it } from "vitest";
import {
  calculateBeatLength,
  calculateProgress,
  isPause,
  type PartRange,
  type Progress,
} from "./progress";
import type { Part, Unit } from "./config";

describe("calculateProgress", () => {
  describe("1 part 1 unit", () => {
    it("returns unit progress", () => {
      const part1: Part = {
        id: "p1",
        name: "",
        tempoId: "",
        length: 2,
        lengthUnitId: "u1",
      };

      const unit1: Unit = {
        id: "u1",
        name: "",
        length: 4,
        lengthUnit: "beat",
      };

      const progress = calculateProgress({
        currentBeat: 5,

        units: [unit1],
        parts: [part1],
      });

      const expected: Progress = {
        parts: [
          {
            part: part1,
            units: [
              {
                progress: 25,
                unit: unit1,
              },
            ],
          },
        ],
      };

      expect(progress).toStrictEqual(expected);
    });
  });
});

describe("calculateBeatLength", () => {
  describe("beat unit", () => {
    const unit1: Unit = {
      id: "u1",
      name: "",
      length: 4,
      lengthUnit: "beat",
    };

    it("returns beat length", () => {
      const result = calculateBeatLength({
        unitId: unit1.id,
        units: [unit1],
      });

      expect(result).toStrictEqual(4);
    });

    describe("complex unit", () => {
      const unit2: Unit = {
        id: "u2",
        name: "",
        length: 3,
        lengthUnit: "u1",
      };

      const unit3: Unit = {
        id: "u3",
        name: "",
        length: 2,
        lengthUnit: "u2",
      };

      it("returns beat length", () => {
        const result = calculateBeatLength({
          unitId: unit3.id,
          units: [unit1, unit2, unit3],
        });

        expect(result).toStrictEqual(24);
      });
    });
  });
});

describe("isPause", () => {
  const part1: Part = {
    id: "",
    name: "",
    tempoId: "",
    length: 3,
    lengthUnitId: "beat",
    pauseLength: 2,
    pauseLengthUnitId: "beat",
    repetitions: 2,
  };

  const partRange1: PartRange = {
    part: part1,
    startBeat: 1,
    endBeat: 5,
  };

  const units = [
    {
      id: "u1",
      name: "",
      length: 4,
      lengthUnit: "beat",
    },
  ];

  describe("at the beginning of the first part", () => {
    const pause = isPause({ currentBeat: 1, partRange: partRange1, units });

    it("returns false", () => {
      expect(pause).toStrictEqual(false);
    });
  });

  describe("at the end of the first part", () => {
    const pause = isPause({ currentBeat: 3, partRange: partRange1, units });

    it("returns false", () => {
      expect(pause).toStrictEqual(false);
    });
  });

  describe("at the beginning of the first pause", () => {
    const pause = isPause({ currentBeat: 4, partRange: partRange1, units });

    it("returns true", () => {
      expect(pause).toStrictEqual(true);
    });
  });

  describe("at the end of the first pause", () => {
    const pause = isPause({ currentBeat: 5, partRange: partRange1, units });

    it("returns true", () => {
      expect(pause).toStrictEqual(true);
    });
  });

  describe("at the beginning of the repeated part", () => {
    const pause = isPause({ currentBeat: 6, partRange: partRange1, units });

    it("returns false", () => {
      expect(pause).toStrictEqual(false);
    });
  });

  describe("at the beginning of the repeated pause", () => {
    const pause = isPause({ currentBeat: 9, partRange: partRange1, units });

    it("returns true", () => {
      expect(pause).toStrictEqual(true);
    });
  });
});
