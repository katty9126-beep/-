
import React, { useState, useRef, useEffect } from 'react';
import { MonthlySpecialItem, SiteConfig } from '../types';

interface MonthlySpecialsProps {
  isAdmin: boolean;
  specials: MonthlySpecialItem[];
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  onUpdateSpecials: (items: MonthlySpecialItem[]) => void;
}

const MonthlySpecials: React.FC<MonthlySpecialsProps> = ({ isAdmin, specials, siteConfig, onUpdateConfig, onUpdateSpecials }) => {
  const [showManager, setShowManager] = useState(false);
  const [tempSpecials, setTempSpecials] = useState<MonthlySpecialItem[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { monthlySpecialsConfig, theme } = siteConfig;

  const openManager = () => {
    setTempSpecials([...specials]);
    setShowManager(true);
  };

  const handleSaveManager = () => {
    onUpdateSpecials(tempSpecials);
    localStorage.setItem('nail_monthly_specials', JSON.stringify(tempSpecials));
    setShowManager(false);
  };

  return (
    <section id="specials" className="py-60 px-10 max-w-[100rem] mx-auto scroll-mt-32 reveal">
      <div className={`mb-40 flex flex-col items-center text-center`}>
        {isAdmin ? (
          <div className="flex flex-col items-center w-full mb-10">
             <input className="bg-transparent text-center border-b border-dashed border-zinc-200 outline-none uppercase font-bold tracking-[1em] w-full max-w-2xl py-4" style={{ color: monthlySpecialsConfig.subtitleColor, fontSize: `${monthlySpecialsConfig.subtitleSize}px` }} value={monthlySpecialsConfig.subtitle} onChange={e => onUpdateConfig({...siteConfig, monthlySpecialsConfig: {...monthlySpecialsConfig, subtitle: e.target.value}})} />
             <input className="bg-transparent text-center border-b border-dashed border-zinc-200 outline-none font-serif w-full mt-10 py-6" style={{ color: monthlySpecialsConfig.titleColor, fontSize: `${monthlySpecialsConfig.titleSize}px` }} value={monthlySpecialsConfig.title} onChange={e => onUpdateConfig({...siteConfig, monthlySpecialsConfig: {...monthlySpecialsConfig, title: e.target.value}})} />
          </div>
        ) : (
          <>
            <span className="uppercase font-bold tracking-[1.2em] mb-8 opacity-30" style={{ color: monthlySpecialsConfig.subtitleColor, fontSize: `${monthlySpecialsConfig.subtitleSize}px` }}>{monthlySpecialsConfig.subtitle}</span>
            <h2 className="font-serif leading-tight text-8xl md:text-9xl mb-20" style={{ color: monthlySpecialsConfig.titleColor }}>{monthlySpecialsConfig.title}</h2>
          </>
        )}
        
        {isAdmin && (
          <button onClick={openManager} className="mb-20 px-16 py-8 bg-zinc-900 text-white rounded-full text-[12px] font-bold tracking-[0.6em] uppercase hover:scale-105 transition-all shadow-2xl">
            編輯當月限定系列
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32">
        {specials.map((item) => (
          <div key={item.id} className="group flex flex-col h-full animate-in fade-in duration-1000">
            <div className="relative overflow-hidden aspect-square mb-12 shadow-sm transition-all duration-700 hover:shadow-2xl">
              <img src={item.image} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={item.title} />
            </div>
            <div className={`flex flex-col items-center text-center`}>
                <h3 className="font-serif mb-6 tracking-widest text-5xl" style={{ color: monthlySpecialsConfig.itemTitleColor }}>{item.title}</h3>
                <p className="font-bold mb-8 tracking-[0.4em] text-2xl" style={{ color: monthlySpecialsConfig.priceColor }}>{item.price}</p>
                <div className="w-12 h-0.5 bg-black/10 mb-8"></div>
                <p className="text-2xl font-light leading-[2] opacity-50 px-6">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showManager && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-10 animate-in zoom-in duration-500">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowManager(false)}></div>
          <div className="relative bg-[#0d0d0d] w-full max-w-6xl h-[85vh] rounded-[4rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
             <div className="p-12 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                <div>
                   <h5 className="text-white text-2xl font-serif tracking-widest uppercase">限定系列管理</h5>
                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">控制當月主打款式的排版與價格細節</p>
                </div>
                <button onClick={handleSaveManager} className="px-12 py-5 bg-indigo-600 text-white rounded-full text-[12px] font-bold uppercase tracking-widest shadow-xl">儲存並應用</button>
             </div>
             <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
                {tempSpecials.map((item, idx) => (
                   <div key={item.id} className="bg-white/5 p-10 rounded-[3rem] border border-white/5 flex items-center gap-12 group/item">
                      <div className="w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl border border-white/10 cursor-pointer hover:scale-105 transition-all">
                         <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-10">
                         <div className="space-y-4">
                           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">款式名稱</p>
                           <input className="bg-zinc-900/50 text-white w-full text-2xl font-serif outline-none p-5 rounded-2xl border border-white/5 focus:border-indigo-500" value={item.title} onChange={e => setTempSpecials(tempSpecials.map(it => it.id === item.id ? {...it, title: e.target.value} : it))} />
                         </div>
                         <div className="space-y-4">
                           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">標價金額</p>
                           <input className="bg-zinc-900/50 text-indigo-400 w-full text-2xl font-bold outline-none p-5 rounded-2xl border border-white/5 focus:border-indigo-500" value={item.price} onChange={e => setTempSpecials(tempSpecials.map(it => it.id === item.id ? {...it, price: e.target.value} : it))} />
                         </div>
                      </div>
                      <button onClick={() => setTempSpecials(tempSpecials.filter(it => it.id !== item.id))} className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">✕</button>
                   </div>
                ))}
                <button onClick={() => setTempSpecials([...tempSpecials, { id: `s-${Date.now()}`, title: '新款', price: '$0', description: '', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800' }])} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[4rem] text-zinc-500 hover:text-indigo-400 hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-[12px]">+ 新增一張限定卡片</button>
             </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MonthlySpecials;
