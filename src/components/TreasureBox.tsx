import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles } from "lucide-react";

type TreasureBoxProps = {
  canUnlock: boolean;
  onUnlock: () => void;
  content?: {
    quote: string;
    exercise: string;
    prompt: string;
    collectible: string;
  };
};

export const TreasureBox = ({ canUnlock, onUnlock, content }: TreasureBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (canUnlock && !isOpen) {
      setIsOpen(true);
      onUnlock();
    }
  };

  return (
    <Card className={`p-6 transition-all duration-500 ${
      isOpen 
        ? "bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-primary shadow-glow animate-scale-in" 
        : "bg-card border-border"
    }`}>
      {!isOpen ? (
        <div className="text-center space-y-4">
          <Gift className={`w-16 h-16 mx-auto ${canUnlock ? "text-primary animate-bounce" : "text-muted-foreground"}`} />
          <h3 className="text-xl font-semibold text-foreground">Self-Care Treasure Box</h3>
          <p className="text-sm text-muted-foreground">
            {canUnlock 
              ? "You've completed 5 tasks this week! Open your treasure box!" 
              : "Complete 5 tasks this week to unlock your treasure box"}
          </p>
          <Button 
            onClick={handleOpen} 
            disabled={!canUnlock}
            className="mt-4"
          >
            {canUnlock ? "Open Box" : "Locked"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-semibold text-foreground">Your Treasures!</h3>
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          
          {content && (
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="text-xs font-semibold text-primary mb-1">Quote</div>
                <p className="text-sm text-foreground italic">"{content.quote}"</p>
              </div>
              
              <div className="p-3 bg-secondary/10 rounded-lg">
                <div className="text-xs font-semibold text-secondary mb-1">Grounding Exercise</div>
                <p className="text-sm text-foreground">{content.exercise}</p>
              </div>
              
              <div className="p-3 bg-accent/10 rounded-lg">
                <div className="text-xs font-semibold text-accent mb-1">Journal Prompt</div>
                <p className="text-sm text-foreground">{content.prompt}</p>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-lavender to-mint rounded-lg text-center">
                <div className="text-xs font-semibold text-foreground mb-1">Digital Collectible</div>
                <p className="text-2xl">{content.collectible}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
