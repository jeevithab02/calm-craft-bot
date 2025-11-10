import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Play, Pause } from "lucide-react";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold");
            return 4;
          } else if (phase === "hold") {
            setPhase("exhale");
            return 4;
          } else {
            setPhase("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const phaseText = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  };

  const phaseColor = {
    inhale: "from-primary to-serene",
    hold: "from-serene to-secondary",
    exhale: "from-secondary to-primary",
  };

  return (
    <Card className="p-8 border-primary/20 shadow-soft text-center">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Wind className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">Breathing Exercise</h2>
      </div>

      <div className="relative w-48 h-48 mx-auto mb-8">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColor[phase]} ${
            isActive ? "animate-breathe" : ""
          } transition-all duration-1000`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2">{countdown}</div>
            <div className="text-xl text-white font-medium">{phaseText[phase]}</div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">
        Follow the breathing pattern: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds.
      </p>

      <Button
        onClick={() => {
          setIsActive(!isActive);
          if (!isActive) {
            setPhase("inhale");
            setCountdown(4);
          }
        }}
        className="bg-gradient-to-r from-primary to-serene hover:shadow-glow"
        size="lg"
      >
        {isActive ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start
          </>
        )}
      </Button>
    </Card>
  );
};

export default BreathingExercise;