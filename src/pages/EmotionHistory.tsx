import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface EmotionLog {
  id: string;
  emotion: string;
  confidence: number;
  source: string;
  created_at: string;
}

const EmotionHistory = () => {
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("emotion_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error loading logs:", error);
      toast({
        title: "Error",
        description: "Failed to load emotion history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from("emotion_logs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLogs(logs.filter(log => log.id !== id));
      toast({
        title: "Deleted",
        description: "Emotion log deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting log:", error);
      toast({
        title: "Error",
        description: "Failed to delete emotion log",
        variant: "destructive",
      });
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

  const emotionColors: Record<string, string> = {
    happy: "from-green-400/20 to-green-600/20",
    sad: "from-blue-400/20 to-blue-600/20",
    angry: "from-red-400/20 to-red-600/20",
    anxious: "from-yellow-400/20 to-yellow-600/20",
    stressed: "from-orange-400/20 to-orange-600/20",
    disgusted: "from-purple-400/20 to-purple-600/20",
    surprised: "from-pink-400/20 to-pink-600/20",
    neutral: "from-gray-400/20 to-gray-600/20",
  };

  const isPositiveEmotion = (emotion: string) => {
    return ["happy", "surprised"].includes(emotion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-lavender-mist to-lavender-light">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Emotion History</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading emotion history...</p>
          </div>
        ) : logs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No emotion logs yet. Start by detecting emotions from photos!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {logs.map((log) => (
              <div
                key={log.id}
                className="relative bg-white dark:bg-card p-4 pb-8 shadow-lg hover:shadow-xl transition-all duration-300 rotate-1 hover:rotate-0 border-8 border-white dark:border-card animate-fade-in"
                style={{
                  transform: `rotate(${Math.random() * 6 - 3}deg)`,
                }}
              >
                <div className="bg-muted rounded-lg h-48 flex items-center justify-center mb-4 overflow-hidden">
                  <div className="text-8xl">{emotionEmojis[log.emotion]}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-handwriting text-2xl capitalize text-center text-foreground">
                    {log.emotion}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {Math.round(log.confidence * 100)}% confident
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    {format(new Date(log.created_at), "PP")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLog(log.id)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionHistory;
