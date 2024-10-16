import { getPlayerClass, getPlayerRace } from "~/app/db";
import { pool } from "~/app/db/client";
import { WowRandomizer } from "~/components/wow-randomizer";

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
    ></WowRandomizer>
  );
}
