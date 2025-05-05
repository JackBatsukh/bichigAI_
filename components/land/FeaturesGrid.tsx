import React from 'react';
import FeatureCard from './FeatureCard';

const features = [
  {
    title: 'PDF, Word, зураг таних',
    description: 'PDF, Word, болон сканнердсан зурагнаас текст болон өгөгдөл автоматаар ялган танина.',
  },
  {
    title: 'AI дүн шинжилгээ',
    description: 'Хиймэл оюун ухаан ашиглан баримтын агуулгыг гүнзгий дүн шинжилгээ хийж, гол санаа, өгөгдлийг гаргана.',
  },
  {
    title: 'Олон хэлний дэмжлэг',
    description: 'Монгол, Англи болон бусад хэл дээрх баримтыг боловсруулж, орчуулга хийх боломжтой.',
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
    <section id="features" className=" mb-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white">
  Хүчирхэг баримт бичгийн шинжилгээ
</h1>


      <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mx-auto mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {features.map((feature, i) => (
          <FeatureCard key={i} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  );
}
