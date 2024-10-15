"use client";

import { useState } from "react";
import { Card } from "~/components/ui/card";

const raceClassCombos = [
  {
    name: "Orc",
    slug: "orc",
    classes: [
      { name: "Warrior", slug: "warrior" },
      { name: "Hunter", slug: "hunter" },
      { name: "Rogue", slug: "rogue" },
      { name: "Shaman", slug: "shaman" },
      { name: "Warlock", slug: "warlock" },
    ],
  },
  {
    name: "Undead",
    slug: "undead",
    classes: [
      { name: "Warrior", slug: "warrior" },
      { name: "Rogue", slug: "rogue" },
      { name: "Priest", slug: "priest" },
      { name: "Mage", slug: "mage" },
      { name: "Warlock", slug: "warlock" },
    ],
  },
  {
    name: "Tauren",
    slug: "tauren",
    classes: [
      { name: "Warrior", slug: "warrior" },
      { name: "Hunter", slug: "hunter" },
      { name: "Shaman", slug: "shaman" },
      { name: "Druid", slug: "druid" },
    ],
  },
  {
    name: "Troll",
    slug: "troll",
    classes: [
      { name: "Warrior", slug: "warrior" },
      { name: "Hunter", slug: "hunter" },
      { name: "Rogue", slug: "rogue" },
      { name: "Priest", slug: "priest" },
      { name: "Shaman", slug: "shaman" },
      { name: "Mage", slug: "mage" },
    ],
  },
];

export function WowRandomizer() {
  const [selectedRace, setSelectedRace] = useState<string>("?");
  const [selectedClass, setSelectedClass] = useState<{
    name: string;
    slug: string;
  } | null>(null);
  const [isRaceAnimating, setIsRaceAnimating] = useState(false);
  const [isClassAnimating, setIsClassAnimating] = useState(false);

  const randomizeRace = () => {
    setIsRaceAnimating(true);
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const animation = setInterval(() => {
      const randomRace =
        raceClassCombos[Math.floor(Math.random() * raceClassCombos.length)]
          .slug;
      setSelectedRace(randomRace);
      step++;
      if (step >= steps) {
        clearInterval(animation);
        const finalRace =
          raceClassCombos[Math.floor(Math.random() * raceClassCombos.length)]
            .slug;
        setSelectedRace(finalRace);
        setIsRaceAnimating(false);
      }
    }, interval);
  };

  const randomizeClass = () => {
    setIsClassAnimating(true);
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const animation = setInterval(() => {
      const selectedRaceCombo = raceClassCombos.find(
        (combo) => combo.slug === selectedRace
      );
      const availableClasses = selectedRaceCombo
        ? selectedRaceCombo.classes
        : [];
      const randomClass =
        availableClasses[Math.floor(Math.random() * availableClasses.length)] ||
        null;
      setSelectedClass(randomClass);
      step++;
      if (step >= steps) {
        clearInterval(animation);
        const finalClass =
          availableClasses[
            Math.floor(Math.random() * availableClasses.length)
          ] || null;
        setSelectedClass(finalClass);
        setIsClassAnimating(false);
      }
    }, interval);
  };

  return (
    <div className="min-h-screen bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">
          World of Warcraft Randomizer
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className="relative overflow-hidden group cursor-pointer"
            onClick={randomizeRace}
          >
            <div
              className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundImage:
                  selectedRace !== "?"
                    ? `url(/races/${selectedRace}.jpeg)`
                    : "none",
              }}
            />
            <div className="relative z-10 p-6 bg-gray-800 bg-opacity-80 h-full flex flex-col">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4 text-center">
                Race
              </h2>
              <div className="flex-grow flex items-center justify-center">
                <span
                  className={`text-5xl font-bold ${
                    isRaceAnimating ? "text-green-400" : "text-white"
                  }`}
                >
                  {raceClassCombos.find((combo) => combo.slug === selectedRace)
                    ?.name ?? "?"}
                </span>
              </div>
              <div className="mt-4 text-center text-white">
                {isRaceAnimating ? "Randomizing..." : "Click to randomize"}
              </div>
            </div>
          </Card>
          <Card
            className="relative overflow-hidden group cursor-pointer"
            onClick={randomizeClass}
          >
            <div
              className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundImage:
                  selectedClass !== null
                    ? `url(/classes/${selectedClass.slug}.jpg)`
                    : "none",
              }}
            />
            <div className="relative z-10 p-6 bg-gray-800 bg-opacity-80 h-full flex flex-col">
              <h2 className="text-2xl font-semibold text-purple-400 mb-4 text-center">
                Class
              </h2>
              <div className="flex-grow flex items-center justify-center">
                <span
                  className={`text-5xl font-bold ${
                    isClassAnimating ? "text-green-400" : "text-white"
                  }`}
                >
                  {selectedClass ? selectedClass.name : "?"}
                </span>
              </div>
              <div className="mt-4 text-center text-white">
                {isClassAnimating ? "Randomizing..." : "Click to randomize"}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
