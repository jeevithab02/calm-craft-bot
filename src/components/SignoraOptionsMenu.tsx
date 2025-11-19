import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Music, History, MessageCircle, Sparkles, BarChart3, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SignoraOptionsMenu = () => {
  const navigate = useNavigate();

  const options = [
    {
      icon: Music,
      label: "Play music for my emotion",
      onClick: () => navigate("/mood"),
    },
    {
      icon: History,
      label: "Open emotion history",
      onClick: () => navigate("/emotion-history"),
    },
    {
      icon: MessageCircle,
      label: "Talk to chatbot",
      onClick: () => navigate("/chat"),
    },
    {
      icon: Sparkles,
      label: "Show relaxation exercises",
      onClick: () => navigate("/breathe"),
    },
    {
      icon: BarChart3,
      label: "Daily mood summary",
      onClick: () => navigate("/mood-memories"),
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-lavender to-lavender-bright shadow-lavender-glow hover:shadow-lavender-glow-lg transition-all z-50"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-gradient-to-t from-lavender-mist to-background border-t-lavender">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-center bg-gradient-to-r from-lavender to-lavender-bright bg-clip-text text-transparent">
            Signora Options
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-3 pb-6">
          {options.map((option, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="h-16 justify-start gap-4 text-lg border-lavender/30 hover:bg-lavender-mist/50 hover:border-lavender transition-all"
              onClick={option.onClick}
            >
              <option.icon className="h-5 w-5 text-lavender" />
              <span className="text-foreground">{option.label}</span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
