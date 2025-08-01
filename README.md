# InternDeck - AI-Powered Internship Platform

InternDeck is a comprehensive platform that helps students discover, prepare for, and land their dream internships using AI-powered tools and personalized guidance.

## Features

### 🎯 Core Features
- **AI-Powered Internship Matching**: Get personalized internship recommendations based on your skills, goals, and preferences
- **Smart Resume Builder**: Create ATS-optimized resumes with AI feedback and industry-specific templates
- **Mock Interview Practice**: AI-driven and peer-to-peer mock interviews with real-time feedback
- **Personalized Learning Paths**: Structured learning journeys for different career tracks
- **Application Tracking**: Manage internship applications, deadlines, and interview schedules
- **Skill Gap Analysis**: Identify missing skills and get learning recommendations

### 🤖 AI Integration
- **OpenAI GPT-4**: Powers resume analysis, interview question generation, and personalized feedback
- **Real-time Analysis**: Instant scoring and suggestions for resumes and interview responses
- **Intelligent Matching**: AI algorithms match students with relevant internship opportunities

### 🎨 User Experience
- **Modern UI**: Built with Next.js and Tailwind CSS for a responsive, intuitive interface
- **Dark/Light Mode**: Customizable theme preferences
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Updates**: Live notifications and progress tracking

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **TypeScript**: Type-safe development

### Backend
- **Node.js**: Server-side runtime
- **Supabase**: Database, authentication, and real-time features
- **PostgreSQL**: Relational database

### AI & APIs
- **OpenAI API**: GPT-4 for AI-powered features
- **AI SDK**: Vercel's AI toolkit for seamless integration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/interndeck-platform.git
cd interndeck-platform
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your environment variables:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
\`\`\`

4. Set up the database:
\`\`\`bash
# Run the database setup script in your Supabase SQL editor
# Execute scripts/database-setup.sql
# Then execute scripts/seed-data.sql for sample data
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

\`\`\`
interndeck-platform/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── dashboard-layout.tsx
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── openai.ts         # OpenAI integration
├── scripts/              # Database scripts
└── README.md
\`\`\`

## Key Components

### Authentication
- Supabase Auth with email/password and OAuth
- Protected routes and session management
- User profile creation and management

### Dashboard
- Personalized internship recommendations
- Progress tracking and analytics
- Quick actions and notifications

### Resume Builder
- AI-powered resume analysis and scoring
- Industry-specific templates
- Real-time feedback and suggestions

### Mock Interviews
- AI-generated interview questions
- Peer-to-peer interview sessions
- Performance tracking and improvement suggestions

### Learning Paths
- Career-specific learning modules
- Progress tracking and achievements
- Skill development recommendations

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Resume
- `POST /api/resume/analyze` - Analyze resume content

### Interviews
- `POST /api/interviews/generate` - Generate interview questions
- `POST /api/interviews/evaluate` - Evaluate interview responses

### Learning
- `POST /api/learning/path` - Generate personalized learning path

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User profiles and preferences
- `internships` - Available internship opportunities
- `applications` - User internship applications
- `resumes` - Resume data and analysis
- `mock_interviews` - Interview sessions and scores
- `learning_progress` - Learning path progress tracking

## Development Phases

### Phase 1: Foundation ✅
- User authentication and basic UI
- Landing page and dashboard layout
- Database setup and basic API routes

### Phase 2: Core Features 🚧
- Internship search and filtering
- Resume builder with AI analysis
- Basic mock interview functionality

### Phase 3: AI Integration 📋
- Advanced AI-powered recommendations
- Comprehensive interview practice
- Skill gap analysis and learning paths

### Phase 4: Enhancement 📋
- Peer-to-peer features
- Advanced analytics and reporting
- Mobile app development

### Phase 5: Scale & Polish 📋
- Performance optimization
- Advanced AI features
- Enterprise features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Optional: Analytics, monitoring, etc.
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
\`\`\`

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@interndeck.com
- Documentation: [docs.interndeck.com](https://docs.interndeck.com)

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for backend infrastructure
- [OpenAI](https://openai.com/) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
