import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const TREASURE_QUOTES = [
  "You are stronger than you think",
  "Every small step counts",
  "Your feelings are valid",
  "You deserve peace and happiness",
  "Progress, not perfection",
];

const TREASURE_EXERCISES = [
  "Take 3 deep breaths, focusing on the present moment",
  "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
  "Place your hand on your heart and breathe slowly for 1 minute",
  "Visualize a safe, peaceful place for 2 minutes",
  "Do a gentle body scan from head to toe",
];

const TREASURE_PROMPTS = [
  "What made you smile today?",
  "Write about someone who makes you feel supported",
  "What's one thing you're grateful for right now?",
  "Describe a moment when you felt proud of yourself",
  "What would you tell your younger self?",
];

const TREASURE_COLLECTIBLES = ["🌈", "✨", "🦋", "🌸", "🌟", "💫", "🎨", "🌺", "🎭", "🎪"];

export const useTreasureBox = () => {
  const [canUnlock, setCanUnlock] = useState(false);
  const [weeklyTaskCount, setWeeklyTaskCount] = useState(0);

  useEffect(() => {
    checkWeeklyTasks();
  }, []);

  const checkWeeklyTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count, error } = await supabase
      .from("user_tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("completed_at", oneWeekAgo.toISOString());

    if (error) {
      console.error("Error checking tasks:", error);
      return;
    }

    setWeeklyTaskCount(count || 0);
    setCanUnlock((count || 0) >= 5);
  };

  const recordTask = async (taskType: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_tasks").insert({
      user_id: user.id,
      task_type: taskType,
    });

    await checkWeeklyTasks();
  };

  const unlockTreasureBox = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const content = {
      quote: TREASURE_QUOTES[Math.floor(Math.random() * TREASURE_QUOTES.length)],
      exercise: TREASURE_EXERCISES[Math.floor(Math.random() * TREASURE_EXERCISES.length)],
      prompt: TREASURE_PROMPTS[Math.floor(Math.random() * TREASURE_PROMPTS.length)],
      collectible: TREASURE_COLLECTIBLES[Math.floor(Math.random() * TREASURE_COLLECTIBLES.length)],
    };

    await supabase.from("collectibles").insert({
      user_id: user.id,
      type: "treasure_box",
      content,
    });

    setCanUnlock(false);
    setWeeklyTaskCount(0);

    return content;
  };

  return {
    canUnlock,
    weeklyTaskCount,
    recordTask,
    unlockTreasureBox,
  };
};
