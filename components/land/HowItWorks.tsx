import React from 'react';
import HowItWorksStep from './HowItWorksStep';

const steps = [
  {
    number: "01",
    title: "Баримтаа байршуулна",
    description:
      "Та баримт бичгээ хялбархан байршуулж, манай найдвартай Cloud серверт хадгалуулна.",
  },
  {
    number: "02",
    title: "AI боловсруулалт ба дүн шинжилгээ",
    description:
      "Хиймэл оюун ухаан таны баримтыг боловсруулж, нарийвчилсан дүн шинжилгээ хийж өгөгдөл гаргана.",
  },
  {
    number: "03",
    title: "Үр дүнгээ шууд ашигла",
    description:
      "Шинжилгээний үндсэн дээр гарсан өгөгдлийг систем дотроосоо хялбархан үзэж, хэрэглэх боломжтой.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 md:py-24 flex flex-col gap-8 md:gap-16">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white">
          Хэрхэн ажилладаг вэ
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mx-auto mb-6" />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center px-4 md:px-6 lg:px-0">
        {steps.map((step, i) => (
          <div key={i} className="flex-1 w-full sm:max-w-none">
            <div className="glass border-2 border-cyan-400/40 hover:border-cyan-500 hover:bg-cyan-900/20 transition duration-200 cursor-pointer p-4 md:p-6 h-full rounded-lg shadow-md">
              <HowItWorksStep {...step} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}