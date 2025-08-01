import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Target, Users, Zap, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 AI-Powered Career Platform
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Land Your Dream Internship with <span className="text-blue-600">AI Guidance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            InternDeck uses advanced AI to provide personalized internship recommendations, resume optimization, skill
            development paths, and realistic mock interviews.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive tools to help you discover, prepare for, and land your ideal
            internship.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>AI-Powered Matching</CardTitle>
              <CardDescription>
                Get personalized internship recommendations based on your skills, goals, and preferences using advanced
                AI algorithms.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Smart Resume Builder</CardTitle>
              <CardDescription>
                Create ATS-optimized resumes with AI feedback and industry-specific templates tailored to your target
                roles.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Mock Interviews</CardTitle>
              <CardDescription>
                Practice with AI-driven mock interviews and peer-to-peer sessions to build confidence and improve
                performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Skill Development</CardTitle>
              <CardDescription>
                Follow personalized learning paths designed for your career goals with progress tracking and skill gap
                analysis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-teal-600 mb-4" />
              <CardTitle>Application Tracker</CardTitle>
              <CardDescription>
                Manage your internship applications, deadlines, and interview schedules in one organized dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Star className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Stay informed with instant notifications about new opportunities, interview invitations, and progress
                milestones.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Internship Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have successfully landed internships with InternDeck.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Start Your Journey Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">InternDeck</h3>
              <p className="text-gray-400">AI-powered platform helping students land their dream internships.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/demo">Demo</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/guides">Guides</Link>
                </li>
                <li>
                  <Link href="/support">Support</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InternDeck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
