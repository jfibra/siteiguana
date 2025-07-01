ALTER TABLE public.plans
ADD COLUMN features text[],
ADD COLUMN ideal_for text[],
ADD COLUMN is_popular boolean DEFAULT FALSE;
