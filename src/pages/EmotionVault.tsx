import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type StreakReward = {
  id: string;
  streak_day: number;
  reward_type: string;
  content: any;
  unlocked_at: string;
};

const EmotionVault = () => {
  const [rewards, setRewards] = useState<StreakReward[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadRewards();
  }, []);

  const checkAuthAndLoadRewards = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to view your rewards.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    loadRewards();
  };

  const loadRewards = async () => {
    const { data, error } = await supabase
      .from("streak_rewards")
      .select("*")
      .order("streak_day", { ascending: false });

    if (error) {
      console.error("Error loading rewards:", error);
      return;
    }

    setRewards(data || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Emotion Vault</h1>
              <p className="text-sm text-muted-foreground">Your streak milestone rewards</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {rewards.length === 0 ? (
          <div className="text-center py-16">
            <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No rewards yet. Keep your streak going to earn rewards!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id} className="p-6 bg-gradient-to-br from-card to-accent/10 border-accent/30 animate-fade-in">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-6 h-6 text-accent" />
                      <h3 className="font-semibold text-foreground">{reward.streak_day} Day Milestone</h3>
                    </div>
                    <span className="text-3xl">{reward.content.emoji}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{reward.content.message}</p>
                  <div className="text-xs text-muted-foreground pt-2">
                    Unlocked: {new Date(reward.unlocked_at).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionVault;
