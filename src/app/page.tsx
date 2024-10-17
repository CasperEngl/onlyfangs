import { getPlayerClass, getPlayerRace } from "~/db";
import { pool } from "~/db/client";
import { WowRandomizer } from "~/components/wow-randomizer";
import { auth } from "~/auth";

export default async function Home() {
  const session = await auth();

  console.log("session", session);

  const playerClass = await getPlayerClass(pool, {
    id: 1,
  });
  const playerRace = await getPlayerRace(pool, {
    id: 1,
  });

  return (
    <WowRandomizer
      playerClass={playerClass?.slug}
      playerRace={playerRace?.slug}
    />
  );
}
