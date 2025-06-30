import React from "react";

interface ProgressProps {
  value: number;
}

export const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full">
      <div
        className="h-3 bg-purple-600 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
