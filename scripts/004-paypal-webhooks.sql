-- Create PayPal webhooks table for logging webhook events
CREATE TABLE IF NOT EXISTS paypal_webhooks (
id SERIAL PRIMARY KEY,
event_type VARCHAR(100) NOT NULL,
resource_type VARCHAR(100),
resource_id VARCHAR(255),
payload JSONB NOT NULL,
processed BOOLEAN DEFAULT FALSE
-- created_at column will be added via ALTER TABLE if it doesn't exist
);

-- Add created_at column if it doesn't exist
-- This is a more robust way to ensure the column is present
DO $$
BEGIN
IF NOT EXISTS (
SELECT 1
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'paypal_webhooks'
  AND column_name = 'created_at'
) THEN
ALTER TABLE public.paypal_webhooks
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
END IF;
END $$;

-- Create index for faster queries on event_type
CREATE INDEX IF NOT EXISTS idx_paypal_webhooks_event_type ON public.paypal_webhooks(event_type);

-- Create index for faster queries on created_at
CREATE INDEX IF NOT EXISTS idx_paypal_webhooks_created_at ON public.paypal_webhooks(created_at);
