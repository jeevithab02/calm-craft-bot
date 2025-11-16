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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
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
          <div className="space-y-4">
            {logs.map((log) => (
              <Card
                key={log.id}
                className={`p-6 bg-gradient-to-br ${emotionColors[log.emotion]} border-border/50 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{emotionEmojis[log.emotion]}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold capitalize mb-1">
                        {log.emotion}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Confidence: {Math.round(log.confidence * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Source: {log.source === 'photo_upload' ? 'Photo Upload' : 'Camera Capture'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "PPpp")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLog(log.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionHistory;
