import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BreathingExercise from "@/components/BreathingExercise";

const Breathe = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Breathing Exercises</h1>
            <p className="text-muted-foreground">Take a moment to center yourself</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <BreathingExercise />
        
        <div className="mt-8 p-6 bg-card/50 rounded-lg border border-primary/20">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Benefits of Breathing Exercises</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Reduces stress and anxiety</li>
            <li>• Improves focus and concentration</li>
            <li>• Lowers blood pressure</li>
            <li>• Promotes better sleep</li>
            <li>• Enhances emotional regulation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Breathe;
