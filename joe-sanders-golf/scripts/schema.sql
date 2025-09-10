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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
