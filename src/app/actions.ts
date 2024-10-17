"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  getClasses,
  getPlayerByInviteCode,
  getPlayerRace,
  getRaces,
  setPlayerClass,
  setPlayerRace,
} from "~/app/db";
import { pool } from "~/app/db/client";
import { raceClassCombos } from "~/app/race-class-combos";

export async function selectRandomRace() {
  const races = await getRaces(pool);
  if (races.length === 0) {
    throw new Error("No races available");
  }

  const randomRace =
    raceClassCombos[Math.floor(Math.random() * raceClassCombos.length)];
  if (!randomRace) {
    throw new Error("Failed to select a random race");
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const inviteCode = (await cookies()).get("invite_code")?.value;
  if (!inviteCode) {
    throw new Error("No invite code found");
  }

  const player = await getPlayerByInviteCode(pool, {
    code: inviteCode,
  });
  if (!player) {
    throw new Error("Invalid invite code");
  }

  const raceId = races.find((r) => r.slug === randomRace.slug)?.id;
  if (!raceId) {
    throw new Error("Selected race not found in database");
  }

  await setPlayerRace(pool, {
    id: player.id,
    raceId: raceId,
  });

  revalidatePath("/");

  return randomRace;
}

export async function selectRandomClass() {
  const inviteCode = (await cookies()).get("invite_code")?.value;

  if (!inviteCode) {
    throw new Error("No invite code found");
  }

  const player = await getPlayerByInviteCode(pool, {
    code: inviteCode,
  });

  if (!player) {
    throw new Error("Invalid invite code");
  }

  const race = await getPlayerRace(pool, {
    id: player.id,
  });

  if (!race) {
    throw new Error("Invalid race");
  }

  const selectedRace = raceClassCombos.find(
    (combo) => combo.slug === race.slug
  );

  const randomClass =
    selectedRace?.classes[
      Math.floor(Math.random() * selectedRace.classes.length)
    ];

  if (!randomClass) {
    throw new Error("Invalid class");
  }

  const classes = await getClasses(pool);

  if (classes.length === 0) {
    throw new Error("No classes available");
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const classId = classes.find((c) => c.slug === randomClass.slug)?.id;

  if (!classId) {
    throw new Error("Invalid class");
  }

  setPlayerClass(pool, {
    id: player.id,
    classId: classId,
  });

  revalidatePath("/");

  return randomClass;
}
