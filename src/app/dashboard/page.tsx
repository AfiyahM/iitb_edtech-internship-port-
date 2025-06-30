// File: app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Award, Rocket } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';

function FloatingCareerRocket() {
  return (
    <mesh rotation={[0.2, 0.3, 0.1]} position={[0, 0, 0]}>
      <coneGeometry args={[0.3, 0.7, 32]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
}

function ThreeHero() {
  return (
    <div className="w-full h-72 rounded-xl overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />
          <FloatingCareerRocket />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session) return router.push('/login');
      setUser(session.user);

      const { data, error: userError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      if (data?.full_name) {
        setUserName(data.full_name);
      } else if (session.user.email) {
        setUserName(session.user.email.split('@')[0]); // fallback
      } else {
        setUserName('User');
      }

      const { data: goalsData } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('deadline', { ascending: true })
        .limit(3);

      if (goalsData) setGoals(goalsData);
    };
    fetchUser();
  }, [router]);

  if (!user) return null; // Wait until session is fetched

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-blue-800 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles size={28} className="text-yellow-500" />
            Welcome back, {userName}!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl">
            You’re one step closer to your dream career. Let’s make it happen with small, consistent steps 🚀
          </p>
        </div>

        <ThreeHero />

        {goals.length > 0 && (
          <section className="mb-10 mt-10 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Rocket size={20} className="text-purple-500" /> Your Career Goals
            </h3>
            <div className="space-y-3">
              {goals.map((goal, i) => (
                <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                  <h4 className="text-blue-600 dark:text-blue-400 font-medium">{goal.title}</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Deadline: {goal.deadline}</p>
                  <span className="inline-block text-xs px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full mt-1">
                    {goal.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10 mt-12">
          <h3 className="text-xl font-semibold mb-3">Mini Internship Browser</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: 'Web Development Intern', company: 'InnovateX' },
              { title: 'ML Intern', company: 'DataWave' },
              { title: 'UI/UX Intern', company: 'CreativeEdge' }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-md hover:shadow-lg transition">
                <h4 className="font-medium text-lg text-blue-600 dark:text-blue-400">{item.title}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.company}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg mb-1">AI Mock Interview</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Practice your interview skills with instant feedback powered by AI.
              </p>
            </div>
            <Button>Launch Interview</Button>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-yellow-500" />
              <h3 className="font-semibold text-lg">Resume Progress Tracker</h3>
            </div>
          </div>
          <Progress value={75} />
          <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-300">
            Your resume is 75% complete. Add more details about your projects to get noticed!
          </p>
          <Button className="mt-3">Complete with AI</Button>
        </section>
      </main>
    </div>
  );
}
