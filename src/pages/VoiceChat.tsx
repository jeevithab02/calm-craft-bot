import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Mic, MicOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const VoiceChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech synthesis voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Load saved voice or use first available
      const savedVoice = localStorage.getItem("preferredVoice");
      if (savedVoice && voices.find(v => v.name === savedVoice)) {
        setSelectedVoice(savedVoice);
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Microphone Error",
          description: "Could not access microphone. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserMessage = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);

    try {
      const { data, error } = await supabase.functions.invoke("mental-health-chat", {
        body: { messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) },
      });

      if (error) throw error;

      // Generate short response (1-2 sentences max)
      const assistantContent = data.message.split('.').slice(0, 2).join('.') + '.';
      const assistantMsg: Message = { role: "assistant", content: assistantContent };
      setMessages(prev => [...prev, assistantMsg]);

      // Auto-speak the response
      speakText(assistantContent);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = availableVoices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Failed to start recognition:", error);
        toast({
          title: "Error",
          description: "Could not start microphone.",
          variant: "destructive",
        });
      }
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem("preferredVoice", voiceName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">Voice Chat</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Select value={selectedVoice} onValueChange={handleVoiceChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {availableVoices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="container mx-auto max-w-3xl space-y-6">
          {messages.slice(-6).map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] p-6 rounded-3xl shadow-soft text-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary to-serene text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-6">
        <div className="container mx-auto max-w-3xl flex justify-center">
          <Button
            size="lg"
            onClick={toggleListening}
            disabled={isSpeaking}
            className={`w-20 h-20 rounded-full ${
              isListening
                ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                : "bg-gradient-to-br from-primary to-serene hover:shadow-glow"
            } transition-all duration-300`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Tap to speak"}
        </p>
      </div>
    </div>
  );
};

export default VoiceChat;
