CREATE TABLE IF NOT EXISTS internship_applications (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email TEXT NOT NULL,
  college_name TEXT NOT NULL,
  college_location TEXT NOT NULL,
  preferred_domain TEXT NOT NULL,
  languages TEXT NOT NULL,
  remote_comfort VARCHAR(8) NOT NULL,
  placement_contact TEXT NOT NULL,
  resume_path TEXT,
  consent BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
