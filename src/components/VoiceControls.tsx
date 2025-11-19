import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
  textToSpeak?: string;
  isListening?: boolean;
}

const VoiceControls = ({ onTranscript, textToSpeak, isListening = false }: VoiceControlsProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          toast({
            title: "No speech detected",
            description: "Please try speaking again",
            variant: "destructive",
          });
        } else if (event.error === 'not-allowed') {
          toast({
            title: "Microphone access denied",
            description: "Please enable microphone access in your browser settings",
            variant: "destructive",
          });
        } else {
          // Auto-retry on other errors
          setTimeout(() => {
            if (isRecording) {
              startRecording();
            }
          }, 1000);
        }
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setAudioLevel(0);
      };
    }

    // Initialize Speech Synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (textToSpeak && isSpeaking) {
      speakText(textToSpeak);
    }
  }, [textToSpeak, isSpeaking]);

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately, just checking permission

      if (recognitionRef.current) {
        setIsRecording(true);
        recognitionRef.current.start();
        
        // Simulate audio level animation
        const interval = setInterval(() => {
          setAudioLevel(Math.random() * 100);
        }, 100);

        recognitionRef.current.onend = () => {
          clearInterval(interval);
          setAudioLevel(0);
        };
      }
    } catch (error) {
      console.error('Microphone access error:', error);
      toast({
        title: "Microphone access denied",
        description: "Please enable microphone access to use voice input",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text: string, voiceType: string = 'default') => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = synthRef.current.getVoices();
    
    // Select voice based on type
    let selectedVoice = null;
    if (voiceType === 'soft-female') {
      selectedVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'));
    } else if (voiceType === 'friendly') {
      selectedVoice = voices.find(v => v.name.includes('Google') && v.lang === 'en-US');
    } else if (voiceType === 'deep-male') {
      selectedVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('Alex'));
    } else if (voiceType === 'calming') {
      selectedVoice = voices.find(v => v.name.includes('Karen') || v.name.includes('Moira'));
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      toast({
        title: "Speech error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsSpeaking(false);
    } else {
      if (textToSpeak) {
        setIsSpeaking(true);
      } else {
        toast({
          title: "No message to speak",
          description: "Wait for a response from the assistant",
        });
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    return null; // Browser doesn't support speech recognition
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleRecording}
        variant={isRecording ? "destructive" : "default"}
        size="icon"
        className={`relative ${!isRecording ? 'bg-gradient-to-r from-lavender to-lavender-bright hover:shadow-lavender-glow border-0' : ''}`}
        title={isRecording ? "Stop recording" : "Start voice input"}
      >
        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        {isRecording && (
          <div 
            className="absolute inset-0 rounded-full border-2 border-destructive animate-pulse"
            style={{ opacity: audioLevel / 100 }}
          />
        )}
      </Button>

      <Button
        onClick={toggleSpeech}
        variant={isSpeaking ? "default" : "outline"}
        size="icon"
        className={`${isSpeaking ? 'bg-lavender text-white border-lavender' : 'border-lavender/30 hover:bg-lavender/10'}`}
        title={isSpeaking ? "Stop speaking" : "Play response"}
      >
        {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
    </div>
  );
};

export default VoiceControls;
