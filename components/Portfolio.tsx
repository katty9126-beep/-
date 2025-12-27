
import React, { useState, useEffect, useRef } from 'react';
import { NailArtWork, SiteConfig } from '../types';

interface PortfolioProps {
  isAdmin?: boolean;
  works: NailArtWork[];
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  onEditWork: (work: NailArtWork) => void;
  onAddWork: (work: NailArtWork) => void;
  onUpdateWorks: (newList: NailArtWork[]) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ isAdmin = false, works, siteConfig, onEditWork, onAddWork, onUpdateWorks }) => {
  const [selectedWork, setSelectedWork] = useState<NailArtWork | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { portfolioConfig, theme } = siteConfig;

  const handleCreateNew = () => {
    const newWork: NailArtWork = {
      id: `work-${Date.now()}`,
      title: '新款。藝術名稱',
      category: '類別',
      images: ['https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200'],
      story: '請在此輸入靈感故事...\n\n每一款設計都有它的靈魂。',
      tags: []
    };
    onAddWork(newWork);
    setSelectedWork(newWork);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('確定要永久移除這篇藝術故事嗎？')) {
      const newList = works.filter(w => w.id !== id);
      onUpdateWorks(newList);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedWork) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = { ...selectedWork, images: [reader.result as string] };
        setSelectedWork(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveWorkChanges = () => {
    if (selectedWork) {
      onEditWork(selectedWork);
      const newList = works.map(item => item.id === selectedWork.id ? selectedWork : item);
      onUpdateWorks(newList);
      setSelectedWork(null);
    }
  };

  // 自動選取文字的輔助函數
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.select();
  };

  return (
    <section id="portfolio" className="py-60 px-10 max-w-[100rem] mx-auto bg-transparent scroll-mt-24 reveal">
      <div className="mb-40 flex flex-col md:flex-row justify-between items-end gap-16">
        <div className="max-w-3xl">
          <p className="text-[13px] tracking-[1em] font-bold uppercase mb-6 opacity-30" style={{ color: portfolioConfig.headingColor }}>Archives</p>
          <h2 className="text-7xl md:text-9xl font-serif leading-tight" style={{ color: portfolioConfig.titleColor }}>故事靈感集</h2>
        </div>
        {isAdmin && (
          <button onClick={handleCreateNew} className="px-16 py-8 bg-black text-white text-[12px] font-bold uppercase tracking-[0.6em] hover:scale-105 transition-all shadow-2xl">
            + 發佈新系列
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32">
        {works.map((work) => (
          <div key={work.id} className="group cursor-pointer" onClick={() => setSelectedWork(work)}>
            <div className="relative aspect-[3/4] overflow-hidden mb-12 bg-zinc-100 shadow-sm transition-all duration-700 hover:shadow-2xl">
              <img src={work.images[0]} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-110" alt={work.title} />
              {isAdmin && (
                <button onClick={(e) => handleDelete(e, work.id)} className="absolute top-10 right-10 p-5 bg-white/90 rounded-full text-rose-500 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              )}
            </div>
            <p className="text-[12px] tracking-[0.8em] font-bold uppercase mb-4 opacity-30">{work.category}</p>
            <h3 className="text-4xl md:text-5xl font-serif">{work.title}</h3>
          </div>
        ))}
      </div>

      {selectedWork && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-white/98 backdrop-blur-3xl" onClick={() => setSelectedWork(null)}></div>
          <div className="relative bg-white w-full h-full flex flex-col lg:flex-row overflow-hidden">
            
            {/* 左側照片 */}
            <div className="w-full h-[50%] lg:h-full lg:w-[65%] bg-[#080808] flex items-center justify-center relative group">
              <img src={selectedWork.images[0]} className="max-w-full max-h-full object-contain" />
              {isAdmin && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity" onClick={() => fileInputRef.current?.click()}>
                  <p className="text-white text-[11px] font-bold uppercase tracking-[0.6em] border border-white/40 px-8 py-4">點擊更換作品照片</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <button onClick={() => setSelectedWork(null)} className="absolute top-12 left-12 text-white text-[12px] font-bold uppercase tracking-[0.5em] flex items-center gap-4 hover:opacity-50 transition-all">
                <span className="text-3xl">✕</span> CLOSE
              </button>
            </div>

            {/* 右側內容區 - 整容後的編輯器 */}
            <div className="w-full lg:w-[35%] bg-white p-12 md:p-24 overflow-y-auto flex flex-col justify-center">
              {isAdmin ? (
                <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.5em]">WORK TITLE</label>
                    <input 
                      autoFocus
                      onFocus={handleFocus}
                      className="w-full text-6xl font-serif border-b-2 border-dashed border-zinc-100 focus:border-black bg-zinc-50/50 outline-none py-4 px-2 transition-colors" 
                      value={selectedWork.title} 
                      onChange={e => setSelectedWork({...selectedWork, title: e.target.value})} 
                    />
                    <p className="text-[9px] text-zinc-400 italic">💡 點擊標題可直接修改，系統已為您自動全選內容。</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.5em]">CATEGORY</label>
                    <input 
                      onFocus={handleFocus}
                      className="w-full text-xl font-bold uppercase border-b border-dashed border-zinc-100 focus:border-black bg-zinc-50/50 outline-none py-3 px-2 transition-colors" 
                      value={selectedWork.category} 
                      onChange={e => setSelectedWork({...selectedWork, category: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.5em]">THE STORY</label>
                    <textarea 
                      onFocus={handleFocus}
                      className="w-full h-[350px] text-2xl leading-[2] font-light border-2 border-dashed border-zinc-100 rounded-[2rem] p-10 focus:border-black bg-zinc-50/30 outline-none transition-all resize-none" 
                      value={selectedWork.story} 
                      onChange={e => setSelectedWork({...selectedWork, story: e.target.value})} 
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button onClick={() => setSelectedWork(null)} className="flex-1 py-8 border-2 border-zinc-100 text-zinc-400 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-zinc-50 rounded-full transition-all">取消放棄</button>
                    <button onClick={saveWorkChanges} className="flex-[2] py-8 bg-black text-white text-[11px] font-bold uppercase tracking-[0.6em] hover:bg-zinc-800 rounded-full transition-colors shadow-2xl">更新作品內容</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-20">
                  <span className="text-[12px] font-bold tracking-[1em] text-zinc-300 uppercase">{selectedWork.category}</span>
                  <h2 className="text-8xl font-serif leading-tight">{selectedWork.title}</h2>
                  <div className="w-32 h-2 bg-black"></div>
                  <p className="text-4xl font-light leading-[2.2] text-zinc-600 whitespace-pre-line tracking-tight">{selectedWork.story}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
