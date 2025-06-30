import Image from 'next/image';

interface InternshipCardProps {
  title: string;
  company: string;
  location: string;
  logo: string;
  skillsMatch: number;
}
export default function InternshipCard({
  title,
  company,
  location,
  logo,
  skillsMatch,
}: InternshipCardProps) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (skillsMatch / 100) * circumference;

  return (
    <div className="flex items-start justify-between gap-4 p-4 border rounded-md shadow-sm bg-white relative">
      <div className="flex gap-4 items-start">
        <Image
          src={logo}
          alt={`${company} logo`}
          width={48}
          height={48}
          className="rounded object-contain"
        />
        <div>
          <p className="text-sm text-purple-600">{location}</p>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600">{company}</p>
        </div>
      </div>

      <div className="flex items-end gap-10">
        {/* Pie Chart */}
        <div className="relative w-12 h-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="#e5e7eb" // gray-200
              strokeWidth="6"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="#8b5cf6" // purple-600
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
            {skillsMatch}%
          </div>
          <p className='font-bold'>Skills</p>
        </div>

        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
          Apply
        </button>
      </div>
    </div>
  );
}
