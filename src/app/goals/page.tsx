import React from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';

const CareerPathCard = ({
  title,
  description,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string;
}) => (
  <div className="linkedin-card p-6 flex flex-col items-center text-center">
    <Image src={imageSrc} alt={title} width={100} height={100} className="mb-4" />
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-linkedin-gray text-sm mb-4">{description}</p>
    <button className="linkedin-primary-button text-sm">Explore Path</button>
  </div>
);

export default function Goals() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Set Your Career Goals</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CareerPathCard
            title="Software Engineer"
            description="Build and maintain software applications and systems."
            imageSrc="/software-engineer.svg"
          />
          <CareerPathCard
            title="Product Manager"
            description="Define and oversee the development of products."
            imageSrc="/product-manager.svg"
          />
          <CareerPathCard
            title="UX/UI Designer"
            description="Design user-friendly and aesthetically pleasing interfaces."
            imageSrc="/ux-ui-designer.svg"
          />
          <CareerPathCard
            title="Data Scientist"
            description="Analyze complex data to extract insights and knowledge."
            imageSrc="/data-scientist.svg"
          />
          <CareerPathCard
            title="Digital Marketing Specialist"
            description="Develop and implement online marketing strategies."
            imageSrc="/digital-marketing.svg"
          />
          <CareerPathCard
            title="Financial Analyst"
            description="Provide guidance on investment decisions and financial planning."
            imageSrc="/financial-analyst.svg"
          />
        </div>

        <section className="mt-8 linkedin-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Personalized Career Assessment</h2>
          <p className="text-linkedin-gray mb-4">
            Not sure which path is right for you? Take our AI-powered assessment to discover your ideal career based on your skills, interests, and personality.
          </p>
          <button className="linkedin-primary-button">Start Assessment</button>
        </section>

        <section className="mt-6 linkedin-card p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Career Resources</h2>
          <ul className="list-disc list-inside text-linkedin-gray space-y-2">
            <li>Industry Insights and Trends</li>
            <li>Networking Opportunities</li>
            <li>Mentorship Programs</li>
            <li>Interview Preparation Guides</li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
}
