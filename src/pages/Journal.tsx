import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Home, Save, Trash2, Mic, MicOff, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  emotion: string | null;
  created_at: string;
};

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    checkAuthAndLoadEntries();
    initializeSpeechRecognition();
  }, []);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setContent(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not supported",
        description: "Voice input is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now to add to your journal entry.",
      });
    }
  };

  const checkAuthAndLoadEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to use the journal.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    loadEntries();
  };

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading entries:", error);
      return;
    }

    setEntries(data || []);
  };

  const detectEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/sad|depressed|down|hopeless|lonely/)) return "sad";
    if (lowerText.match(/anxious|worried|nervous|scared|afraid/)) return "anxious";
    if (lowerText.match(/angry|frustrated|mad|irritated/)) return "angry";
    if (lowerText.match(/happy|joy|excited|great|wonderful/)) return "happy";
    if (lowerText.match(/stressed|overwhelmed|pressure/)) return "stressed";
    if (lowerText.match(/calm|peaceful|relaxed|content/)) return "calm";
    
    return "neutral";
  };

  const saveEntry = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something in your journal.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const emotion = detectEmotion(content);

      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        title: title || "Untitled Entry",
        content,
        emotion,
      });

      if (error) throw error;

      // Track mood
      await supabase.from("mood_tracking").insert({
        user_id: user.id,
        emotion,
        intensity: 5,
        notes: "From journal entry",
      });

      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      });

      setTitle("");
      setContent("");
      loadEntries();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save journal entry.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete entry.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Entry deleted",
      description: "Your journal entry has been removed.",
    });

    loadEntries();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.setFontSize(20);
    doc.text("My Journal Entries", 20, yPosition);
    yPosition += 15;

    entries.forEach((entry, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(entry.title, 20, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.text(new Date(entry.created_at).toLocaleDateString(), 20, yPosition);
      yPosition += 7;

      if (entry.emotion) {
        doc.text(`Emotion: ${entry.emotion}`, 20, yPosition);
        yPosition += 7;
      }

      doc.setFontSize(11);
      const lines = doc.splitTextToSize(entry.content, 170);
      doc.text(lines, 20, yPosition);
      yPosition += (lines.length * 7) + 10;
    });

    doc.save("my-journal.pdf");
    toast({
      title: "PDF exported",
      description: "Your journal has been downloaded.",
    });
  };

  const emotionColor = (emotion: string | null) => {
    const colors: Record<string, string> = {
      sad: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      anxious: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
      angry: "bg-red-500/20 text-red-700 dark:text-red-300",
      happy: "bg-green-500/20 text-green-700 dark:text-green-300",
      stressed: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
      calm: "bg-primary/20 text-primary",
      neutral: "bg-muted text-muted-foreground",
    };
    return colors[emotion || "neutral"] || colors.neutral;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Journal</h1>
              <p className="text-sm text-muted-foreground">Express your thoughts and feelings</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToPDF} disabled={entries.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* New Entry Form */}
          <Card className="p-6 border-primary/20 shadow-soft h-fit">
            <h2 className="text-xl font-semibold mb-4 text-foreground">New Entry</h2>
            
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title (optional)"
                className="border-primary/20 focus:border-primary"
              />
              
              <div className="relative">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here... or use voice input"
                  className="min-h-[300px] resize-none border-primary/20 focus:border-primary pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={`absolute right-2 top-2 ${isListening ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </div>
              
              <Button
                onClick={saveEntry}
                disabled={isLoading || !content.trim()}
                className="w-full bg-gradient-to-r from-primary to-serene hover:shadow-glow"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </Card>

          {/* Previous Entries */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Previous Entries</h2>
            
            {entries.length === 0 ? (
              <Card className="p-8 text-center border-border">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No journal entries yet. Start writing!</p>
              </Card>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {entries.map((entry) => (
                  <Card key={entry.id} className="p-6 border-border hover:border-primary/30 transition-all animate-fade-in">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{entry.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()} at{" "}
                          {new Date(entry.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {entry.emotion && (
                          <Badge className={emotionColor(entry.emotion)}>
                            {entry.emotion}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground whitespace-pre-wrap line-clamp-4">
                      {entry.content}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;