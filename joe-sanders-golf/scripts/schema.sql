-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  is_fan_club_member BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create tournaments table
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  result TEXT,
  recap_text TEXT,
  video_url TEXT,
  photo_urls TEXT[], -- Array of photo URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on tournaments
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Create policy for tournaments (public read)
CREATE POLICY "Anyone can view tournaments" ON tournaments
  FOR SELECT USING (true);

-- Create sponsors table
CREATE TABLE sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  tier TEXT NOT NULL, -- e.g., 'Gold', 'Silver', 'Bronze'
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on sponsors
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Create policy for sponsors (public read)
CREATE POLICY "Anyone can view sponsors" ON sponsors
  FOR SELECT USING (true);

-- Create merch table
CREATE TABLE merch (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_id TEXT NOT NULL, -- Stripe Price ID
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on merch
ALTER TABLE merch ENABLE ROW LEVEL SECURITY;

-- Create policy for merch (public read)
CREATE POLICY "Anyone can view merch" ON merch
  FOR SELECT USING (true);

-- Create fan_club_subscriptions table
CREATE TABLE fan_club_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL, -- e.g., 'active', 'canceled', 'past_due'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on fan_club_subscriptions
ALTER TABLE fan_club_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for fan_club_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON fan_club_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Create newsletter_emails table (optional, for simple newsletter without Mailchimp)
CREATE TABLE newsletter_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on newsletter_emails
ALTER TABLE newsletter_emails ENABLE ROW LEVEL SECURITY;

-- Create policy for newsletter_emails (public insert)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_emails
  FOR INSERT WITH CHECK (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create game_sessions table for AI golf simulator
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  course_name TEXT,
  total_score INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on game_sessions
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for game_sessions
CREATE POLICY "Users can view their own game sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create shots table for tracking individual shots
CREATE TABLE shots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  hole_number INTEGER,
  shot_number INTEGER,
  club_used TEXT,
  outcome TEXT,
  distance INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on shots
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;

-- Create policy for shots
CREATE POLICY "Users can view their own shots" ON shots
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM game_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can insert their own shots" ON shots
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM game_sessions WHERE id = session_id
    )
  );

-- Create coach_chats table for AI coach chat history
CREATE TABLE coach_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_message TEXT,
  ai_response TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on coach_chats
ALTER TABLE coach_chats ENABLE ROW LEVEL SECURITY;

-- Create policy for coach_chats
CREATE POLICY "Users can view their own coach chats" ON coach_chats
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM game_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can insert their own coach chats" ON coach_chats
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM game_sessions WHERE id = session_id
    )
  );

-- Create cos_logs table for Chief of Staff logs
CREATE TABLE cos_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT, -- e.g., 'email_draft', 'social_plan'
  user_input TEXT,
  gpt_output TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on cos_logs
ALTER TABLE cos_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for cos_logs (admin only - you might want to restrict this)
CREATE POLICY "Users can view their own cos logs" ON cos_logs
  FOR SELECT USING (auth.uid() = (SELECT id FROM profiles WHERE id = auth.uid() AND is_fan_club_member = true));

CREATE POLICY "Users can insert their own cos logs" ON cos_logs
  FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM profiles WHERE id = auth.uid() AND is_fan_club_member = true));

-- Add trigger for game_sessions updated_at
CREATE TRIGGER handle_updated_at_game_sessions
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_tournaments
  BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_sponsors
  BEFORE UPDATE ON sponsors
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_merch
  BEFORE UPDATE ON merch
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_updated_at_fan_club_subscriptions
  BEFORE UPDATE ON fan_club_subscriptions
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
