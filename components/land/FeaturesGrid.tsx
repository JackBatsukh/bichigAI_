import React from 'react';
import FeatureCard from './FeatureCard';

const features = [
  {
    title: 'PDF, Word, зураг таних',
    description: 'PDF, Word, Voice, Text зэрэг өгөгдлийг автоматаар ялган танина.',
  },
  {
    title: 'AI дүн шинжилгээ',
    description: 'Хиймэл оюун ухаан ашиглан баримтын агуулгыг гүнзгий дүн шинжилгээ хийж, гол санаа, өгөгдлийг гаргана.',
  },
  {
    title: 'Олон хэлний дэмжлэг',
    description: 'Монгол, Англи хэл дээрх баримтыг боловсруулана.',
  },
  {
    title: 'Хурдан боловсруулалт',
    description: 'Баримтыг хэдхэн секундэд боловсруулж, үр дүнг шууд харуулна.',
  },
  {
    title: 'Хэрэглэхэд хялбар интерфейс',
    description: 'Орчин үеийн, ойлгомжтой хэрэглэгчийн интерфейсээр хялбархан ашиглах боломж.',
  },
  {
    title: 'Өгөгдөл татах',
    description: 'Шинжилгээний үр дүнг Excel, CSV болон бусад форматаар татаж авах боломж.',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-16 md:py-24 flex flex-col gap-8 md:gap-16">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white">
          Хүчирхэг баримт бичгийн шинжилгээ
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mx-auto mb-6" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-0">
        {features.map((feature, i) => (
          <FeatureCard key={i} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  );
}