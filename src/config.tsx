export interface AdvancedMetronomeConfig {
  units: Unit[];
  tempos: Tempo[];
  parts: Part[];
}

export interface Unit {
  id: string;
  name: string;
  length: number;
  lengthUnit: string;
}

export interface Tempo {
  id: string;
  name: string;
  bpm: number;
}

export interface Part {
  id: string;
  name: string;
  tempoId: string;
  length: number;
  lengthUnitId: string;
  repetitions?: number;
  pauseLength?: number;
  pauseLengthUnitId?: string;
}

export const initialConfig: AdvancedMetronomeConfig = {
  units: [
    { id: "b", name: "Beats", length: 1, lengthUnit: "beat" },
    {
      id: "e124",
      name: "Exercise 1, 2, 4",
      length: 2,
      lengthUnit: "b",
    },
    { id: "e35", name: "Exercise 3 or 5", length: 4, lengthUnit: "b" },
    { id: "e6", name: "Exercise 6", length: 8, lengthUnit: "b" },
    {
      id: "r124",
      name: "4 repetitions of exercise 1, 2, 4",
      length: 4,
      lengthUnit: "e124",
    },
    {
      id: "s124",
      name: "Set of 4 repetitions of execrice 1, 2, 4",
      length: 4,
      lengthUnit: "r124",
    },
    {
      id: "5s124",
      name: "5 sets of exercise 1, 2, 4",
      length: 5,
      lengthUnit: "s124",
    },
    {
      id: "r35",
      name: "4 repetitions of exercise 3, 5",
      length: 4,
      lengthUnit: "e35",
    },
    {
      id: "s35",
      name: "Set of 4 repetitions of execrice 3, 5",
      length: 4,
      lengthUnit: "r35",
    },
    {
      id: "5s35",
      name: "5 sets of exercise 3, 5",
      length: 5,
      lengthUnit: "s35",
    },
    {
      id: "r35",
      name: "4 repetitions of exercise 3, 5",
      length: 4,
      lengthUnit: "e35",
    },
    {
      id: "r6",
      name: "4 repetitions of exercise 6",
      length: 4,
      lengthUnit: "e6",
    },
    {
      id: "s6",
      name: "Set of 4 repetitions of execrice 6",
      length: 4,
      lengthUnit: "r6",
    },
    {
      id: "5s6",
      name: "5 sets of exercise 6",
      length: 5,
      lengthUnit: "s6",
    },
  ],
  tempos: [
    { id: "w", name: "warmup", bpm: 100 },
    { id: "e", name: "exerice", bpm: 130 },
  ],
  parts: [
    {
      id: "e1",
      name: "Ascend",
      tempoId: "e",
      length: 1,
      lengthUnitId: "5s124",
      repetitions: 1,
      pauseLength: 2,
      pauseLengthUnitId: "r124",
    },
    {
      id: "e2",
      name: "Descend",
      tempoId: "e",
      length: 1,
      lengthUnitId: "5s124",
      repetitions: 1,
      pauseLength: 2,
      pauseLengthUnitId: "r124",
    },
    {
      id: "e3",
      name: "Back & Forth",
      tempoId: "e",
      length: 1,
      lengthUnitId: "5s35",
      repetitions: 1,
      pauseLength: 2,
      pauseLengthUnitId: "r35",
    },
    {
      id: "e4",
      name: "2 Strings 5 notes",
      tempoId: "e",
      length: 1,
      lengthUnitId: "5s124",
      repetitions: 1,
      pauseLength: 2,
      pauseLengthUnitId: "r1",
    },
    {
      id: "e5",
      name: "2 Strings Full",
      tempoId: "e",
      length: 1,
      lengthUnitId: "5s124",
      repetitions: 1,
      pauseLength: 2,
      pauseLengthUnitId: "r124",
    },
    {
      id: "e6",
      name: "2 Strings Up & Down",
      tempoId: "e",
      length: 1,
      lengthUnitId: "5s6",
      repetitions: 1,
      pauseLength: 2,
      pauseLengthUnitId: "r6",
    },
  ],
};
