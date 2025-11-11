import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Heart, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useStreak } from "@/hooks/useStreak";
import { useTreasureBox } from "@/hooks/useTreasureBox";

type Message = {
  role: "user" | "assistant";
  content: string;
  emotion?: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateStreak } = useStreak();
  const { recordTask } = useTreasureBox();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to use the chat.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Create a new chat session
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id, title: "New Conversation" })
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create chat session",
        variant: "destructive",
      });
      return;
    }

    setSessionId(data.id);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Save user message to database
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: input,
      });

      // Call AI chat function
      const { data, error } = await supabase.functions.invoke("mental-health-chat", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        emotion: data.emotion,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: data.message,
        emotion: data.emotion,
      });

      // Track mood and create polaroid
      if (data.emotion && data.emotion !== "neutral") {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("mood_tracking").insert({
            user_id: user.id,
            emotion: data.emotion,
            intensity: 5,
            notes: input.substring(0, 100),
          });

          // Create polaroid
          const emotionEmojis: Record<string, string> = {
            happy: "😊", sad: "😢", anxious: "😰", angry: "😠",
            calm: "😌", stressed: "😓", neutral: "😐",
          };
          
          await supabase.from("mood_polaroids").insert({
            user_id: user.id,
            emotion: data.emotion,
            note: input.substring(0, 100),
            emoji: emotionEmojis[data.emotion] || "😐",
          });
        }
      }

      // Update streak and record task
      await updateStreak();
      await recordTask("chat");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const emotionColor = (emotion?: string) => {
    const colors: Record<string, string> = {
      sad: "text-blue-500",
      anxious: "text-yellow-500",
      angry: "text-red-500",
      happy: "text-green-500",
      stressed: "text-orange-500",
      calm: "text-primary",
    };
    return colors[emotion || ""] || "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-serene flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mental Health Companion</h1>
              <p className="text-sm text-muted-foreground">Share your thoughts freely</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <Card className="mb-4 p-6 border-primary/20 shadow-soft">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
                <p>Start a conversation. I'm here to listen.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-serene text-white"
                      : "bg-card border border-border"
                  }`}
                >
                  <p className={message.role === "user" ? "text-white" : "text-foreground"}>
                    {message.content}
                  </p>
                  {message.emotion && (
                    <p className={`text-xs mt-2 ${emotionColor(message.emotion)}`}>
                      Detected: {message.emotion}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-card border border-border p-4 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-serene rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </Card>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Share what's on your mind..."
            className="min-h-[80px] resize-none border-primary/20 focus:border-primary"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-primary to-serene hover:shadow-glow"
            size="lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          This is not a substitute for professional mental health care. In crisis, please contact a professional.
        </p>
      </div>
    </div>
  );
};

export default Chat;