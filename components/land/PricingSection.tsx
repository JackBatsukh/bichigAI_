import React from 'react';
import PricingCard from './PricingCard';

export default function PricingSection() {
  return (
    <section id="pricing" className="mb-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white">
  Энгийн, Боломжит үнэ
</h1>


      <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mx-auto mb-6" />
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        <PricingCard title={
          <div className="flex flex-col items-center w-full min-h-[56px] justify-end">
            <span className="text-2xl font-bold text-white mb-1">Basic</span>
          </div>
        }>
          <div className="flex flex-col h-full justify-between items-center w-full">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">₮0</div>
              <ul className="text-white/80 text-sm mb-6 space-y-1 text-left mx-auto max-w-[220px]">
                <li>✓ 1 баримт шинжлэх</li>
                <li>✓ Үндсэн AI шинжилгээ</li>
                <li>✓ Хязгаарлагдмал дүн шинжилгээ</li>
                <li>✓ Хэрэглэхэд хялбар интерфейс</li>
                <li>✓ Үнэгүй турших боломж</li>
              </ul>
            </div>
            <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow w-full mt-auto">Сонгох</button>
          </div>
        </PricingCard>
        <PricingCard title={
          <div className="flex flex-col items-center w-full min-h-[56px] justify-end">
            <span className="mb-2 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg z-10">Хамгийн их сонгогддог</span>
            <span className="text-2xl font-bold text-white">Premium</span>
          </div>
        }>
          <div className="flex flex-col h-full justify-between items-center w-full">
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">₮40,000</div>
              <ul className="text-white/80 text-sm mb-6 space-y-1 text-left mx-auto max-w-[220px]">
                <li>✓ Хязгааргүй баримт шинжлэх</li>
                <li>✓ Дэвшилтэт AI шинжилгээ</li>
                <li>✓ Илүү дэлгэрэнгүй тайлан</li>
                <li>✓ Тусламжийн үйлчилгээ</li>
                <li>✓ Олон хэлний дэмжлэг</li>
                <li>✓ Өгөгдөл татах (Excel, CSV)</li>
                <li>✓ Хурдан боловсруулалт</li>
              </ul>
            </div>
            <button className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow w-full mt-auto">Сонгох</button>
          </div>
        </PricingCard>
      </div>
    </section>
  );
} 