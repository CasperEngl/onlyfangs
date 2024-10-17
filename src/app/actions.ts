"use server";

import invariant from "invariant";
import { revalidatePath } from "next/cache";
import "server-only";
import { raceClassCombos } from "~/app/race-class-combos";
import { auth } from "~/auth";
import {
  createInviteCode,
  createPlayer,
  getClasses,
  getPlayerById,
  getPlayerRace,
  getRaces,
  setPlayerClass,
  setPlayerRace,
} from "~/db";
import { pool } from "~/db/client";

export async function selectRandomRace() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("No session found");
  }

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

  const player = await getPlayerById(pool, {
    id: Number(session.user?.id),
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
  const session = await auth();
  if (!session?.user) {
    throw new Error("No session found");
  }

  const player = await getPlayerById(pool, {
    id: Number(session.user?.id),
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

export async function inviteParticipant(data: {
  name: string;
  inviteCode: string;
}) {
  const createdInviteCode = await createInviteCode(pool, {
    code: data.inviteCode,
  });
  invariant(createdInviteCode, "Failed to create invite code");

  const createdPlayer = await createPlayer(pool, {
    name: data.name,
    code: data.inviteCode,
    raceId: null,
    classId: null,
  });
  invariant(createdPlayer, "Failed to create player");

  revalidatePath("/");
}
