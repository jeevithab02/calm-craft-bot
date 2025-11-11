import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Home, Smile, Frown, Meh, Heart, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useStreak } from "@/hooks/useStreak";
import { useTreasureBox } from "@/hooks/useTreasureBox";
import { TreasureBox } from "@/components/TreasureBox";

type MoodData = {
  emotion: string;
  count: number;
};

const Mood = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [recentMoods, setRecentMoods] = useState<any[]>([]);
  const [treasureContent, setTreasureContent] = useState<any>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canUnlock, unlockTreasureBox } = useTreasureBox();
  const { updateStreak } = useStreak();
  const { recordTask } = useTreasureBox();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to view mood tracking.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    loadMoodData();
  };

  const loadMoodData = async () => {
    // Get mood counts
    const { data, error } = await supabase
      .from("mood_tracking")
      .select("emotion")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading mood data:", error);
      return;
    }

    // Count emotions
    const emotionCounts = data.reduce((acc: Record<string, number>, curr) => {
      acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
      return acc;
    }, {});

    const moodArray = Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count: count as number,
    })).sort((a, b) => b.count - a.count);

    setMoodData(moodArray);

    // Get recent moods
    const { data: recent } = await supabase
      .from("mood_tracking")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(7);

    setRecentMoods(recent || []);
  };

  const emotionEmoji = (emotion: string) => {
    const emojis: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      angry: "😠",
      calm: "😌",
      stressed: "😓",
      neutral: "😐",
    };
    return emojis[emotion] || "😐";
  };

  const emotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-green-500",
      sad: "bg-blue-500",
      anxious: "bg-yellow-500",
      angry: "bg-red-500",
      calm: "bg-primary",
      stressed: "bg-orange-500",
      neutral: "bg-muted",
    };
    return colors[emotion] || colors.neutral;
  };

  const handleUnlockTreasure = async () => {
    const content = await unlockTreasureBox();
    setTreasureContent(content);
  };

  const handleSubmitMood = async () => {
    if (!selectedEmotion) {
      toast({
        title: "Please select an emotion",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Save mood tracking
      await supabase.from("mood_tracking").insert({
        user_id: user.id,
        emotion: selectedEmotion,
        intensity,
        notes: notes.trim() || null,
      });

      // Create polaroid
      const emotionEmojis: Record<string, string> = {
        happy: "😊", sad: "😢", anxious: "😰", angry: "😠",
        calm: "😌", stressed: "😓", neutral: "😐",
      };
      
      await supabase.from("mood_polaroids").insert({
        user_id: user.id,
        emotion: selectedEmotion,
        note: notes.trim() || `Intensity: ${intensity}/10`,
        emoji: emotionEmojis[selectedEmotion] || "😐",
      });

      // Update streak and record task
      await updateStreak();
      await recordTask("mood");

      toast({
        title: "Mood tracked!",
        description: "Your mood has been recorded successfully.",
      });

      setSelectedEmotion(null);
      setIntensity(5);
      setNotes("");
      loadMoodData();
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({
        title: "Error",
        description: "Failed to save mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  const emotions = [
    { name: "happy", emoji: "😊", color: "from-green-400 to-green-600" },
    { name: "sad", emoji: "😢", color: "from-blue-400 to-blue-600" },
    { name: "anxious", emoji: "😰", color: "from-yellow-400 to-yellow-600" },
    { name: "angry", emoji: "😠", color: "from-red-400 to-red-600" },
    { name: "calm", emoji: "😌", color: "from-primary to-serene" },
    { name: "stressed", emoji: "😓", color: "from-orange-400 to-orange-600" },
    { name: "neutral", emoji: "😐", color: "from-muted to-muted-foreground" },
  ];

  const totalMoods = moodData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mood Tracker</h1>
              <p className="text-sm text-muted-foreground">Visualize your emotional journey</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/mood-memories")}>
              <Image className="w-4 h-4 mr-2" />
              Mood Memories
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        {/* Manual Mood Entry */}
        <Card className="mb-8 p-6 border-primary/20 shadow-soft">
          <h2 className="text-xl font-semibold mb-6 text-foreground">How are you feeling?</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
              {emotions.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => setSelectedEmotion(emotion.name)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 ${
                    selectedEmotion === emotion.name
                      ? `bg-gradient-to-br ${emotion.color} shadow-glow`
                      : "bg-card border border-border hover:border-primary/30"
                  }`}
                >
                  <span className="text-3xl">{emotion.emoji}</span>
                  <span className={`text-xs capitalize ${
                    selectedEmotion === emotion.name ? "text-white font-medium" : "text-muted-foreground"
                  }`}>
                    {emotion.name}
                  </span>
                </button>
              ))}
            </div>

            {selectedEmotion && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Intensity: {intensity}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Notes (optional)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's on your mind?"
                    className="min-h-[100px] resize-none border-primary/20 focus:border-primary"
                  />
                </div>

                <Button
                  onClick={handleSubmitMood}
                  className="w-full bg-gradient-to-r from-primary to-serene hover:shadow-glow"
                  size="lg"
                >
                  Save Mood
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Treasure Box */}
        <div className="mb-8">
          <TreasureBox
            canUnlock={canUnlock}
            onUnlock={handleUnlockTreasure}
            content={treasureContent}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mood Distribution */}
          <Card className="p-6 border-primary/20 shadow-soft">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Emotion Distribution</h2>
            
            {moodData.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No mood data yet. Start chatting or journaling!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {moodData.map((item) => {
                  const percentage = ((item.count / totalMoods) * 100).toFixed(1);
                  return (
                    <div key={item.emotion} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{emotionEmoji(item.emotion)}</span>
                          <span className="font-medium capitalize text-foreground">{item.emotion}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.count} times ({percentage}%)
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${emotionColor(item.emotion)} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Moods */}
          <Card className="p-6 border-primary/20 shadow-soft">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Recent Moods</h2>
            
            {recentMoods.length === 0 ? (
              <div className="text-center py-12">
                <Meh className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No recent mood entries</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMoods.map((mood) => (
                  <div
                    key={mood.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-all animate-fade-in"
                  >
                    <span className="text-3xl">{emotionEmoji(mood.emotion)}</span>
                    <div className="flex-1">
                      <div className="font-medium capitalize text-foreground">{mood.emotion}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(mood.created_at).toLocaleString()}
                      </div>
                      {mood.notes && (
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {mood.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Insights */}
        {moodData.length > 0 && (
          <Card className="mt-8 p-6 border-primary/20 shadow-soft">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Insights</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                📊 You've tracked <strong className="text-foreground">{totalMoods}</strong> moods so far.
              </p>
              {moodData[0] && (
                <p>
                  {emotionEmoji(moodData[0].emotion)} Your most common emotion is{" "}
                  <strong className="text-foreground capitalize">{moodData[0].emotion}</strong>{" "}
                  ({((moodData[0].count / totalMoods) * 100).toFixed(1)}% of the time).
                </p>
              )}
              <p className="text-sm">
                💡 Keep tracking your moods to discover patterns and better understand your emotional wellbeing.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Mood;