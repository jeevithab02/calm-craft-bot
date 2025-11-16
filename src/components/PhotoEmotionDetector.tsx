import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhotoEmotionDetectorProps {
  onEmotionDetected?: (emotion: string, confidence: number) => void;
}

const PhotoEmotionDetector = ({ onEmotionDetected }: PhotoEmotionDetectorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const processImage = async (imageDataUrl: string, source: 'photo_upload' | 'camera_capture') => {
    setIsProcessing(true);
    setDetectedEmotion(null);
    setConfidence(null);

    try {
      const { data, error } = await supabase.functions.invoke('detect-emotion-from-image', {
        body: { image: imageDataUrl }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      const { emotion, confidence: conf } = data;
      setDetectedEmotion(emotion);
      setConfidence(conf);

      // Log to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('emotion_logs').insert({
          user_id: user.id,
          emotion,
          confidence: conf,
          source,
          image_url: null, // Not storing image for now due to size limitations
        });
      }

      if (onEmotionDetected) {
        onEmotionDetected(emotion, conf);
      }

      toast({
        title: "Emotion detected",
        description: `You appear to be ${emotion} (${Math.round(conf * 100)}% confidence)`,
      });

    } catch (error: any) {
      console.error('Error processing image:', error);
      toast({
        title: "Detection failed",
        description: error.message || "Could not determine emotion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      await processImage(imageDataUrl, 'photo_upload');
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera access denied",
        description: "Please enable camera access to capture photos",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      await processImage(imageDataUrl, 'camera_capture');
    }
  };

  const emotionEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    anxious: "😰",
    stressed: "😓",
    disgusted: "🤢",
    surprised: "😲",
    neutral: "😐",
  };

  return (
    <Card className="p-4 border-primary/20">
      <h3 className="text-lg font-semibold mb-4">Emotion Detection</h3>
      
      {isCameraActive ? (
        <div className="space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="flex gap-2">
            <Button onClick={capturePhoto} disabled={isProcessing} className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
            <Button onClick={stopCamera} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={startCamera} disabled={isProcessing} className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Use Camera
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              variant="outline"
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Analyzing emotion...</span>
        </div>
      )}

      {detectedEmotion && confidence && !isProcessing && (
        <div className="mt-4 p-4 bg-gradient-to-br from-primary/10 to-serene/10 rounded-lg text-center">
          <div className="text-4xl mb-2">{emotionEmojis[detectedEmotion]}</div>
          <div className="text-lg font-semibold capitalize">{detectedEmotion}</div>
          <div className="text-sm text-muted-foreground">
            Confidence: {Math.round(confidence * 100)}%
          </div>
        </div>
      )}
    </Card>
  );
};

export default PhotoEmotionDetector;
