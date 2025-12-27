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
  displayName?: string;
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
  pauseLength?: number;
  pauseLengthUnitId?: string;
  repetitions?: number;
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
    {
      id: "e35",
      name: "Exercise 3 or 5",
      length: 4,
      lengthUnit: "b",
    },
    { id: "e6", name: "Exercise 6", length: 8, lengthUnit: "b" },
    {
      id: "r124",
      name: "4 repetitions of exercise 1, 2, 4",
      length: 4,
      lengthUnit: "e124",
      displayName: "REP",
    },
    {
      id: "s124",
      name: "Set of 4 repetitions of execrice 1, 2, 4",
      length: 4,
      lengthUnit: "r124",
      displayName: "SET",
    },
    {
      id: "r35",
      name: "4 repetitions of exercise 3, 5",
      length: 4,
      lengthUnit: "e35",
      displayName: "REP",
    },
    {
      id: "s35",
      name: "Set of 4 repetitions of execrice 3, 5",
      length: 4,
      lengthUnit: "r35",
      displayName: "SET",
    },
    {
      id: "r6",
      name: "4 repetitions of exercise 6",
      length: 4,
      lengthUnit: "e6",
      displayName: "REP",
    },
    {
      id: "s6",
      name: "Set of 4 repetitions of execrice 6",
      length: 4,
      lengthUnit: "r6",
      displayName: "SET",
    },
  ],
  tempos: [
    { id: "w", name: "warmup", bpm: 100 },
    { id: "e", name: "exerice", bpm: 140 },
  ],
  parts: [
    {
      id: "e1",
      name: "Ascend",
      tempoId: "e",
      length: 1,
      lengthUnitId: "s124",
      repetitions: 5,
      pauseLength: 2,
      pauseLengthUnitId: "r124",
    },
    {
      id: "e2",
      name: "Descend",
      tempoId: "e",
      length: 1,
      lengthUnitId: "s124",
      repetitions: 5,
      pauseLength: 2,
      pauseLengthUnitId: "r124",
    },
    {
      id: "e3",
      name: "Back & Forth",
      tempoId: "e",
      length: 1,
      lengthUnitId: "s35",
      repetitions: 5,
      pauseLength: 2,
      pauseLengthUnitId: "r35",
    },
    {
      id: "e4",
      name: "2 Strings 5 notes",
      tempoId: "e",
      length: 1,
      lengthUnitId: "s124",
      repetitions: 5,
      pauseLength: 2,
      pauseLengthUnitId: "r124",
    },
    {
      id: "e5",
      name: "2 Strings Full",
      tempoId: "e",
      length: 1,
      lengthUnitId: "s124",
      repetitions: 5,
      pauseLength: 2,
      pauseLengthUnitId: "r124",
    },
    {
      id: "e6",
      name: "2 Strings Up & Down",
      tempoId: "e",
      length: 1,
      lengthUnitId: "s6",
      repetitions: 5,
      pauseLength: 2,
      pauseLengthUnitId: "r6",
    },
  ],
};
