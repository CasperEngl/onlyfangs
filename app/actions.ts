"use server";

import { raceClassCombos } from "~/app/race-class-combos";

export async function selectRandomRace() {
  const randomRace =
    raceClassCombos[Math.floor(Math.random() * raceClassCombos.length)];

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return randomRace;
}

export async function selectRandomClass() {
  const race =
    raceClassCombos[Math.floor(Math.random() * raceClassCombos.length)];
  const randomClass =
    race.classes[Math.floor(Math.random() * race.classes.length)];

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return randomClass;
}
