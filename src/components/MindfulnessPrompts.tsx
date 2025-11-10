import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

const MindfulnessPrompts = () => {
  const prompts = [
    {
      type: "Affirmation",
      text: "I am worthy of love, peace, and happiness.",
    },
    {
      type: "Affirmation",
      text: "I choose to let go of what I cannot control.",
    },
    {
      type: "Affirmation",
      text: "I am doing my best, and that is enough.",
    },
    {
      type: "Affirmation",
      text: "I deserve to take care of myself.",
    },
    {
      type: "Grounding",
      text: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    },
    {
      type: "Grounding",
      text: "Take three deep breaths. Notice how your chest rises and falls.",
    },
    {
      type: "Grounding",
      text: "Place your feet flat on the floor. Feel the ground supporting you.",
    },
    {
      type: "Gratitude",
      text: "Think of three things you're grateful for today, no matter how small.",
    },
    {
      type: "Gratitude",
      text: "Recall a moment this week that made you smile.",
    },
    {
      type: "Reflection",
      text: "What is one kind thing you can do for yourself today?",
    },
    {
      type: "Reflection",
      text: "What would you tell a friend who is feeling the way you feel right now?",
    },
  ];

  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  };

  useEffect(() => {
    getRandomPrompt();
  }, []);

  const typeColors: Record<string, string> = {
    Affirmation: "from-primary to-serene",
    Grounding: "from-serene to-secondary",
    Gratitude: "from-secondary to-primary",
    Reflection: "from-primary/80 to-secondary/80",
  };

  return (
    <Card className="p-6 border-primary/20 shadow-soft animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Daily Mindfulness</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={getRandomPrompt}
          className="text-primary hover:text-primary/80"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className={`p-6 rounded-lg bg-gradient-to-br ${typeColors[currentPrompt.type]} mb-4`}>
        <p className="text-white text-center text-lg leading-relaxed">
          {currentPrompt.text}
        </p>
      </div>

      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {currentPrompt.type} • Click refresh for another
        </span>
      </div>
    </Card>
  );
};

export default MindfulnessPrompts;
