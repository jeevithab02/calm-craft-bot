import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music } from "lucide-react";
import { useEffect } from "react";

const EmotionResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { emotion, confidence } = location.state || {};

  useEffect(() => {
    if (!emotion) {
      navigate("/emotion-detect");
    }
  }, [emotion, navigate]);

  const emotionData: Record<string, { message: string; emoji: string; music: string[] }> = {
    happy: {
      message: "You look cheerful today! Amazing energy!",
      emoji: "😊",
      music: ["Happy Vibes - Lofi", "Sunshine Melody", "Upbeat Energy Mix"],
    },
    sad: {
      message: "Looks like you're feeling low. Want some comfort?",
      emoji: "😢",
      music: ["Comfort Lofi", "Gentle Piano", "Uplifting Acoustic"],
    },
    anxious: {
      message: "I sense tension. Let's breathe together.",
      emoji: "😰",
      music: ["Calm Waves", "Breathing Space Lofi", "Peaceful Ambient"],
    },
    stressed: {
      message: "You seem a bit overwhelmed. I'm here for you.",
      emoji: "😓",
      music: ["Relaxing Piano", "Stress Relief Soundscape", "Calm Down Mix"],
    },
    angry: {
      message: "You seem upset. Let's try something calming.",
      emoji: "😠",
      music: ["Cooling Down Mix", "Calm Waters", "Soothing Nature Sounds"],
    },
    neutral: {
      message: "You seem balanced today. That's great!",
      emoji: "😐",
      music: ["Chill Vibes", "Easy Listening", "Background Lofi"],
    },
  };

  const data = emotionData[emotion?.toLowerCase()] || emotionData.neutral;

  const handleContinue = () => {
    navigate("/chat", { state: { detectedEmotion: emotion } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-lavender-mist to-lavender-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card/90 backdrop-blur-sm border-lavender shadow-lavender-glow animate-fade-in">
        <div className="text-center space-y-6">
          <div className="text-8xl mb-4 animate-scale-in">{data.emoji}</div>
          
          <h2 className="text-2xl font-bold text-foreground capitalize">
            Feeling {emotion}
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {data.message}
          </p>

          {confidence && (
            <p className="text-sm text-muted-foreground">
              Confidence: {Math.round(confidence * 100)}%
            </p>
          )}

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2 text-lavender font-semibold">
              <Music className="w-5 h-5" />
              <span>Music Suggestions</span>
            </div>
            {data.music.map((track, idx) => (
              <div
                key={idx}
                className="p-3 bg-lavender-mist/30 rounded-lg border border-lavender/20 text-sm text-foreground hover:bg-lavender-mist/50 transition-all"
              >
                {track}
              </div>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full mt-6 bg-gradient-to-r from-lavender to-lavender-bright hover:shadow-lavender-glow transition-all"
            size="lg"
          >
            Continue to Chat
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmotionResponse;
