
import React, { useState, useRef } from 'react';
import { SiteConfig, Appointment } from '../types';

interface MembersProps {
  isAdmin: boolean;
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
}

const Members: React.FC<MembersProps> = ({ isAdmin, siteConfig, onUpdateConfig }) => {
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState<Appointment[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDesigner, setShowDesigner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { memberConfig, theme } = siteConfig;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setIsSearching(true);
    setTimeout(() => {
      const saved = localStorage.getItem('nail_appointments');
      const all: Appointment[] = saved ? JSON.parse(saved) : [];
      const filtered = all.filter(app => app.phone.replace(/[^0-9]/g, '').includes(phone.replace(/[^0-9]/g, '')));
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const updateConfig = (field: keyof typeof memberConfig, value: any) => {
    onUpdateConfig({
      ...siteConfig,
      memberConfig: { ...memberConfig, [field]: value }
    });
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateConfig('bgImage', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section 
      id="members" 
      className="py-48 px-6 min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden" 
      style={{ fontFamily: memberConfig.useSerif ? theme.fontSerif : theme.fontSans }}
    >
      {/* 背景裝修層 */}
      <div className="absolute inset-0 z-0">
        {memberConfig.bgImage ? (
          <img src={memberConfig.bgImage} className="w-full h-full object-cover scale-105" alt="Bg" />
        ) : (
          <div className="w-full h-full bg-zinc-50"></div>
        )}
        <div className="absolute inset-0 bg-white" style={{ opacity: memberConfig.overlayOpacity }}></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-white/40 backdrop-blur-3xl p-12 md:p-28 rounded-[4rem] shadow-[0_20px_80px_rgba(0,0,0,0.05)] border border-white/60 text-center flex flex-col items-center">
        
        {isAdmin && (
          <div className="absolute top-10 right-10 z-[50]">
            <button 
              onClick={() => setShowDesigner(!showDesigner)}
              className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
        )}

        {showDesigner && (
          <div className="absolute top-28 right-10 bg-zinc-950 text-white p-10 rounded-[3rem] shadow-2xl w-80 text-left z-[100] animate-in zoom-in duration-300">
            <h5 className="text-[11px] font-black tracking-widest uppercase text-indigo-400 mb-8 flex justify-between">
              <span>會員區設計面板</span>
              <button onClick={() => setShowDesigner(false)}>✕</button>
            </h5>
            <div className="space-y-8">
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white/10 rounded-2xl text-[10px] font-bold uppercase border border-white/5">📸 更換背景大圖</button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBgUpload} />
              
              <div className="space-y-3">
                <p className="text-[8px] text-gray-500 uppercase font-black">遮罩濃度: {Math.round(memberConfig.overlayOpacity * 100)}%</p>
                <input type="range" min="0" max="1" step="0.05" value={memberConfig.overlayOpacity} onChange={e => updateConfig('overlayOpacity', parseFloat(e.target.value))} className="w-full h-8 accent-indigo-500" />
              </div>

              <div className="space-y-3">
                <p className="text-[8px] text-gray-500 uppercase font-black">標題字級: {memberConfig.titleSize}px</p>
                <input type="range" min="20" max="100" value={memberConfig.titleSize} onChange={e => updateConfig('titleSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <p className="text-[7px] text-gray-600 uppercase">標題色</p>
                  <input type="color" value={memberConfig.titleColor} onChange={e => updateConfig('titleColor', e.target.value)} className="w-full h-10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <p className="text-[7px] text-gray-600 uppercase">按鈕色</p>
                  <input type="color" value={memberConfig.accentColor} onChange={e => updateConfig('accentColor', e.target.value)} className="w-full h-10 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        <span className="font-black uppercase tracking-[0.8em] mb-4 text-zinc-400" style={{ fontSize: `${memberConfig.subtitleSize}px` }}>{memberConfig.subtitle}</span>
        <h2 className="font-serif mb-16 leading-tight" style={{ color: memberConfig.titleColor, fontSize: `${memberConfig.titleSize}px` }}>{memberConfig.title}</h2>
        
        <form onSubmit={handleSearch} className="w-full max-w-2xl space-y-8">
          <input 
            required
            type="tel"
            placeholder={memberConfig.placeholder}
            className="w-full bg-white/80 py-8 px-12 rounded-[2.5rem] text-center outline-none focus:ring-[15px] ring-indigo-500/5 transition-all border border-zinc-100 placeholder:text-zinc-300 font-serif"
            style={{ fontSize: `${memberConfig.inputSize}px` }}
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="w-full py-8 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            style={{ backgroundColor: memberConfig.accentColor, fontSize: `${memberConfig.buttonSize}px` }}
          >
            {isSearching ? '正在查詢中...' : memberConfig.buttonText}
          </button>
        </form>

        {results && (
          <div className="w-full mt-24 animate-in fade-in slide-in-from-top-10 duration-700">
            {results.length === 0 ? (
              <div className="py-20 px-10 bg-white/60 backdrop-blur rounded-[3rem] border border-dashed border-zinc-200">
                <p className="text-zinc-400 font-serif italic">找不到預約紀錄喔 ✨</p>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                {results.map(app => (
                  <div key={app.id} className="bg-white/90 p-10 rounded-[3rem] shadow-sm border border-zinc-50 flex justify-between items-center group hover:shadow-2xl transition-all">
                    <div>
                      <h4 className="text-2xl font-serif text-zinc-800">{app.date} <span className="text-indigo-600 ml-4">{app.time}</span></h4>
                      <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mt-2">{app.service}</p>
                    </div>
                    <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase shadow-inner ${
                      app.status === 'confirmed' ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {app.status === 'confirmed' ? '✓ 已確認' : '⌛ 審核中'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Members;
