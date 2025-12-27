
import React, { useState, useRef } from 'react';
import { AboutData, SiteConfig } from '../types';

interface AboutProps {
  isAdmin: boolean;
  aboutData: AboutData;
  siteConfig: SiteConfig;
  onUpdateAbout: (data: AboutData) => void;
  onUpdateConfig: (config: SiteConfig) => void;
}

const About: React.FC<AboutProps> = ({ isAdmin, aboutData, siteConfig, onUpdateAbout, onUpdateConfig }) => {
  const [showDesigner, setShowDesigner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { aboutConfig, theme } = siteConfig;

  const updateAbout = (field: keyof AboutData, value: string) => {
    onUpdateAbout({ ...aboutData, [field]: value });
  };

  const updateConfig = (field: keyof typeof aboutConfig, value: any) => {
    onUpdateConfig({
      ...siteConfig,
      aboutConfig: { ...aboutConfig, [field]: value }
    });
  };

  const handleSave = () => {
    localStorage.setItem('nail_art_about', JSON.stringify(aboutData));
    localStorage.setItem('nail_site_config', JSON.stringify(siteConfig));
    alert('📜 品牌故事與樣式已成功儲存！');
  };

  return (
    <section id="about" className="max-w-[100rem] mx-auto my-80 px-10 scroll-mt-32 reveal relative">
      {/* 絕對位置的區塊編輯按鈕 */}
      {isAdmin && (
        <div className="absolute top-0 right-10 flex gap-4 z-50">
          <button 
            onClick={() => setShowDesigner(!showDesigner)} 
            className="px-8 py-3 bg-indigo-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            🎨 調整文字樣式
          </button>
          <button 
            onClick={handleSave} 
            className="px-8 py-3 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            儲存變更
          </button>
        </div>
      )}

      {/* About 設計師面板 */}
      {isAdmin && showDesigner && (
        <div className="fixed top-24 right-10 bg-white p-10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-zinc-100 w-80 z-[100] text-left animate-in zoom-in duration-300">
          <div className="space-y-8">
            <h5 className="text-[10px] font-black tracking-widest uppercase text-indigo-500 mb-6">ABOUT 視覺控制</h5>
            
            <div className="space-y-4">
              <p className="text-[8px] font-bold text-gray-400 uppercase">標題大小 ({aboutConfig.titleSize}px)</p>
              <input type="range" min="40" max="250" value={aboutConfig.titleSize} onChange={e => updateConfig('titleSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
            </div>

            <div className="space-y-4">
              <p className="text-[8px] font-bold text-gray-400 uppercase">內容大小 ({aboutConfig.textSize}px)</p>
              <input type="range" min="16" max="80" value={aboutConfig.textSize} onChange={e => updateConfig('textSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[7px] text-gray-400 uppercase font-bold">標題顏色</p>
                <input type="color" value={aboutConfig.titleColor} onChange={e => updateConfig('titleColor', e.target.value)} className="w-full h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <p className="text-[7px] text-gray-400 uppercase font-bold">對齊方式</p>
                <select className="w-full text-[9px] font-bold p-2 bg-zinc-50 rounded-lg" value={aboutConfig.alignment} onChange={e => updateConfig('alignment', e.target.value)}>
                  <option value="left">靠左</option>
                  <option value="center">居中</option>
                  <option value="right">靠右</option>
                </select>
              </div>
            </div>

            <button onClick={() => setShowDesigner(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase">完成設計</button>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-40 items-center ${aboutConfig.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <div 
          className="relative aspect-[4/5] group cursor-pointer overflow-hidden bg-zinc-100 shadow-2xl"
          onClick={() => isAdmin && fileInputRef.current?.click()}
        >
          <img src={aboutData.image} alt="About" className="w-full h-full object-cover" />
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => updateAbout('image', reader.result as string);
              reader.readAsDataURL(file);
            }
          }} />
        </div>

        <div className={`flex flex-col space-y-24 ${aboutConfig.alignment === 'center' ? 'items-center text-center' : aboutConfig.alignment === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
          <div className="w-full">
            <span className="text-[14px] tracking-[1.5em] uppercase font-bold block opacity-30 mb-10">THE ESSENCE</span>
            {isAdmin ? (
              <textarea 
                className="font-serif bg-transparent border-b-2 border-dashed border-zinc-200 w-full outline-none focus:border-black py-6 resize-none leading-tight overflow-hidden break-keep"
                style={{ fontSize: `${aboutConfig.titleSize}px`, color: aboutConfig.titleColor, height: 'auto' }}
                value={aboutData.title}
                onChange={e => updateAbout('title', e.target.value)}
                onInput={(e) => {
                   const target = e.target as HTMLTextAreaElement;
                   target.style.height = 'auto';
                   target.style.height = target.scrollHeight + 'px';
                }}
              />
            ) : (
              <h2 className="font-serif leading-tight whitespace-pre-line break-keep" style={{ fontSize: `${aboutConfig.titleSize}px`, color: aboutConfig.titleColor }}>{aboutData.title}</h2>
            )}
          </div>

          <div className="w-full">
            {isAdmin ? (
              <textarea 
                className="font-light leading-[2.2] bg-white/50 backdrop-blur-sm border-2 border-dashed border-zinc-200 w-full h-[400px] p-20 outline-none focus:border-black rounded-[4rem]"
                style={{ fontSize: `${aboutConfig.textSize}px`, color: aboutConfig.textColor }}
                value={aboutData.description}
                onChange={e => updateAbout('description', e.target.value)}
              />
            ) : (
              <p className="font-light leading-[2.2] opacity-50 whitespace-pre-line tracking-tight px-4" style={{ fontSize: `${aboutConfig.textSize}px`, color: aboutConfig.textColor }}>
                {aboutData.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
