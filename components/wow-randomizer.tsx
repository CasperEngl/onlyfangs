"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import { selectRandomClass, selectRandomRace } from "~/app/actions";
import { raceClassCombos } from "~/app/race-class-combos";
import { Card } from "~/components/ui/card";

export function WowRandomizer() {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showRaceConfetti, setShowRaceConfetti] = useState(false);
  const [showClassConfetti, setShowClassConfetti] = useState(false);
  const raceCardRef = useRef<HTMLDivElement>(null);
  const classCardRef = useRef<HTMLDivElement>(null);

  const raceMutation = useMutation({
    mutationFn: selectRandomRace,
    onError: (error) => {
      console.error("Error selecting random race:", error);
    },
  });

  const classMutation = useMutation({
    mutationFn: selectRandomClass,
    onError: (error) => {
      console.error("Error selecting random class:", error);
    },
  });

  const randomizeRace = async () => {
    const interval = 100;
    const animationInterval = setInterval(() => {
      const randomRace =
        raceClassCombos[Math.floor(Math.random() * raceClassCombos.length)]
          .slug;
      setSelectedRace(randomRace);
    }, interval);

    raceMutation.mutate(undefined, {
      onSuccess: (data) => {
        setShowRaceConfetti(true);
        setTimeout(() => setShowRaceConfetti(false), 3000);

        clearInterval(animationInterval);
        setSelectedRace(data.slug);
      },
    });
  };

  const randomizeClass = () => {
    const interval = 100;
    const animationInterval = setInterval(() => {
      const randomClass =
        availableClasses[Math.floor(Math.random() * availableClasses.length)] ||
        null;
      setSelectedClass(randomClass ? randomClass.slug : null);
    }, interval);

    const selectedRaceCombo = raceClassCombos.find(
      (combo) => combo.slug === selectedRace
    );
    const availableClasses = selectedRaceCombo ? selectedRaceCombo.classes : [];

    classMutation.mutate(undefined, {
      onSuccess: (data) => {
        setShowClassConfetti(true);
        setTimeout(() => setShowClassConfetti(false), 3000);

        clearInterval(animationInterval);
        setSelectedClass(data.slug);
      },
    });
  };

  return (
    <div className="min-h-screen bg-black bg-cover bg-center flex items-center justify-center">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-yellow-400 text-center mb-2">
          World of Warcraft
        </h1>
        <h2 className="text-6xl font-semibold text-purple-400 text-center mb-8">
          OnlyFangs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div ref={raceCardRef} className="relative">
            {showRaceConfetti && raceCardRef.current && (
              <div className="absolute inset-0 z-20">
                <ReactConfetti
                  width={raceCardRef.current.offsetWidth}
                  height={raceCardRef.current.offsetHeight}
                  recycle={false}
                  numberOfPieces={200}
                  confettiSource={{
                    x: 0,
                    y: 0,
                    w: raceCardRef.current.offsetWidth,
                    h: 0,
                  }}
                />
              </div>
            )}
            <Card
              className="relative overflow-hidden group cursor-pointer h-64 border-gray-500 hover:bg-gray-300"
              onClick={randomizeRace}
            >
              <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundImage:
                    selectedRace !== null
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
                      raceMutation.isPending ? "text-green-400" : "text-white"
                    }`}
                  >
                    {selectedRace
                      ? raceClassCombos.find(
                          (combo) => combo.slug === selectedRace
                        )?.name
                      : "?"}
                  </span>
                </div>
                {!raceMutation.isSuccess && (
                  <div className="mt-4 text-center text-white">
                    {raceMutation.isPending
                      ? "Randomizing..."
                      : "Click to randomize"}
                  </div>
                )}
              </div>
            </Card>
          </div>
          <div ref={classCardRef} className="relative">
            {showClassConfetti && classCardRef.current && (
              <div className="absolute inset-0 z-20">
                <ReactConfetti
                  width={classCardRef.current.offsetWidth}
                  height={classCardRef.current.offsetHeight}
                  recycle={false}
                  numberOfPieces={200}
                  confettiSource={{
                    x: 0,
                    y: 0,
                    w: classCardRef.current.offsetWidth,
                    h: 0,
                  }}
                />
              </div>
            )}
            <Card
              className="relative overflow-hidden group cursor-pointer h-64 border-gray-500 hover:bg-gray-300"
              onClick={randomizeClass}
            >
              <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundImage:
                    selectedClass !== null
                      ? `url(/classes/${selectedClass}.jpg)`
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
                      classMutation.isPending ? "text-green-400" : "text-white"
                    }`}
                  >
                    {selectedClass
                      ? raceClassCombos
                          .flatMap((race) => race.classes)
                          .find((c) => c.slug === selectedClass)?.name ?? "?"
                      : "?"}
                  </span>
                </div>
                {!classMutation.isSuccess && (
                  <div className="mt-4 text-center text-white">
                    {classMutation.isPending
                      ? "Randomizing..."
                      : "Click to randomize"}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
