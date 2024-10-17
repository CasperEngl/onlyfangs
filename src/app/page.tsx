import { getPlayerClass, getPlayerRace } from "~/src/app/db";
import { pool } from "~/src/app/db/client";
import { WowRandomizer } from "~/src/components/wow-randomizer";

export default async function Home() {
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
