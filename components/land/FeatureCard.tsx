import React from 'react';
import { FiFileText } from 'react-icons/fi';


type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="glass p-8 min-h-[220px] flex flex-col gap-4 items-start w-full bg-gradient-to-br from-white/5 to-blue-900/10 border-2 border-cyan-400/40 hover:border-cyan-500 hover:bg-cyan-900/20 transition duration-200 cursor-pointer">
      <div className="flex items-center gap-3 mb-2">
        <FiFileText size={36} className="text-blue-400 drop-shadow" />
        <span className="font-semibold text-lg text-white">{title}</span>
      </div>
      <div className="text-base text-white/80 leading-relaxed">{description}</div>
    </div>
  );
} 