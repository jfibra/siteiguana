-- Create addresses table with geolocation support
CREATE TABLE IF NOT EXISTS public.addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'billing' CHECK (type IN ('billing', 'shipping', 'primary')),
  label VARCHAR(100), -- e.g., "Home", "Office", "Billing Address"
  street VARCHAR(255) NOT NULL,
  street2 VARCHAR(255), -- Apartment, suite, etc.
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'United States',
  latitude DECIMAL(10, 8), -- Precise latitude
  longitude DECIMAL(11, 8), -- Precise longitude
  formatted_address TEXT, -- Full formatted address from geocoding
  place_id VARCHAR(255), -- Google Places ID for reference
  is_verified BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_type ON public.addresses(type);
CREATE INDEX IF NOT EXISTS idx_addresses_is_deleted ON public.addresses(is_deleted);
CREATE INDEX IF NOT EXISTS idx_addresses_is_primary ON public.addresses(is_primary);

-- Enable RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_addresses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_addresses_updated_at();

-- Migrate existing user_addresses data to new addresses table
INSERT INTO public.addresses (
  user_id, 
  type, 
  street, 
  city, 
  state, 
  zip_code, 
  country,
  street2,
  created_at
)
SELECT 
  user_id,
  type,
  street,
  city,
  state,
  zip_code,
  COALESCE(country, 'United States'),
  additional_info,
  CURRENT_TIMESTAMP
FROM public.user_addresses 
WHERE is_deleted = false;
