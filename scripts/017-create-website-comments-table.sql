CREATE TABLE IF NOT EXISTS website_comments (
    id SERIAL PRIMARY KEY,
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- User who made the comment (can be admin or regular user)
    comment_text TEXT NOT NULL,
    author_type VARCHAR(20) NOT NULL CHECK (author_type IN ('user', 'admin')), -- 'user' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS) for website_comments table
ALTER TABLE website_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view comments on their own websites, and admins can view all comments.
CREATE POLICY "Users and Admins can view website comments."
  ON website_comments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM websites WHERE id = website_comments.website_id AND user_id = auth.uid()) -- User owns the website
    OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'admin')) -- User is an admin
  );

-- Policy: Users can insert comments on their own websites, and admins can insert comments on any website.
CREATE POLICY "Users and Admins can insert website comments."
  ON website_comments FOR INSERT
  WITH CHECK (
    (author_type = 'user' AND EXISTS (SELECT 1 FROM websites WHERE id = website_comments.website_id AND user_id = auth.uid()))
    OR
    (author_type = 'admin' AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'admin')))
  );

-- Policy: Admins can update any website comment, and users can update their own comments.
CREATE POLICY "Admins can update any website comment."
  ON website_comments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'admin')));

CREATE POLICY "Users can update their own website comments."
  ON website_comments FOR UPDATE
  USING (user_id = auth.uid() AND author_type = 'user');

-- Policy: Admins can delete any website comment, and users can delete their own comments.
CREATE POLICY "Admins can delete any website comment."
  ON website_comments FOR DELETE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'admin')));

CREATE POLICY "Users can delete their own website comments."
  ON website_comments FOR DELETE
  USING (user_id = auth.uid() AND author_type = 'user');
