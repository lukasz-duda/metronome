import { describe, expect, it } from "vitest";
import { calculateProgress, type Progress } from "./progress";
import type { Part } from "./config";

describe("calculateProgress", () => {
  describe("before one beat part", () => {
    it("returns position zero", () => {
      const part1: Part = {
        id: "p1id",
        name: "p1",
        tempoId: "t1",
        length: 1,
        lengthUnitId: "u1",
      };
      const progress = calculateProgress({
        currentBeat: 0,
        units: [
          {
            id: "u1id",
            name: "u1",
            length: 1,
            lengthUnit: "beat",
          },
        ],
        parts: [part1],
      });

      const expected: Progress = {
        parts: [
          {
            part: part1,
            units: [
              {
                beatLength: 1,
                position: 0,
              },
            ],
          },
        ],
      };

      expect(progress).toStrictEqual(expected);
    });
  });
});
