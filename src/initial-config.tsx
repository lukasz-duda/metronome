import type { AdvancedMetronomeConfig } from "./advanced-metronome";

export const initialConfig: AdvancedMetronomeConfig = {
  units: [
    {
      name: "b",
      description: "Beats.",
      length: 1,
      lengthUnit: "beat",
    },
    {
      name: "e1",
      description: "Exercise 1.",
      length: 2,
      lengthUnit: "b",
    },
    {
      name: "r1",
      description: "4 repetitions of exercise 1.",
      length: 4,
      lengthUnit: "e1",
    },
    {
      name: "s1",
      description: "Set of 4 repetitions of execrice 1.",
      length: 4,
      lengthUnit: "r1",
    },
    {
      name: "5s1",
      description: "5 sets of exercise 1.",
      length: 4,
      lengthUnit: "s1",
    },
  ],
  parts: [
    {
      id: "e1",
      name: "5 semitones up - 1st time",
      bpm: 100,
      length: 4,
      lengthUnit: "5s1",
    },
    {
      id: "p1",
      name: "Pause - 1st time",
      bpm: 100,
      length: 2,
      lengthUnit: "r1",
    },
    {
      id: "e1",
      name: "5 semitones up - 2nd time",
      bpm: 100,
      length: 4,
      lengthUnit: "5s1",
    },
    {
      id: "p1",
      name: "Pause - 2nd time",
      bpm: 100,
      length: 2,
      lengthUnit: "r1",
    },
  ],
};
