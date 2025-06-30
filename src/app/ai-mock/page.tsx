"use client";
import React, { useState } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";

interface PrepCardProps {
  title: string;
  description: string;
  imageSrc: string;
  buttonText: string;
  onClick?: () => void;
}

const PrepCard: React.FC<PrepCardProps> = ({
  title,
  description,
  imageSrc,
  buttonText,
  onClick,
}) => (
  <div className="linkedin-card animated-card p-6 flex items-center space-x-4 bg-white rounded-xl shadow-md border border-linkedin-border hover:shadow-xl transition-shadow duration-300 cursor-pointer">
    <div className="flex-shrink-0">
      <Image src={imageSrc} alt={title} width={80} height={80} className="rounded-lg" />
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-1 text-linkedin-dark">{title}</h3>
      <p className="text-linkedin-gray text-sm mb-3">{description}</p>
      <button className="linkedin-primary-button text-sm transition-transform duration-200 hover:scale-105" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  </div>
);

export default function AIMockInterview() {
  const [showMockInterview, setShowMockInterview] = useState(false);

  const handleStartMockInterview = () => {
    setShowMockInterview(true);
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-linkedin-bg min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-linkedin-dark tracking-tight animate-fadein">AI Mock Interview</h1>

        {!showMockInterview ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PrepCard
              title="AI Mock Interview"
              description="Practice with AI-powered mock interviews and get instant feedback."
              imageSrc="/ai-mock-interview.svg"
              buttonText="Start Mock Interview"
              onClick={handleStartMockInterview}
            />
            <PrepCard
              title="Personalized Study Paths"
              description="AI-driven study plans tailored to your strengths and weaknesses."
              imageSrc="/prep-preview.svg"
              buttonText="Explore Study Paths"
            />
            <PrepCard
              title="Resume Builder with AI Feedback"
              description="Build a professional resume and get AI suggestions for improvement."
              imageSrc="/resume-builder.svg"
              buttonText="Build My Resume"
            />
            <PrepCard
              title="Career Path Recommender"
              description="Discover career paths that align with your skills and interests."
              imageSrc="/career-paths.svg"
              buttonText="Find My Path"
            />
          </div>
        ) : (
          <div className="flex flex-1 justify-center py-5 bg-white rounded-xl shadow-lg animate-fadein">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-linkedin-dark tracking-light text-[32px] font-bold leading-tight">AI Interview Prep</p>
                  <p className="text-linkedin-gray text-sm font-normal leading-normal">Practice with AI to ace your interviews</p>
                </div>
              </div>
              <div className="p-4">
                <div
                  className="relative flex items-center justify-center bg-linkedin-gradient bg-cover bg-center aspect-video rounded-xl p-4 shadow-md animate-popin"
                  style={{
                    backgroundImage:
                      'linear-gradient(120deg, #0072b1 0%, #005983 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCrnu5S1obDR3SEOn3KDwb1qTazRB8eJ1ad-jQz9Epk0LYb_VEbt37fulHnZlYllKLfTvyWn5-QAT6SHtEENU6wcVyDRYVgLO0EG696kN910wMfGx51TyceGa8Mj7UDM0E63kq8uaRJFdqLRMKVTXlholRdk8fV0i05VRemcNwEpm_MVDwJvA2O9W8di_bcYLnFcYV4QnwuWUlA58qQNEGjHizdXj1la71DWvMHKEgguxfJwecbwYg0PwaPuGDWAX1dYOnEVsPNMoRo")',
                  }}
                >
                  <button className="flex shrink-0 items-center justify-center rounded-full size-16 bg-linkedin-blue/70 text-white shadow-lg hover:scale-110 transition-transform duration-200">
                    <div className="text-inherit" data-icon="Play" data-size="24px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <textarea
                    placeholder="Type your answer here..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border border-linkedin-border bg-white focus:border-linkedin-blue min-h-36 placeholder:text-linkedin-gray p-[15px] text-base font-normal leading-normal transition-shadow duration-200 focus:shadow-linkedin"
                  ></textarea>
                </label>
              </div>
              <div className="flex px-4 py-3 justify-end">
                <button className="linkedin-primary-button hover:scale-105 transition-transform duration-200">
                  <span className="truncate">Submit</span>
                </button>
              </div>
              <h3 className="text-linkedin-dark text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Feedback</h3>
              <p className="text-linkedin-dark text-base font-normal leading-normal pb-3 pt-1 px-4">Score: 85/100</p>
              <p className="text-linkedin-gray text-base font-normal leading-normal pb-3 pt-1 px-4">Suggestions: Improve your communication style, focus on clarity and conciseness.</p>
            </div>
          </div>
        )}

        {!showMockInterview && (
          <section className="mt-12 linkedin-card p-6 rounded-xl shadow-md border border-linkedin-border bg-white animate-fadein">
            <h2 className="text-xl font-semibold mb-4 text-linkedin-dark">Upcoming AI Prep Workshops</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-linkedin-border pb-2">
                <div>
                  <h3 className="font-medium text-linkedin-dark">Mastering Behavioral Interviews with AI</h3>
                  <p className="text-linkedin-gray text-sm">Date: October 26, 2023 | Time: 3:00 PM PST</p>
                </div>
                <button className="linkedin-secondary-button text-sm hover:bg-linkedin-blue/10 transition-colors duration-200">Register</button>
              </li>
              <li className="flex justify-between items-center border-b border-linkedin-border pb-2">
                <div>
                  <h3 className="font-medium text-linkedin-dark">Technical Interview Prep: Data Structures & Algorithms</h3>
                  <p className="text-linkedin-gray text-sm">Date: November 2, 2023 | Time: 10:00 AM PST</p>
                </div>
                <button className="linkedin-secondary-button text-sm hover:bg-linkedin-blue/10 transition-colors duration-200">Register</button>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-linkedin-dark">Crafting a Winning Resume for Tech Roles</h3>
                  <p className="text-linkedin-gray text-sm">Date: November 9, 2023 | Time: 1:00 PM PST</p>
                </div>
                <button className="linkedin-secondary-button text-sm hover:bg-linkedin-blue/10 transition-colors duration-200">Register</button>
              </li>
            </ul>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
