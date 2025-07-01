-- Enable Row Level Security on the 'roles' table (if not already enabled)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read all roles
CREATE POLICY "Allow authenticated users to read all roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);
