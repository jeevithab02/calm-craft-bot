import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type StreakData = {
  current_streak: number;
  longest_streak: number;
  last_check_in: string | null;
};

const STREAK_MILESTONES = [3, 5, 7, 14, 30];

const MILESTONE_REWARDS: Record<number, { emoji: string; message: string }> = {
  3: { emoji: "🌱", message: "You're building momentum! Keep growing!" },
  5: { emoji: "🌟", message: "Amazing! You're shining bright!" },
  7: { emoji: "🔥", message: "One week strong! You're on fire!" },
  14: { emoji: "💎", message: "Two weeks of dedication! You're precious!" },
  30: { emoji: "👑", message: "One month champion! You're royalty!" },
};

export const useStreak = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    current_streak: 0,
    longest_streak: 0,
    last_check_in: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStreak();
  }, []);

  const loadStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading streak:", error);
      return;
    }

    if (data) {
      setStreakData({
        current_streak: data.current_streak,
        longest_streak: data.longest_streak,
        last_check_in: data.last_check_in,
      });
    }
  };

  const updateStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    
    // Check if already checked in today
    if (streakData.last_check_in === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = 1;
    
    if (streakData.last_check_in === yesterdayStr) {
      newStreak = streakData.current_streak + 1;
    }

    const newLongest = Math.max(newStreak, streakData.longest_streak);

    const { error } = await supabase
      .from("user_streaks")
      .upsert({
        user_id: user.id,
        current_streak: newStreak,
        longest_streak: newLongest,
        last_check_in: today,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error updating streak:", error);
      return;
    }

    setStreakData({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_check_in: today,
    });

    // Check if milestone reached
    if (STREAK_MILESTONES.includes(newStreak)) {
      const reward = MILESTONE_REWARDS[newStreak];
      
      // Save reward
      await supabase.from("streak_rewards").insert({
        user_id: user.id,
        streak_day: newStreak,
        reward_type: "milestone",
        content: reward,
      });

      // Show toast
      toast({
        title: `🎉 ${newStreak} Day Streak!`,
        description: reward.message,
        duration: 5000,
      });
    }
  };

  return {
    ...streakData,
    updateStreak,
    loadStreak,
  };
};
