-- Create mood_polaroids table for Emotion Polaroids feature
CREATE TABLE public.mood_polaroids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  emotion TEXT NOT NULL,
  note TEXT,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mood_polaroids ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own polaroids"
ON public.mood_polaroids FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own polaroids"
ON public.mood_polaroids FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polaroids"
ON public.mood_polaroids FOR DELETE
USING (auth.uid() = user_id);

-- Create tasks table for tracking user activities
CREATE TABLE public.user_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_type TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own tasks"
ON public.user_tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
ON public.user_tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create collectibles table for Treasure Box
CREATE TABLE public.collectibles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collectibles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own collectibles"
ON public.collectibles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collectibles"
ON public.collectibles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create streak_rewards table for Mood Streak System
CREATE TABLE public.streak_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_day INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  content JSONB NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.streak_rewards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own streak rewards"
ON public.streak_rewards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streak rewards"
ON public.streak_rewards FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create user_streaks table to track current streaks
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_check_in DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own streak"
ON public.user_streaks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streak"
ON public.user_streaks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak"
ON public.user_streaks FOR UPDATE
USING (auth.uid() = user_id);