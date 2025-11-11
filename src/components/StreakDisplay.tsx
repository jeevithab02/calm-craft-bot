import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

type StreakDisplayProps = {
  currentStreak: number;
  longestStreak: number;
};

export const StreakDisplay = ({ currentStreak, longestStreak }: StreakDisplayProps) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 border-primary/30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Flame className="w-8 h-8 text-accent animate-pulse" />
          <div>
            <div className="text-2xl font-bold text-foreground">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-lg font-semibold text-foreground">{longestStreak}</div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </div>
      </div>
    </Card>
  );
};
