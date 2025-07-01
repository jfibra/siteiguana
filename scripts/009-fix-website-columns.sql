-- Ensure all required columns exist in the websites table
-- This script adds any missing columns that are needed for the wizard

-- Check and add missing columns one by one
DO $$ 
BEGIN
    -- Add business_type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'business_type') THEN
        ALTER TABLE public.websites ADD COLUMN business_type VARCHAR(100);
    END IF;

    -- Add target_audience if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'target_audience') THEN
        ALTER TABLE public.websites ADD COLUMN target_audience TEXT;
    END IF;

    -- Add primary_goals if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'primary_goals') THEN
        ALTER TABLE public.websites ADD COLUMN primary_goals TEXT;
    END IF;

    -- Add color_scheme if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'color_scheme') THEN
        ALTER TABLE public.websites ADD COLUMN color_scheme VARCHAR(100);
    END IF;

    -- Add website_style if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'website_style') THEN
        ALTER TABLE public.websites ADD COLUMN website_style VARCHAR(100);
    END IF;

    -- Add layout_preference if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'layout_preference') THEN
        ALTER TABLE public.websites ADD COLUMN layout_preference VARCHAR(100);
    END IF;

    -- Add required_pages if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'required_pages') THEN
        ALTER TABLE public.websites ADD COLUMN required_pages TEXT;
    END IF;

    -- Add special_features if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'special_features') THEN
        ALTER TABLE public.websites ADD COLUMN special_features TEXT;
    END IF;

    -- Add social_media_integration if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'social_media_integration') THEN
        ALTER TABLE public.websites ADD COLUMN social_media_integration TEXT;
    END IF;

    -- Add content_provided if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'content_provided') THEN
        ALTER TABLE public.websites ADD COLUMN content_provided TEXT;
    END IF;

    -- Add timeline_expectation if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'timeline_expectation') THEN
        ALTER TABLE public.websites ADD COLUMN timeline_expectation VARCHAR(50);
    END IF;

    -- Add budget_range if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'budget_range') THEN
        ALTER TABLE public.websites ADD COLUMN budget_range VARCHAR(50);
    END IF;

    -- Add additional_requirements if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'websites' AND column_name = 'additional_requirements') THEN
        ALTER TABLE public.websites ADD COLUMN additional_requirements TEXT;
    END IF;

END $$;

-- Create indexes for better performance on commonly queried columns
CREATE INDEX IF NOT EXISTS idx_websites_business_type ON public.websites(business_type);
CREATE INDEX IF NOT EXISTS idx_websites_website_style ON public.websites(website_style);
CREATE INDEX IF NOT EXISTS idx_websites_budget_range ON public.websites(budget_range);
CREATE INDEX IF NOT EXISTS idx_websites_status ON public.websites(status);
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON public.websites(user_id);

-- Update the updated_at timestamp when a record is modified
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at if it doesn't exist
DROP TRIGGER IF EXISTS update_websites_updated_at ON public.websites;
CREATE TRIGGER update_websites_updated_at
    BEFORE UPDATE ON public.websites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
