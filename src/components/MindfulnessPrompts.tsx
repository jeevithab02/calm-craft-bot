import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Wind, ListChecks, Sparkles, RefreshCw } from "lucide-react";

interface MindfulnessPromptsProps {
  onSelectTool?: (tool: string) => void;
}

const MindfulnessPrompts = ({ onSelectTool }: MindfulnessPromptsProps) => {
  // If onSelectTool is provided, show CBT tools. Otherwise show affirmations
  const isCBTMode = !!onSelectTool;

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

  const tools = [
    {
      id: "thought-reframing",
      icon: Brain,
      title: "Thought Reframing",
      description: "Transform negative thoughts into balanced perspectives",
      color: "from-lavender to-lavender-bright"
    },
    {
      id: "grounding",
      icon: ListChecks,
      title: "5-4-3-2-1 Grounding",
      description: "Ground yourself in the present moment",
      color: "from-lavender-mist to-lavender"
    },
    {
      id: "breathing",
      icon: Wind,
      title: "Breathing Guide",
      description: "Calm your mind with guided breathing",
      color: "from-peaceful to-serene"
    },
    {
      id: "emotion-tracker",
      icon: Sparkles,
      title: "Emotion Tracker",
      description: "Track and understand your emotional patterns",
      color: "from-calm to-lavender"
    }
  ];

  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  };

  useEffect(() => {
    if (!isCBTMode) {
      getRandomPrompt();
    }
  }, []);

  const typeColors: Record<string, string> = {
    Affirmation: "from-lavender to-lavender-bright",
    Grounding: "from-serene to-secondary",
    Gratitude: "from-secondary to-lavender",
    Reflection: "from-lavender/80 to-lavender-bright/80",
  };

  if (isCBTMode) {
    // CBT Tools Mode
    return (
      <div className="grid grid-cols-2 gap-3 my-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className="p-4 hover:shadow-lavender-glow transition-all cursor-pointer border-lavender/20 bg-card/90 backdrop-blur-sm"
              onClick={() => onSelectTool!(tool.id)}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">{tool.title}</h3>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </Card>
          );
        })}
      </div>
    );
  }

  // Affirmations Mode
  return (
    <Card className="p-6 border-lavender/20 shadow-lavender-glow animate-fade-in bg-card/90 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-lavender" />
          <h3 className="text-lg font-semibold text-foreground">Daily Mindfulness</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={getRandomPrompt}
          className="text-lavender hover:text-lavender/80"
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
