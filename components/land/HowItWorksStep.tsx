import React from 'react';

type HowItWorksStepProps = {
  number: string;
  title: string;
  description: string;
};

export default function HowItWorksStep({ number, title, description }: HowItWorksStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="font-bold text-xl md:text-2xl mb-2 text-white">{number}</div>
      <div className="mb-1 text-base md:text-lg text-white font-semibold">{title}</div>
      <div className="text-sm md:text-base text-white/80">{description}</div>
    </div>
  );
}