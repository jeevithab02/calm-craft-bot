import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PolaroidCard } from "@/components/PolaroidCard";

type Polaroid = {
  id: string;
  emotion: string;
  emoji: string;
  note?: string;
  created_at: string;
};

const MoodMemories = () => {
  const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadPolaroids();
  }, []);

  const checkAuthAndLoadPolaroids = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to view mood memories.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    loadPolaroids();
  };

  const loadPolaroids = async () => {
    const { data, error } = await supabase
      .from("mood_polaroids")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading polaroids:", error);
      return;
    }

    setPolaroids(data || []);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("mood_polaroids")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete polaroid",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Deleted",
      description: "Polaroid removed from your memories",
    });
    
    setPolaroids(polaroids.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mood Memories</h1>
              <p className="text-sm text-muted-foreground">Your emotion polaroid collection</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {polaroids.length === 0 ? (
          <div className="text-center py-16">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No mood memories yet. Track your mood to create polaroids!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {polaroids.map((polaroid) => (
              <PolaroidCard
                key={polaroid.id}
                emotion={polaroid.emotion}
                emoji={polaroid.emoji}
                note={polaroid.note}
                date={polaroid.created_at}
                onDelete={() => handleDelete(polaroid.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodMemories;
