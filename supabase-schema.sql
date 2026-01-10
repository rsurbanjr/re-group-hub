-- RE | Group Hub Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contacts table
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  type TEXT DEFAULT 'Buyer',
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Active',
  last_contact DATE,
  neighborhood TEXT,
  notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property TEXT NOT NULL,
  neighborhood TEXT,
  stage TEXT DEFAULT 'Lead',
  value NUMERIC DEFAULT 0,
  commission_percent NUMERIC DEFAULT 2.5,
  commission NUMERIC DEFAULT 0,
  type TEXT DEFAULT 'Buyer',
  next_step TEXT,
  contact_ids UUID[] DEFAULT '{}',
  property_id UUID,
  notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  due_date DATE,
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  contact_name TEXT,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  outcome TEXT DEFAULT 'Positive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  address TEXT NOT NULL,
  neighborhood TEXT,
  type TEXT DEFAULT 'Single Family',
  status TEXT DEFAULT 'Research',
  price NUMERIC DEFAULT 0,
  sqft INTEGER,
  beds INTEGER,
  baths NUMERIC,
  year_built INTEGER,
  lot_size TEXT,
  waterfront BOOLEAN DEFAULT FALSE,
  pool BOOLEAN DEFAULT FALSE,
  features TEXT,
  notes TEXT,
  deal_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Email',
  subject TEXT,
  body TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table (for goals, dark mode, etc.)
CREATE TABLE user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mastery progress table
CREATE TABLE mastery_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  quiz_scores JSONB DEFAULT '{}'::jsonb,
  completed_daily_habits JSONB DEFAULT '{}'::jsonb,
  completed_weekly_tasks JSONB DEFAULT '{}'::jsonb,
  mastered_properties JSONB DEFAULT '[]'::jsonb,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, neighborhood)
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_neighborhood ON deals(neighborhood);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_neighborhood ON properties(neighborhood);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_progress ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (we'll add auth later)
-- These policies allow anyone with the anon key to access data
CREATE POLICY "Allow all access to contacts" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all access to deals" ON deals FOR ALL USING (true);
CREATE POLICY "Allow all access to tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all access to activities" ON activities FOR ALL USING (true);
CREATE POLICY "Allow all access to properties" ON properties FOR ALL USING (true);
CREATE POLICY "Allow all access to templates" ON templates FOR ALL USING (true);
CREATE POLICY "Allow all access to user_settings" ON user_settings FOR ALL USING (true);
CREATE POLICY "Allow all access to mastery_progress" ON mastery_progress FOR ALL USING (true);

-- Insert default templates
INSERT INTO templates (name, category, subject, body) VALUES
  ('Initial Outreach', 'Email', 'Luxury Real Estate Opportunity', E'Hi [Name],\n\nI hope this message finds you well. I wanted to reach out regarding some exceptional properties in [Neighborhood] that align with your preferences.\n\nWould you be available for a brief call this week to discuss?\n\nBest regards,\nRoxanna Urban\nOne Sotheby''s International Realty'),
  ('Listing Follow-up', 'Email', 'Following Up on [Property]', E'Hi [Name],\n\nI wanted to follow up on your interest in [Property]. The property is still available and I''d love to schedule a private showing at your convenience.\n\nPlease let me know what times work best for you.\n\nBest,\nRoxanna'),
  ('Market Update', 'Email', '[Neighborhood] Market Update', E'Hi [Name],\n\nI wanted to share some recent market activity in [Neighborhood]:\n\n• New listings: [X]\n• Recent sales: [X]\n• Average price/sqft: $[X]\n\nLet me know if you''d like to discuss any opportunities.\n\nBest,\nRoxanna'),
  ('Quick Check-in', 'SMS', '', E'Hi [Name]! Just checking in to see if you''re still interested in [Neighborhood]. Any updates on your timeline? - Roxanna'),
  ('Showing Confirmation', 'SMS', '', E'Hi [Name], confirming our showing tomorrow at [Time] for [Property]. Looking forward to seeing you! - Roxanna');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mastery_progress_updated_at BEFORE UPDATE ON mastery_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
