import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Journal from "./pages/Journal";
import Mood from "./pages/Mood";
import Auth from "./pages/Auth";
import Breathe from "./pages/Breathe";
import Resources from "./pages/Resources";
import MoodMemories from "./pages/MoodMemories";
import TreasuresVault from "./pages/TreasuresVault";
import EmotionVault from "./pages/EmotionVault";
import EmotionHistory from "./pages/EmotionHistory";
import EmotionDetect from "./pages/EmotionDetect";
import VoiceChat from "./pages/VoiceChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/breathe" element={<Breathe />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/mood-memories" element={<MoodMemories />} />
          <Route path="/treasures" element={<TreasuresVault />} />
          <Route path="/emotion-vault" element={<EmotionVault />} />
          <Route path="/emotion-history" element={<EmotionHistory />} />
          <Route path="/emotion-detect" element={<EmotionDetect />} />
          <Route path="/voice-chat" element={<VoiceChat />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
