-- Update payment_methods table to reference new addresses table
ALTER TABLE public.payment_methods 
DROP CONSTRAINT IF EXISTS payment_methods_billing_address_id_fkey;

-- Add new foreign key constraint to addresses table
ALTER TABLE public.payment_methods 
ADD CONSTRAINT payment_methods_billing_address_id_fkey 
FOREIGN KEY (billing_address_id) REFERENCES public.addresses(id);

-- Update existing payment methods to use new addresses
UPDATE public.payment_methods 
SET billing_address_id = (
  SELECT a.id 
  FROM public.addresses a 
  JOIN public.user_addresses ua ON (
    ua.user_id = a.user_id 
    AND ua.street = a.street 
    AND ua.city = a.city 
    AND ua.state = a.state 
    AND ua.zip_code = a.zip_code
  )
  WHERE ua.id = payment_methods.billing_address_id
  LIMIT 1
)
WHERE billing_address_id IS NOT NULL;
