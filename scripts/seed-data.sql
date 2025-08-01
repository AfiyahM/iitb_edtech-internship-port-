-- Insert sample internships
INSERT INTO internships (title, company, location, type, duration, salary, description, requirements, skills, application_deadline) VALUES
('Software Engineering Intern', 'Google', 'Mountain View, CA', 'full-time', '12 weeks', '$8,000/month', 
 'Work on cutting-edge projects with the Chrome team, developing new features and optimizing performance.',
 ARRAY['Currently pursuing CS degree', 'Strong programming skills', 'Problem-solving abilities'],
 ARRAY['React', 'TypeScript', 'Node.js', 'Python', 'Git'],
 '2024-03-15'),

('Frontend Developer Intern', 'Meta', 'Menlo Park, CA', 'full-time', '16 weeks', '$7,500/month',
 'Join the React team and contribute to open source projects while building user interfaces.',
 ARRAY['Web development experience', 'JavaScript proficiency', 'UI/UX understanding'],
 ARRAY['React', 'JavaScript', 'CSS', 'GraphQL', 'HTML'],
 '2024-03-20'),

('Data Science Intern', 'Netflix', 'Los Gatos, CA', 'full-time', '10 weeks', '$7,000/month',
 'Analyze user behavior data and build machine learning models to improve content recommendations.',
 ARRAY['Statistics background', 'Python experience', 'Data analysis skills'],
 ARRAY['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas'],
 '2024-04-01'),

('Product Design Intern', 'Airbnb', 'San Francisco, CA', 'full-time', '12 weeks', '$6,500/month',
 'Design user experiences for millions of travelers worldwide, working closely with product teams.',
 ARRAY['Design portfolio', 'User research experience', 'Prototyping skills'],
 ARRAY['Figma', 'Sketch', 'Prototyping', 'User Research', 'Adobe Creative Suite'],
 '2024-03-25'),

('Backend Engineering Intern', 'Stripe', 'San Francisco, CA', 'full-time', '12 weeks', '$8,500/month',
 'Build scalable payment infrastructure and APIs used by millions of businesses worldwide.',
 ARRAY['Backend development experience', 'API design knowledge', 'Database skills'],
 ARRAY['Node.js', 'Python', 'PostgreSQL', 'Redis', 'AWS'],
 '2024-04-10'),

('Mobile Development Intern', 'Uber', 'San Francisco, CA', 'full-time', '14 weeks', '$7,800/month',
 'Develop features for Uber''s mobile applications used by millions of riders and drivers.',
 ARRAY['Mobile development experience', 'iOS or Android knowledge', 'API integration'],
 ARRAY['React Native', 'Swift', 'Kotlin', 'JavaScript', 'REST APIs'],
 '2024-03-30'),

('DevOps Intern', 'Spotify', 'New York, NY', 'full-time', '10 weeks', '$7,200/month',
 'Work on infrastructure automation and deployment pipelines for music streaming platform.',
 ARRAY['Linux experience', 'Scripting knowledge', 'Cloud platforms familiarity'],
 ARRAY['Docker', 'Kubernetes', 'AWS', 'Python', 'Terraform'],
 '2024-04-05'),

('Machine Learning Intern', 'OpenAI', 'San Francisco, CA', 'full-time', '16 weeks', '$9,000/month',
 'Research and develop AI models, contributing to cutting-edge artificial intelligence projects.',
 ARRAY['ML/AI coursework', 'Research experience', 'Strong math background'],
 ARRAY['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning'],
 '2024-04-15');

-- Insert sample users (for testing)
INSERT INTO users (email, first_name, last_name, university, major, graduation_year, career_goal) VALUES
('alex.smith@university.edu', 'Alex', 'Smith', 'Stanford University', 'Computer Science', '2025', 'software-engineering'),
('sarah.chen@mit.edu', 'Sarah', 'Chen', 'MIT', 'Computer Science', '2024', 'software-engineering'),
('mike.johnson@berkeley.edu', 'Mike', 'Johnson', 'UC Berkeley', 'Data Science', '2025', 'data-science'),
('emma.wilson@cmu.edu', 'Emma', 'Wilson', 'Carnegie Mellon', 'Human-Computer Interaction', '2024', 'product-design');
