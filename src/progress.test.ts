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
  const unit1: Unit = {
    id: "u1",
    name: "",
    length: 4,
    lengthUnit: "beat",
  };

  describe("beat unit part", () => {
    it("returns unit progress", () => {
      const part1: Part = {
        id: "p1",
        name: "",
        tempoId: "",
        length: 2,
        lengthUnitId: "u1",
      };

      const partRange1: PartRange = {
        part: part1,
        startBeat: 1,
        endBeat: 8,
        bpm: 100,
      };

      const progress = calculateProgress({
        currentBeat: 5,

        units: [unit1],
        partRanges: [partRange1],
      });

      const expected: Progress = {
        parts: [
          {
            pause: false,
            partRange: partRange1,
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

  describe("complex unit part", () => {
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

    const unit4: Unit = {
      id: "u4",
      name: "",
      length: 2,
      lengthUnit: "u1",
    };

    const unit5: Unit = {
      id: "u5",
      name: "",
      length: 2,
      lengthUnit: "u4",
    };

    const part1: Part = {
      id: "p1",
      name: "",
      tempoId: "",
      length: 2,
      lengthUnitId: "u3",
      pauseLength: 2,
      pauseLengthUnitId: "u5",
      repetitions: 1,
    };

    const partRange1: PartRange = {
      part: part1,
      startBeat: 1,
      endBeat: 24,
      bpm: 100,
    };

    describe("before part start", () => {
      const progress = calculateProgress({
        currentBeat: 0,

        units: [unit1, unit2, unit3, unit4, unit5],
        partRanges: [partRange1],
      });

      it("returns progresses of component units", () => {
        const expected: Progress = {
          parts: [
            {
              pause: false,
              partRange: partRange1,
              units: [
                {
                  progress: 0,
                  unit: unit3,
                },
                {
                  progress: 0,
                  unit: unit2,
                },
                {
                  progress: 0,
                  unit: unit1,
                },
              ],
            },
          ],
        };

        expect(progress).toStrictEqual(expected);
      });
    });

    describe("just after part start", () => {
      const progress = calculateProgress({
        currentBeat: 1,

        units: [unit1, unit2, unit3, unit4, unit5],
        partRanges: [partRange1],
      });

      it("returns progresses of component units", () => {
        const expected: Progress = {
          parts: [
            {
              pause: false,
              partRange: partRange1,
              units: [
                {
                  progress: 4,
                  unit: unit3,
                },
                {
                  progress: 8,
                  unit: unit2,
                },
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

    describe("just after first pause start", () => {
      const progress = calculateProgress({
        currentBeat: 49,

        units: [unit1, unit2, unit3, unit4, unit5],
        partRanges: [partRange1],
      });

      it("returns progresses of component units", () => {
        const expected: Progress = {
          parts: [
            {
              pause: true,
              partRange: partRange1,
              units: [
                {
                  progress: 6,
                  unit: unit5,
                },
                {
                  progress: 13,
                  unit: unit4,
                },
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
        bpm: 100,
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
          bpm: 100,
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
    bpm: 100,
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
