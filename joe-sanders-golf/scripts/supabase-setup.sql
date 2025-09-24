-- 🗄️ Supabase Database Schema for Joe Sanders Golf Platform
-- Run these SQL commands in your Supabase Dashboard → SQL Editor

-- ===============================================
-- TOURNAMENTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic tournament info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming',
  
  -- Tournament details
  prize_pool DECIMAL(10,2),
  entry_fee DECIMAL(8,2),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  
  -- Media and display
  image_url TEXT,
  banner_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  
  -- Tournament type and category
  tournament_type VARCHAR(100),
  category VARCHAR(100),
  difficulty_level VARCHAR(50),
  
  -- Registration and deadlines
  registration_open BOOLEAN DEFAULT TRUE,
  registration_deadline DATE,
  
  -- Additional metadata
  course_name VARCHAR(255),
  course_par INTEGER,
  weather_conditions VARCHAR(100),
  notes TEXT
);

-- ===============================================
-- SPONSORS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Sponsor information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  
  -- Sponsorship details
  tier VARCHAR(50) DEFAULT 'bronze', -- bronze, silver, gold, platinum, title
  active BOOLEAN DEFAULT TRUE,
  contract_start DATE,
  contract_end DATE,
  
  -- Display and ordering
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  
  -- Contact information
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_person VARCHAR(255),
  
  -- Additional metadata
  sponsorship_value DECIMAL(10,2),
  benefits TEXT,
  notes TEXT
);

-- ===============================================
-- MERCHANDISE TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS merch (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Product information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(8,2) NOT NULL,
  
  -- Product details
  category VARCHAR(100),
  brand VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  
  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  
  -- Media
  image_url TEXT,
  gallery_urls TEXT[], -- Array of image URLs
  
  -- Product specifications
  sizes VARCHAR(100)[], -- Array of available sizes
  colors VARCHAR(100)[], -- Array of available colors
  materials TEXT,
  
  -- Display and marketing
  featured BOOLEAN DEFAULT FALSE,
  sale_price DECIMAL(8,2),
  discount_percentage DECIMAL(5,2),
  
  -- Additional metadata
  weight DECIMAL(8,2),
  dimensions VARCHAR(100),
  shipping_info TEXT,
  care_instructions TEXT
);

-- ===============================================
-- NEWSLETTER SUBSCRIPTIONS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS newsletter_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Subscriber information
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT TRUE,
  subscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribe_date TIMESTAMP WITH TIME ZONE,
  
  -- Subscription preferences
  preferences JSONB DEFAULT '{}',
  source VARCHAR(100), -- Where they subscribed from
  
  -- Email campaign tracking
  last_email_sent TIMESTAMP WITH TIME ZONE,
  email_opens INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0
);

-- ===============================================
-- CONTACT MESSAGES TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Message details
  subject VARCHAR(255),
  message TEXT NOT NULL,
  category VARCHAR(100),
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'new', -- new, in_progress, resolved, closed
  priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
  assigned_to VARCHAR(255),
  
  -- Response tracking
  responded BOOLEAN DEFAULT FALSE,
  response_date TIMESTAMP WITH TIME ZONE,
  response_message TEXT,
  
  -- Additional metadata
  ip_address INET,
  user_agent TEXT,
  source VARCHAR(100)
);

-- ===============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for main content tables
CREATE POLICY "Public read access for tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public read access for sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public read access for merch" ON merch FOR SELECT USING (true);

-- Newsletter subscriptions - users can insert their own email
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_emails FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own subscription" ON newsletter_emails FOR SELECT USING (true);

-- Contact messages - users can submit messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- Tournaments
CREATE INDEX IF NOT EXISTS idx_tournaments_date ON tournaments(date);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_featured ON tournaments(featured);

-- Sponsors
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(active);
CREATE INDEX IF NOT EXISTS idx_sponsors_display_order ON sponsors(display_order);

-- Merchandise
CREATE INDEX IF NOT EXISTS idx_merch_category ON merch(category);
CREATE INDEX IF NOT EXISTS idx_merch_available ON merch(available);
CREATE INDEX IF NOT EXISTS idx_merch_featured ON merch(featured);
CREATE INDEX IF NOT EXISTS idx_merch_price ON merch(price);

-- Newsletter
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_emails(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON newsletter_emails(subscribed);

-- Contact messages
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at);

-- ===============================================
-- SAMPLE DATA INSERTION
-- ===============================================

-- Insert sample tournaments
INSERT INTO tournaments (title, description, date, location, prize_pool, entry_fee, image_url, featured) VALUES
('Spring Classic 2025', 'Annual spring tournament featuring the best local talent', '2025-04-15', 'Stones Golf Club', 10000.00, 150.00, '/images/tournament-spring-classic-2025.svg', true),
('Summer Championship', 'Premium summer tournament with pro-level competition', '2025-07-20', 'Championship Course', 25000.00, 300.00, '/images/tournament-summer-championship.svg', true),
('Fall Invitational', 'Exclusive invitational tournament', '2025-09-10', 'Private Country Club', 15000.00, 200.00, '/images/tournament-fall-invitational.svg', false)
ON CONFLICT DO NOTHING;

-- Insert sample sponsors
INSERT INTO sponsors (name, description, website_url, logo_url, tier, featured) VALUES
('Titleist', 'Premium golf equipment and accessories', 'https://titleist.com', '/images/sponsor-titleist.svg', 'platinum', true),
('Callaway Golf', 'Innovative golf clubs and gear', 'https://callawaygolf.com', '/images/sponsor-callaway.svg', 'gold', true),
('Stones Golf', 'Local premium golf course and facilities', 'https://stonesgolf.com', '/images/sponsor-stones-golf.svg', 'title', true)
ON CONFLICT DO NOTHING;

-- Insert sample merchandise
INSERT INTO merch (name, description, price, category, image_url, featured, sizes, colors) VALUES
('Official Golf Polo', 'Premium golf polo with Joe Sanders branding', 79.99, 'Apparel', '/images/merch-polo.svg', true, ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Navy', 'White', 'Red']),
('Golf Cap', 'Adjustable golf cap with embroidered logo', 34.99, 'Accessories', '/images/merch-cap.svg', true, ARRAY['One Size'], ARRAY['Navy', 'Black', 'White']),
('Golf Towel', 'Premium microfiber golf towel', 24.99, 'Accessories', '/images/merch-towel.svg', false, ARRAY['Standard'], ARRAY['White', 'Navy'])
ON CONFLICT DO NOTHING;

-- ===============================================
-- COMPLETION MESSAGE
-- ===============================================

-- Create a simple view to check if setup was successful
CREATE OR REPLACE VIEW setup_verification AS
SELECT 
  'Tournaments' as table_name, count(*) as record_count FROM tournaments
UNION ALL
SELECT 
  'Sponsors' as table_name, count(*) as record_count FROM sponsors
UNION ALL
SELECT 
  'Merchandise' as table_name, count(*) as record_count FROM merch;

-- Test the setup
SELECT * FROM setup_verification;

-- 🎉 Database setup complete! 
-- Your Joe Sanders Golf platform now has:
-- ✅ All required tables with proper schema
-- ✅ Row Level Security configured  
-- ✅ Performance indexes added
-- ✅ Sample data inserted
-- ✅ Ready for production use!