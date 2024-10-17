"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import { toast } from "sonner";
import { selectRandomClass, selectRandomRace } from "~/app/actions";
import { raceClassCombos } from "~/app/race-class-combos";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function WowRandomizer(props: {
  playerClass?: string | null;
  playerRace?: string | null;
}) {
  const [selectedRace, setSelectedRace] = useState<string | null>(
    props.playerRace ?? null
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(
    props.playerClass ?? null
  );
  const [showRaceConfetti, setShowRaceConfetti] = useState(false);
  const [showClassConfetti, setShowClassConfetti] = useState(false);
  const raceCardRef = useRef<HTMLDivElement>(null);
  const classCardRef = useRef<HTMLDivElement>(null);

  const raceMutation = useMutation({
    mutationFn: selectRandomRace,
    onError: (error) => {
      console.error("Error selecting random race:", error);
      toast("Failed to select a random race. Please try again.");
    },
  });

  const classMutation = useMutation({
    mutationFn: selectRandomClass,
    onError: (error) => {
      console.error("Error selecting random class:", error);
      toast("Failed to select a random class. Please try again.");
    },
  });

  const randomizeRace = async () => {
    if (selectedRace !== null) {
      return;
    }

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
    if (selectedRace === null) {
      toast("Please select a race first.");
      return;
    }
    if (selectedClass !== null) {
      return;
    }

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
    <div className="min-h-screen bg-background bg-cover bg-center flex items-center justify-center">
      <div className="bg-card px-24 py-16 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-primary text-center mb-2">
          World of Warcraft
        </h1>
        <h2 className="text-6xl font-semibold text-secondary text-center mb-8">
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
              className={cn(
                "relative overflow-hidden group h-64 border-border bg-card",
                !selectedRace && "cursor-pointer hover:bg-accent"
              )}
              onClick={randomizeRace}
            >
              <div
                className={cn("absolute inset-0 bg-cover bg-center z-0", {
                  "transition-transform duration-300 group-hover:scale-110":
                    !selectedRace,
                })}
                style={{
                  backgroundImage:
                    selectedRace !== null
                      ? `url(/races/${selectedRace}.jpeg)`
                      : "none",
                }}
              />
              <div className="relative z-10 p-6 bg-card bg-opacity-75 h-full flex flex-col">
                <h2 className="text-2xl font-semibold text-secondary mb-4 text-center">
                  Race
                </h2>
                <div className="flex-grow flex items-center justify-center">
                  <span
                    className={`text-5xl font-bold ${
                      raceMutation.isPending
                        ? "text-[var(--wow-randomizing)]"
                        : "text-secondary"
                    }`}
                  >
                    {selectedRace
                      ? raceClassCombos.find(
                          (combo) => combo.slug === selectedRace
                        )?.name
                      : "?"}
                  </span>
                </div>
                <div
                  className={cn(
                    "mt-4 text-center text-foreground",
                    props.playerRace || raceMutation.isSuccess
                      ? "invisible"
                      : ""
                  )}
                >
                  {raceMutation.isPending
                    ? "Randomizing..."
                    : "Click to randomize"}
                </div>
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
              className={cn(
                "relative overflow-hidden group h-64 border-border bg-card",
                !selectedClass && "cursor-pointer hover:bg-accent"
              )}
              onClick={randomizeClass}
            >
              <div
                className={cn("absolute inset-0 bg-cover bg-center z-0", {
                  "transition-transform duration-300 group-hover:scale-110":
                    !selectedClass,
                })}
                style={{
                  backgroundImage:
                    selectedClass !== null
                      ? `url(/classes/${selectedClass}.jpg)`
                      : "none",
                }}
              />
              <div className="relative z-10 p-6 bg-card bg-opacity-75 h-full flex flex-col">
                <h2 className="text-2xl font-semibold text-secondary mb-4 text-center">
                  Class
                </h2>
                <div className="flex-grow flex items-center justify-center">
                  <span
                    className={`text-5xl font-bold ${
                      classMutation.isPending
                        ? "text-[var(--wow-randomizing)]"
                        : "text-secondary"
                    }`}
                  >
                    {selectedClass
                      ? raceClassCombos
                          .flatMap((race) => race.classes)
                          .find((c) => c.slug === selectedClass)?.name ?? "?"
                      : "?"}
                  </span>
                </div>
                <div
                  className={cn(
                    "mt-4 text-center text-foreground",
                    props.playerRace || raceMutation.isSuccess
                      ? "invisible"
                      : ""
                  )}
                >
                  {classMutation.isPending
                    ? "Randomizing..."
                    : "Click to randomize"}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center text-muted-foreground text-sm">
          Need to reset your race/class selection? Contact an admin for
          assistance.
        </div>
      </div>
    </div>
  );
}
