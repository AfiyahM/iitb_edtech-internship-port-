import React from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';

// File: app/resume-builder/page.tsx

export default function ResumeBuilder() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Resume Builder</h1>

        <div className="linkedin-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Your Resume Progress</h2>
          <p className="text-linkedin-gray mb-2">Completion: 75%</p>
          <div className="w-full bg-[#e9e5df] rounded-full h-2.5 mb-4">
            <div className="bg-linkedin-blue h-2.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-linkedin-gray mb-4">Our AI suggests adding more details about your projects and skills to reach 100%.</p>
          <button className="linkedin-primary-button">Complete Resume With AI</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="linkedin-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">AI-Powered Suggestions</h2>
            <ul className="list-disc list-inside text-linkedin-gray space-y-2">
              <li>Consider adding quantifiable achievements to your experience section.</li>
              <li>Expand on your project descriptions, highlighting your role and impact.</li>
              <li>Include more industry-specific keywords for better ATS matching.</li>
              <li>Review your skills section for relevance to your target roles.</li>
            </ul>
            <button className="linkedin-primary-button mt-4">Generate Suggestions</button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Resume Templates</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-linkedin-border rounded-md p-3 text-center hover:border-linkedin-blue cursor-pointer">
                <Image src="/template1.svg" alt="Template 1" width={100} height={100} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Modern</p>
              </div>
              <div className="border border-gray-300 rounded-md p-3 text-center hover:border-purple-600 cursor-pointer">
                <Image src="/template2.svg" alt="Template 2" width={100} height={100} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Professional</p>
              </div>
              <div className="border border-gray-300 rounded-md p-3 text-center hover:border-purple-600 cursor-pointer">
                <Image src="/template3.svg" alt="Template 3" width={100} height={100} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Creative</p>
              </div>
              <div className="border border-gray-300 rounded-md p-3 text-center hover:border-purple-600 cursor-pointer">
                <Image src="/template4.svg" alt="Template 4" width={100} height={100} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Minimalist</p>
              </div>
            </div>
            <button className="linkedin-primary-button mt-4">View All Templates</button>
          </div>
        </div>

        <div className="mt-6 linkedin-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Need Help?</h2>
          <p className="text-linkedin-gray mb-4">Our career advisors can review your resume and provide personalized feedback.</p>
          <button className="linkedin-primary-button">Contact Support</button>
        </div>
      </div>
    </DashboardLayout>
  );
}