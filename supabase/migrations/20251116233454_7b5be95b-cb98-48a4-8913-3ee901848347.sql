-- Create table for emotion detection logs
CREATE TABLE IF NOT EXISTS public.emotion_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  emotion TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('photo_upload', 'camera_capture')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emotion_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for emotion_logs
CREATE POLICY "Users can view their own emotion logs"
ON public.emotion_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emotion logs"
ON public.emotion_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emotion logs"
ON public.emotion_logs
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_emotion_logs_user_created 
ON public.emotion_logs(user_id, created_at DESC);