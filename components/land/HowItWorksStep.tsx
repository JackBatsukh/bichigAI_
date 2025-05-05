import React from 'react';

type HowItWorksStepProps = {
  number: string;
  title: string;
  description: string;
};

export default function HowItWorksStep({ number, title, description }: HowItWorksStepProps) {
  return (
    <div className="glass p-6 flex-1 text-center">
      <div className="font-bold text-2xl mb-2 text-white">{number}</div>
      <div className="mb-1 text-white font-semibold">{title}</div>
      <div className="text-white/80 text-sm">{description}</div>
    </div>
  );
} 