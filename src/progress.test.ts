import { describe, expect, it } from "vitest";
import { calculateProgress, type Progress } from "./progress";
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
