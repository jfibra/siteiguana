-- Create storage bucket for user profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-profiles',
  'user-profiles',
  true,
  52428800, -- 50MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the user-profiles bucket
CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can view their own profile images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-profiles' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Allow public access to profile images
CREATE POLICY "Profile images are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'user-profiles');
