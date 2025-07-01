-- Add new columns to websites table for detailed website requests
ALTER TABLE public.websites 
ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS target_audience TEXT,
ADD COLUMN IF NOT EXISTS primary_goals TEXT,
ADD COLUMN IF NOT EXISTS color_scheme VARCHAR(100),
ADD COLUMN IF NOT EXISTS primary_color VARCHAR(7),
ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7),
ADD COLUMN IF NOT EXISTS accent_color VARCHAR(7),
ADD COLUMN IF NOT EXISTS website_style VARCHAR(100),
ADD COLUMN IF NOT EXISTS typography_preference VARCHAR(100),
ADD COLUMN IF NOT EXISTS layout_preference VARCHAR(100),
ADD COLUMN IF NOT EXISTS required_pages TEXT,
ADD COLUMN IF NOT EXISTS special_features TEXT,
ADD COLUMN IF NOT EXISTS content_provided TEXT,
ADD COLUMN IF NOT EXISTS social_media_integration TEXT,
ADD COLUMN IF NOT EXISTS domain_preference VARCHAR(255),
ADD COLUMN IF NOT EXISTS hosting_requirements TEXT,
ADD COLUMN IF NOT EXISTS budget_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS timeline_expectation VARCHAR(50),
ADD COLUMN IF NOT EXISTS additional_requirements TEXT;

-- Create index for better performance on business_type queries
CREATE INDEX IF NOT EXISTS idx_websites_business_type ON public.websites(business_type);
CREATE INDEX IF NOT EXISTS idx_websites_website_style ON public.websites(website_style);
CREATE INDEX IF NOT EXISTS idx_websites_budget_range ON public.websites(budget_range);
