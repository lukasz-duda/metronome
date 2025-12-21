import { describe, expect, it } from "vitest";
import {
  calculateBeatLength,
  calculateProgress,
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
