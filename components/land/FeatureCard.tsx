import React from 'react';
import { FiFileText } from 'react-icons/fi';

type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="glass p-6 md:p-8 min-h-[200px] md:min-h-[220px] flex flex-col gap-3 md:gap-4 items-start w-full 
      bg-gradient-to-br from-white/5 to-blue-900/10 border-2 border-cyan-400/40 
      hover:border-cyan-500 hover:bg-cyan-900/20 transition duration-200 cursor-pointer
      rounded-lg shadow-md">
      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
        <FiFileText size={28} className="text-blue-400 drop-shadow md:text-3xl" />
        <span className="font-semibold text-base md:text-lg text-white">{title}</span>
      </div>
      <div className="text-sm md:text-base text-white/80 leading-relaxed">{description}</div>
    </div>
  );
}