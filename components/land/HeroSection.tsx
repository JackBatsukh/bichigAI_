import React from "react";

export default function HeroSection() {
  return (
    <section className="flex flex-col gap-4 md:gap-6 items-center justify-center text-center py-16 md:py-32 lg:py-40 px-4 md:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4 text-white leading-tight max-w-3xl mx-auto">
        Баримт бичгээс өгөгдөлд дүн шинжилгээ хийх, задлах
      </h1>
      <p className="mb-4 text-white/80 max-w-2xl mx-auto text-base md:text-lg">
        Баримт бичгээ хялбархан боловсруулж, дүн шинжилгээ хийж, задлах
        боломжтой онцлог платформ. Манай хиймэл оюун ухаанд суурилсан платформ
        нь аливаа баримт бичгийн мэдээллийг шууд шинжилж, задлахад тусална.
      </p>
      <button className="mt-2 px-6 md:px-8 py-2 md:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition">
        Эхлэх
      </button>
    </section>
  );
}