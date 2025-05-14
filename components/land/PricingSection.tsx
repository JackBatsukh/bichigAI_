"use client";

import React, { useState } from "react";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handlePremiumClick = () => {
    setShowPremiumModal(true);
  };

  const closePremiumModal = () => {
    setShowPremiumModal(false);
  };

  return (
    <section id="pricing" className="py-16 md:py-24 relative flex flex-col gap-8 md:gap-16 min-h-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white">
          Энгийн, Боломжит үнэ
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mx-auto mb-6" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch px-4 md:px-0">
        <PricingCard
          title={
            <div className="flex flex-col items-center w-full min-h-[56px] justify-end">
              <span className="text-2xl font-bold text-white mb-1">Basic</span>
            </div>
          }
        >
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
            <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow w-full mt-auto transition">
              Сонгох
            </button>
          </div>
        </PricingCard>
        <PricingCard
          title={
            <div className="flex flex-col items-center w-full min-h-[56px] justify-end">
              <span className="mb-2 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg z-10">
                Хамгийн их сонгогддог
              </span>
              <span className="text-2xl font-bold text-white">Premium</span>
            </div>
          }
        >
          <div className="flex flex-col h-full justify-between items-center w-full">
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                ₮10,000
              </div>
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
            <button 
              className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow w-full mt-auto transition"
              onClick={handlePremiumClick}
            >
              Сонгох
            </button>
          </div>
        </PricingCard>
      </div>

      {/* Premium Purchase Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 md:p-6 max-w-md w-full mx-auto relative">
            <button 
              onClick={closePremiumModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="flex items-center mb-4">
              <span className="bg-yellow-400 p-2 rounded-full mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
                </svg>
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">Премиум хэрэглэгч болох</h2>
            </div>
            
            <div className="mb-6">
              <div className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">₮10,000 / сар</div>
              <p className="text-white/80 text-sm mb-4">
                Бүх премиум онцлогуудыг ашиглана уу
              </p>
              
              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-white mb-2">Дансны мэдээлэл</h3>
                <p className="text-white/80 text-sm">
                  Банк: Хаан Банк<br />
                  Дансны дугаар: 5619400116<br />
                  Хүлээн авагч: БичигAI ХХК
                </p>
              </div>
              
              <p className="text-white/80 text-sm mb-4">
                Дээрх дансанд шилжүүлэг хийсний дараа имэйл хаягаа оруулж баталгаажуулна уу.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">
                И-мэйл хаяг
              </label>
              <input 
                type="email" 
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                placeholder="example@mail.com" 
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded transition">
                Баталгаажуулах
              </button>
              <button 
                onClick={closePremiumModal}
                className="w-full py-2 bg-transparent border border-slate-600 hover:bg-slate-700 text-white font-medium rounded transition"
              >
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}