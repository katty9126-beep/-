
import React, { useState, useRef } from 'react';
import { NailArtWork, HeroData, SiteConfig } from '../types';

interface HeroProps {
  isAdmin: boolean;
  onExplore: () => void;
  onBook: () => void;
  recentWorks: NailArtWork[];
  heroData: HeroData;
  siteConfig: SiteConfig;
  onUpdateHero: (data: HeroData) => void;
  onUpdateConfig: (config: SiteConfig) => void;
}

const Hero: React.FC<HeroProps> = ({ isAdmin, onExplore, onBook, recentWorks, heroData, siteConfig, onUpdateHero, onUpdateConfig }) => {
  const [showDesigner, setShowDesigner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { heroConfig, theme } = siteConfig;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateHero({ ...heroData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const updateStyle = (field: keyof typeof heroConfig, value: any) => {
    onUpdateConfig({
      ...siteConfig,
      heroConfig: { ...heroConfig, [field]: value }
    });
  };

  const handleSave = () => {
    localStorage.setItem('nail_art_hero', JSON.stringify(heroData));
    localStorage.setItem('nail_site_config', JSON.stringify(siteConfig));
    alert('✨ 形象設計已全面儲存！');
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-60 pb-40 relative overflow-hidden bg-transparent reveal">
      <div className={`max-w-[100rem] w-full relative z-10 flex flex-col items-center text-center`}>
        
        {isAdmin && (
          <div className="mb-20 flex flex-wrap justify-center gap-6">
            <button onClick={() => setShowDesigner(!showDesigner)} className="px-10 py-4 bg-indigo-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              調整文字樣式
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="px-10 py-4 bg-white border border-zinc-200 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm">更換背景影像</button>
            <button onClick={handleSave} className="px-10 py-4 bg-black text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl">儲存所有變更</button>
          </div>
        )}

        {/* Hero 設計師面板 */}
        {isAdmin && showDesigner && (
          <div className="absolute top-40 right-10 bg-white/95 backdrop-blur-3xl p-10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-gray-100 w-80 z-[100] text-left animate-in zoom-in duration-300">
            <div className="space-y-8">
              <h5 className="text-[10px] font-black tracking-widest uppercase text-indigo-500 mb-6">HERO 視覺設計師</h5>
              
              <div className="space-y-4">
                <p className="text-[8px] font-bold text-gray-400 uppercase">標題大小 ({heroConfig.titleSize}px)</p>
                <input type="range" min="40" max="250" value={heroConfig.titleSize} onChange={e => updateStyle('titleSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
              </div>

              <div className="space-y-4">
                <p className="text-[8px] font-bold text-gray-400 uppercase">內文描述大小 ({heroConfig.descSize}px)</p>
                <input type="range" min="16" max="80" value={heroConfig.descSize} onChange={e => updateStyle('descSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[7px] text-gray-400 uppercase font-bold">標題顏色</p>
                  <input type="color" value={heroConfig.titleColor} onChange={e => updateStyle('titleColor', e.target.value)} className="w-full h-10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <p className="text-[7px] text-gray-400 uppercase font-bold">內文顏色</p>
                  <input type="color" value={heroConfig.descColor} onChange={e => updateStyle('descColor', e.target.value)} className="w-full h-10 rounded-xl" />
                </div>
              </div>

              <button onClick={() => setShowDesigner(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase">完成設定</button>
            </div>
          </div>
        )}

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

        <p className="text-[14px] tracking-[1.5em] font-bold uppercase mb-12 opacity-30" style={{ color: heroConfig.tagColor }}>{heroData.studioName} • {heroData.location}</p>
        
        <h1 className="mb-20 flex flex-col items-center w-full">
          {isAdmin ? (
            <input 
              className="bg-transparent text-center border-b border-zinc-100 italic mb-12 w-full max-w-5xl outline-none focus:border-black py-4 font-serif" 
              style={{ fontSize: `${heroConfig.subtitleSize}px`, color: heroConfig.subtitleColor }}
              value={heroData.subtitle} 
              onChange={e => onUpdateHero({...heroData, subtitle: e.target.value})} 
            />
          ) : (
            <span className="mb-12 italic font-serif tracking-tight opacity-40" style={{ fontSize: `${heroConfig.subtitleSize}px`, color: heroConfig.subtitleColor }}>{heroData.subtitle}</span>
          )}
          
          {isAdmin ? (
            <textarea 
              className="bg-transparent text-center border-b border-zinc-100 font-bold w-full max-w-[80rem] outline-none focus:border-black py-8 h-64 resize-none leading-tight" 
              style={{ fontSize: `${heroConfig.titleSize}px`, color: heroConfig.titleColor }}
              value={heroData.mainTitle} 
              onChange={e => onUpdateHero({...heroData, mainTitle: e.target.value})} 
            />
          ) : (
            <span className="font-bold leading-none tracking-tighter uppercase whitespace-pre-line" style={{ fontSize: `${heroConfig.titleSize}px`, color: heroConfig.titleColor }}>
              {heroData.mainTitle}
            </span>
          )}
        </h1>

        <div className="max-w-[80rem] mb-32 w-full">
          {isAdmin ? (
            <textarea 
              className="w-full bg-white/40 backdrop-blur-md text-center border-2 border-dashed border-zinc-200 p-20 font-light leading-[2] outline-none focus:border-black rounded-[4rem] transition-all h-[400px]" 
              style={{ fontSize: `${heroConfig.descSize}px`, color: heroConfig.descColor }}
              value={heroData.description} 
              onChange={e => onUpdateHero({...heroData, description: e.target.value})} 
            />
          ) : (
            <p className="font-light leading-[2] whitespace-pre-line tracking-tight px-10 opacity-50" style={{ fontSize: `${heroConfig.descSize}px`, color: heroConfig.descColor }}>
              {heroData.description}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-12 pt-10">
          <button onClick={onExplore} className="px-24 py-12 bg-black text-white text-[13px] font-bold tracking-[0.8em] uppercase hover:scale-105 transition-all shadow-2xl">EXPLORE WORKS</button>
          <button onClick={onBook} className="px-24 py-12 border-2 border-black text-black text-[13px] font-bold tracking-[0.8em] uppercase hover:bg-black hover:text-white transition-all">BOOK NOW</button>
        </div>
      </div>

      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none scale-110">
        <img src={heroData.image} className="w-full h-full object-cover grayscale" />
      </div>
    </section>
  );
};

export default Hero;
