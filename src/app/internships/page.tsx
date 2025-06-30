'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import DropdownFilter from '@/components/DropdownFilter';
import InternshipCard from '@/components/InternshipCard';
import ChatBot from '@/components/ui/Chatbot';

interface Internship {
  title: string;
  company: string;
  location: string;
  type: string;
  tags: string[];
  duration: string;
  logo:string;
  skillsMatch: number;

}

const internships: Internship[] = [
  {
    title: 'Product Design Intern',
    company: 'Innovate Solutions',
    location: 'Remote',
    type: 'Design',
    tags: ['UI/UX'],
    duration: '3 Months',
    logo: '/logos/companyLogo1.png',
    skillsMatch: 72,

  },
  {
    title: 'Marketing Intern',
    company: 'Connect with Audiences',
    location: 'On-site',
    type: 'Marketing',
    tags: ['Content Creation'],
    duration: '6 Months',
    logo: '/logos/companyLogo2.png',
    skillsMatch: 50,

  },
  {
    title: 'Software Engineering Intern',
    company: 'Build the Future',
    location: 'Remote',
    type: 'Engineering',
    tags: ['Frontend', 'React'],
    duration: '3 Months',
    logo: '/logos/companyLogo3.png',
    skillsMatch: 80,

  },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [tag, setTag] = useState('');

  const handleSearch = (q: string) => setQuery(q);

  const filtered = internships.filter((job) => {
    const matchQuery =
      job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query);
    const matchLocation = location ? job.location.toLowerCase() === location : true;
    const matchType = type ? job.type.toLowerCase() === type : true;
    const matchDuration = duration ? job.duration.toLowerCase() === duration : true;
    const matchTag = tag ? job.tags.map((t) => t.toLowerCase()).includes(tag) : true;

    return matchQuery && matchLocation && matchType && matchDuration && matchTag;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Internships</h1>

      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <DropdownFilter
          label="Location"
          options={['Remote', 'On-site']}
          value={location}
          onChange={setLocation}
        />
        <DropdownFilter
          label="Type"
          options={['Design', 'Marketing', 'Engineering']}
          value={type}
          onChange={setType}
        />
        <DropdownFilter
          label="Duration"
          options={['3 Months', '6 Months']}
          value={duration}
          onChange={setDuration}
        />
        <DropdownFilter
          label="Tags"
          options={['UI/UX', 'Content Creation', 'Frontend', 'React']}
          value={tag}
          onChange={setTag}
        />
      </div>

      <div className="grid gap-4">
        {filtered.length > 0 ? (
          filtered.map((internship, idx) => <InternshipCard key={idx} {...internship} />)
        ) : (
          <p className="text-gray-600">No internships match your filters.</p>
        )}
      </div>
      <ChatBot />
    </div>
  );
}
