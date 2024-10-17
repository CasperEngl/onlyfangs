import { getPlayerClass, getPlayerRace } from "~/db";
import { pool } from "~/db/client";
import { WowRandomizer } from "~/components/wow-randomizer";
import { auth } from "~/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  console.log("app.tsx: session", session);

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const playerClass = await getPlayerClass(pool, {
    id: Number(session.user.id),
  });
  const playerRace = await getPlayerRace(pool, {
    id: Number(session.user.id),
  });

  return (
    <WowRandomizer
      playerClass={playerClass?.slug}
      playerRace={playerRace?.slug}
    />
  );
}
