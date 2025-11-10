import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, BookOpen, Activity, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-soft">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Your Mental Wellness Companion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-serene to-secondary">
              Find Peace Within
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              A safe, judgment-free space for your mental health journey. 
              Talk, reflect, and grow with AI-powered emotional support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-serene hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
                onClick={() => navigate('/chat')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Talking
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary/30 hover:bg-primary/10 text-lg px-8 py-6"
                onClick={() => navigate('/journal')}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Open Journal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Tools for Your Wellbeing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Empathetic Chat"
              description="Talk to an AI that understands emotions and provides supportive, judgment-free responses."
              onClick={() => navigate('/chat')}
            />
            
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Daily Journal"
              description="Track your thoughts and emotions with automatic mood detection and insights."
              onClick={() => navigate('/journal')}
            />
            
            <FeatureCard
              icon={<Activity className="w-8 h-8" />}
              title="Mood Tracker"
              description="Visualize your emotional patterns and celebrate your progress over time."
              onClick={() => navigate('/mood')}
            />
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-12 px-4 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-primary/20 bg-primary/5">
            <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Your Privacy & Safety</h3>
              <p className="text-muted-foreground">
                This AI companion provides emotional support but is not a replacement for professional mental health care. 
                If you're experiencing a crisis, please contact a mental health professional or crisis helpline immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, onClick }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  onClick: () => void;
}) => (
  <div 
    onClick={onClick}
    className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-soft transition-all duration-300 cursor-pointer animate-fade-in"
  >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-serene/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <div className="text-primary">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);

export default Index;