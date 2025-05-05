import React from 'react';
import HowItWorksStep from './HowItWorksStep';

const steps = [
  {
    number: '01',
    title: 'Баримт бичгээ байршуулна',
    description: 'Таны баримт бичиг манай Cloud серверт хадгалагдана.',
  },
  {
    number: '02',
    title: 'AI боловсруулалт, дүн шинжилгээ хийх',
    description: 'Манай хиймэл оюун ухаан баримтыг боловсруулж, дүн шинжилгээ хийж, өгөгдөл гаргана.',
  },
  {
    number: '03',
    title: 'Өгөгдөл задлах',
    description: 'Шинжилгээний үр дүнг хүссэн хэлбэрээрээ татаж авах боломжтой.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mb-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white">
  Хэрхэн ажилладаг вэ
</h1>

      <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mx-auto mb-6" />
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {steps.map((step, i) => (
          <div key={i} className="flex-1">
            <div className="glass border-2 border-cyan-400/40 hover:border-cyan-500 hover:bg-cyan-900/20 transition duration-200 cursor-pointer p-6 h-full flex flex-col items-center justify-center">
              <HowItWorksStep {...step} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 