import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import PhotoEmotionDetector from "@/components/PhotoEmotionDetector";

const EmotionDetect = () => {
  const navigate = useNavigate();

  const handleEmotionDetected = (emotion: string, confidence: number) => {
    // Navigate to emotion response screen first
    navigate('/emotion-response', { state: { emotion, confidence } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Detect Your Emotion</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="bg-card rounded-lg shadow-elegant p-8 border border-border">
          <p className="text-muted-foreground mb-6 text-center">
            Take a photo or upload an image to detect your current emotion
          </p>
          <PhotoEmotionDetector onEmotionDetected={handleEmotionDetected} />
        </div>
      </div>
    </div>
  );
};

export default EmotionDetect;
