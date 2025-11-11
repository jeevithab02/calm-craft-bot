import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Box } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Collectible = {
  id: string;
  type: string;
  content: any;
  unlocked_at: string;
};

const TreasuresVault = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadCollectibles();
  }, []);

  const checkAuthAndLoadCollectibles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to view your treasures.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    loadCollectibles();
  };

  const loadCollectibles = async () => {
    const { data, error } = await supabase
      .from("collectibles")
      .select("*")
      .order("unlocked_at", { ascending: false });

    if (error) {
      console.error("Error loading collectibles:", error);
      return;
    }

    setCollectibles(data || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Treasures Vault</h1>
              <p className="text-sm text-muted-foreground">Your collected digital treasures</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {collectibles.length === 0 ? (
          <div className="text-center py-16">
            <Box className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No treasures yet. Complete tasks to unlock treasure boxes!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectibles.map((collectible) => (
              <Card key={collectible.id} className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20 animate-fade-in">
                <div className="text-center space-y-3">
                  <div className="text-6xl mb-4">{collectible.content.collectible}</div>
                  <h3 className="font-semibold text-foreground capitalize">{collectible.type}</h3>
                  <p className="text-sm text-muted-foreground italic">"{collectible.content.quote}"</p>
                  <div className="text-xs text-muted-foreground pt-2">
                    Unlocked: {new Date(collectible.unlocked_at).toLocaleDateString()}
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

export default TreasuresVault;
