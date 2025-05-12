import React from 'react';

type PricingCardProps = {
  title: React.ReactNode;
  children?: React.ReactNode;
};

export default function PricingCard({ title, children }: PricingCardProps) {
  return (
    <div className="glass w-full p-5 md:p-6 lg:p-8 flex-1 text-center border-2 border-cyan-400/40 
      hover:border-cyan-500 hover:bg-cyan-900/20 transition duration-200 cursor-pointer 
      flex flex-col items-center min-w-[280px] max-w-[340px] mx-auto shadow-xl rounded-lg">
      <div className="font-bold mb-4 text-white text-xl md:text-2xl tracking-wide relative">
        {title}
      </div>
      {children}
    </div>
  );
}