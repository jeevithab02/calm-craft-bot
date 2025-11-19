import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type PolaroidCardProps = {
  emotion: string;
  emoji: string;
  note?: string;
  date: string;
  onDelete?: () => void;
};

export const PolaroidCard = ({ emotion, emoji, note, date, onDelete }: PolaroidCardProps) => {
  return (
    <Card className="w-64 bg-card border-2 border-lavender/30 shadow-lavender-glow hover:shadow-lavender-glow-lg transition-all duration-300 hover:-rotate-1 transform rotate-1 animate-fade-in">
      <div className="p-4 space-y-3">
        <div className="bg-muted rounded-lg h-40 flex items-center justify-center text-8xl">
          {emoji}
        </div>
        <div className="space-y-2 pt-2">
          <h3 className="font-handwriting font-semibold text-lg capitalize text-lavender">{emotion}</h3>
          {note && (
            <p className="text-sm text-muted-foreground line-clamp-2">{note}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</p>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
