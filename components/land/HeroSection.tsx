import React from 'react';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center  mb-8 h-[85vh]">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white leading-tight max-w-[1024px] mx-auto">
        Баримт бичгээс өгөгдөлд дүн шинжилгээ хийх, задлах
      </h1>
      <p className="mb-4 text-white/80 max-w-[1024px] mx-auto text-lg">
        Баримт бичгээ хялбархан боловсруулж, дүн шинжилгээ хийж, задлах боломжтой онцлог платформ. Манай хиймэл оюун ухаанд суурилсан платформ нь аливаа баримт бичгийн мэдээллийг шууд шинжилж, задлахад тусална.
      </p>
      <button className="mt-2 px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg">Эхлэх</button>
    </section>
  );
} 