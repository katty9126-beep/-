
import React, { useState } from 'react';
import { MembershipJoinData, SiteConfig, MemberTier, MemberHighlight } from '../types';

interface MembershipJoinProps {
  isAdmin: boolean;
  data: MembershipJoinData;
  siteConfig: SiteConfig;
  onUpdateData: (data: MembershipJoinData) => void;
  onUpdateConfig: (config: SiteConfig) => void;
}

const MembershipJoin: React.FC<MembershipJoinProps> = ({ isAdmin, data, siteConfig, onUpdateData, onUpdateConfig }) => {
  const [showDesigner, setShowDesigner] = useState(false);
  const { membershipJoinConfig, theme } = siteConfig;

  const updateConfig = (field: keyof typeof membershipJoinConfig, value: any) => {
    onUpdateConfig({
      ...siteConfig,
      membershipJoinConfig: { ...membershipJoinConfig, [field]: value }
    });
  };

  const updateTier = (idx: number, updates: Partial<MemberTier>) => {
    const nextTiers = [...data.tiers];
    nextTiers[idx] = { ...nextTiers[idx], ...updates };
    onUpdateData({ ...data, tiers: nextTiers });
  };

  const addBenefit = (tierIdx: number) => {
    const nextTiers = [...data.tiers];
    nextTiers[tierIdx].benefits = [...nextTiers[tierIdx].benefits, "新權益項目"];
    onUpdateData({ ...data, tiers: nextTiers });
  };

  const removeBenefit = (tierIdx: number, benefitIdx: number) => {
    const nextTiers = [...data.tiers];
    nextTiers[tierIdx].benefits = nextTiers[tierIdx].benefits.filter((_, i) => i !== benefitIdx);
    onUpdateData({ ...data, tiers: nextTiers });
  };

  const addHighlight = (tierIdx: number) => {
    const nextTiers = [...data.tiers];
    const newHighlight: MemberHighlight = { icon: "✨", text: "新亮點內容", colorClass: "text-zinc-600" };
    nextTiers[tierIdx].highlights = [...(nextTiers[tierIdx].highlights || []), newHighlight];
    onUpdateData({ ...data, tiers: nextTiers });
  };

  const removeHighlight = (tierIdx: number, hIdx: number) => {
    const nextTiers = [...data.tiers];
    nextTiers[tierIdx].highlights = nextTiers[tierIdx].highlights.filter((_, i) => i !== hIdx);
    onUpdateData({ ...data, tiers: nextTiers });
  };

  const updateHighlight = (tierIdx: number, hIdx: number, updates: Partial<MemberHighlight>) => {
    const nextTiers = [...data.tiers];
    nextTiers[tierIdx].highlights[hIdx] = { ...nextTiers[tierIdx].highlights[hIdx], ...updates };
    onUpdateData({ ...data, tiers: nextTiers });
  };

  const addTier = () => {
    const newTier: MemberTier = {
      id: `tier-${Date.now()}`,
      name: '新會籍名稱',
      price: '0',
      duration: '會籍時長',
      benefits: ['權益一', '權益二'],
      highlights: [
        { icon: "🎁", text: "自訂贈品內容", colorClass: "text-indigo-600" },
        { icon: "⚡", text: "省錢金額說明", colorClass: "text-rose-500" }
      ]
    };
    onUpdateData({ ...data, tiers: [...data.tiers, newTier] });
  };

  const removeTier = (idx: number) => {
    if (window.confirm('確定要永久移除這張會員卡片嗎？')) {
      onUpdateData({ ...data, tiers: data.tiers.filter((_, i) => i !== idx) });
    }
  };

  const handleSave = () => {
    localStorage.setItem('nail_membership_join', JSON.stringify(data));
    localStorage.setItem('nail_site_config', JSON.stringify(siteConfig));
    alert('🏆 會員方案設計已成功儲存！');
  };

  return (
    <section id="membershipJoin" className="py-60 px-6 max-w-[110rem] mx-auto scroll-mt-32 reveal relative" style={{ fontFamily: membershipJoinConfig.useSerif ? theme.fontSerif : theme.fontSans }}>
      
      {isAdmin && (
        <div className="absolute top-10 right-10 flex gap-4 z-50">
           <button onClick={() => setShowDesigner(!showDesigner)} className="px-8 py-3 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">🎨 會籍視覺實驗室</button>
           <button onClick={handleSave} className="px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">儲存變更</button>
        </div>
      )}

      {isAdmin && showDesigner && (
        <div className="fixed top-32 right-10 bg-white p-10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-zinc-100 w-80 z-[200] text-black text-left animate-in slide-in-from-right-10">
           <div className="space-y-8 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
              <h5 className="text-[10px] font-black tracking-widest uppercase text-indigo-500 sticky top-0 bg-white pb-4">方案視覺設計師</h5>
              
              <div className="space-y-4">
                <p className="text-[8px] font-bold text-gray-400 uppercase">主標題字級 ({membershipJoinConfig.titleSize}px)</p>
                <input type="range" min="30" max="150" value={membershipJoinConfig.titleSize} onChange={e => updateConfig('titleSize', parseInt(e.target.value))} className="w-full h-6 accent-indigo-600" />
              </div>

              <div className="space-y-4">
                <p className="text-[8px] font-bold text-gray-400 uppercase">副標題字級 ({membershipJoinConfig.subtitleSize}px)</p>
                <input type="range" min="10" max="40" value={membershipJoinConfig.subtitleSize} onChange={e => updateConfig('subtitleSize', parseInt(e.target.value))} className="w-full h-6 accent-indigo-600" />
              </div>

              <div className="space-y-4">
                <p className="text-[8px] font-bold text-gray-400 uppercase">價格字級 ({membershipJoinConfig.priceSize}px)</p>
                <input type="range" min="30" max="150" value={membershipJoinConfig.priceSize} onChange={e => updateConfig('priceSize', parseInt(e.target.value))} className="w-full h-6 accent-indigo-600" />
              </div>

              <div className="space-y-4">
                <p className="text-[8px] font-bold text-gray-400 uppercase">卡片圓角 ({membershipJoinConfig.cardRadius})</p>
                <input type="range" min="0" max="8" step="0.5" value={parseFloat(membershipJoinConfig.cardRadius)} onChange={e => updateConfig('cardRadius', `${e.target.value}rem`)} className="w-full h-6 accent-indigo-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[7px] text-gray-400 uppercase font-bold">主標題顏色</p>
                  <input type="color" value={membershipJoinConfig.titleColor} onChange={e => updateConfig('titleColor', e.target.value)} className="w-full h-10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <p className="text-[7px] text-gray-400 uppercase font-bold">品牌重點色</p>
                  <input type="color" value={membershipJoinConfig.accentColor} onChange={e => updateConfig('accentColor', e.target.value)} className="w-full h-10 rounded-xl" />
                </div>
              </div>

              <button onClick={() => setShowDesigner(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase">完成並關閉</button>
           </div>
        </div>
      )}

      {/* 標題區域 */}
      <div className="text-center mb-40">
        {isAdmin ? (
          <input 
            className="bg-transparent text-center w-full mb-4 outline-none font-bold uppercase tracking-[1.5em] opacity-30"
            style={{ fontSize: `${membershipJoinConfig.subtitleSize}px`, color: membershipJoinConfig.subtitleColor }}
            value={data.subtitle}
            onChange={e => onUpdateData({...data, subtitle: e.target.value})}
          />
        ) : (
          <span className="font-bold uppercase tracking-[1.5em] mb-4 opacity-30 block" style={{ fontSize: `${membershipJoinConfig.subtitleSize}px`, color: membershipJoinConfig.subtitleColor }}>{data.subtitle}</span>
        )}
        
        {isAdmin ? (
          <input 
            className="bg-transparent border-b border-dashed border-zinc-200 outline-none font-serif text-center w-full mb-12"
            style={{ fontSize: `${membershipJoinConfig.titleSize}px`, color: membershipJoinConfig.titleColor }}
            value={data.title}
            onChange={e => onUpdateData({...data, title: e.target.value})}
          />
        ) : (
          <h2 className="font-serif leading-tight mb-12" style={{ fontSize: `${membershipJoinConfig.titleSize}px`, color: membershipJoinConfig.titleColor }}>{data.title}</h2>
        )}

        <div className="inline-block px-12 py-5 bg-rose-50 border border-rose-100 rounded-full animate-pulse">
           {isAdmin ? (
             <input className="bg-transparent text-rose-600 font-bold text-center w-full outline-none" value={data.eventNotice} onChange={e => onUpdateData({...data, eventNotice: e.target.value})} />
           ) : (
             <p className="text-rose-600 font-bold tracking-widest">{data.eventNotice}</p>
           )}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${data.tiers.length > 1 ? 'lg:grid-cols-2' : ''} ${data.tiers.length > 2 ? 'xl:grid-cols-3' : ''} gap-16`}>
        {data.tiers.map((tier, idx) => (
          // Fixed: Removed duplicate className and style attributes
          <div 
            key={tier.id}
            className={`relative group bg-white border-2 p-16 transition-all duration-700 hover:shadow-[0_40px_120px_rgba(0,0,0,0.1)] flex flex-col ${
              tier.isPopular ? 'ring-8 ring-offset-4 scale-105' : 'border-zinc-50'
            }`}
            style={{ 
              borderRadius: membershipJoinConfig.cardRadius,
              borderColor: tier.isPopular ? membershipJoinConfig.accentColor : '#f9f9f9',
              boxShadow: tier.isPopular ? `0 20px 60px ${membershipJoinConfig.accentColor}15` : undefined
            }}
          >
            {isAdmin && (
              <button onClick={() => removeTier(idx)} className="absolute -top-4 -right-4 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10">✕</button>
            )}

            {tier.isPopular && (
              <div 
                className="absolute -top-6 left-1/2 -translate-x-1/2 px-10 py-3 text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-xl"
                style={{ backgroundColor: membershipJoinConfig.accentColor }}
              >
                 🏆 MOST POPULAR
              </div>
            )}

            <div className="mb-20">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-4">
                  {isAdmin ? (
                    <input className="text-4xl font-serif bg-zinc-50 rounded-xl px-4 py-2 outline-none w-full" value={tier.name} onChange={e => updateTier(idx, { name: e.target.value })} />
                  ) : (
                    <h3 className="text-4xl font-serif">{tier.name}</h3>
                  )}
                  {isAdmin ? (
                    <input className="text-[12px] font-bold text-zinc-300 tracking-widest uppercase bg-transparent outline-none border-b border-dashed border-zinc-100" value={tier.duration} onChange={e => updateTier(idx, { duration: e.target.value })} />
                  ) : (
                    <p className="text-[12px] font-bold text-zinc-300 tracking-widest uppercase">{tier.duration}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-start">
                    <span className="text-2xl font-serif mt-2 mr-1">NT$</span>
                    {isAdmin ? (
                      <input className="bg-zinc-50 rounded-xl px-4 py-2 w-48 text-right outline-none font-bold" style={{ fontSize: `${membershipJoinConfig.priceSize}px` }} value={tier.price} onChange={e => updateTier(idx, { price: e.target.value })} />
                    ) : (
                      <span className="font-black tracking-tighter" style={{ fontSize: `${membershipJoinConfig.priceSize}px` }}>{tier.price}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-zinc-100 w-full mb-12"></div>

              <div className="space-y-10">
                <div className="flex justify-between items-center">
                   <h5 className="text-[10px] font-black tracking-widest text-zinc-300 uppercase">BENEFITS & PRIVILEGES</h5>
                   {isAdmin && (
                     <button onClick={() => addBenefit(idx)} className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-widest">+ 增加項目</button>
                   )}
                </div>
                <div className="space-y-6">
                  {tier.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-5 group/benefit">
                      <span className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-1">✓</span>
                      {isAdmin ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input className="flex-1 bg-zinc-50 p-3 rounded-xl outline-none text-lg" value={benefit} onChange={e => {
                            const nextB = [...tier.benefits];
                            nextB[bIdx] = e.target.value;
                            updateTier(idx, { benefits: nextB });
                          }} />
                          <button onClick={() => removeBenefit(idx, bIdx)} className="text-rose-300 opacity-0 group-hover/benefit:opacity-100 transition-opacity">✕</button>
                        </div>
                      ) : (
                        <p className="font-light text-zinc-600 leading-relaxed" style={{ fontSize: `${membershipJoinConfig.benefitSize}px` }}>{benefit}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-zinc-50 rounded-[2.5rem] space-y-4 relative">
                   <div className="flex justify-between items-center mb-2">
                      <h5 className="text-[9px] font-black tracking-widest text-zinc-300 uppercase">HIGHLIGHTS</h5>
                      {isAdmin && (
                        <button onClick={() => addHighlight(idx)} className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">+ 增加亮點</button>
                      )}
                   </div>
                   
                   <div className="space-y-4">
                     {tier.highlights?.map((h, hIdx) => (
                       <div key={hIdx} className={`flex items-center gap-4 group/h relative ${h.colorClass}`}>
                          {isAdmin ? (
                            <div className="flex-1 flex items-center gap-3">
                               <input className="w-10 text-center bg-white/50 rounded-lg outline-none cursor-pointer" value={h.icon} onChange={e => updateHighlight(idx, hIdx, { icon: e.target.value })} />
                               <input className="flex-1 bg-white/50 p-3 rounded-xl outline-none text-sm font-bold" value={h.text} onChange={e => updateHighlight(idx, hIdx, { text: e.target.value })} />
                               <button onClick={() => removeHighlight(idx, hIdx)} className="text-rose-300 opacity-0 group-hover/h:opacity-100">✕</button>
                            </div>
                          ) : (
                            <>
                              <span className="text-2xl">{h.icon}</span>
                              <p className="font-bold flex-1">{h.text}</p>
                            </>
                          )}
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className={`mt-auto w-full py-8 rounded-full text-white text-[13px] font-black tracking-[0.6em] uppercase transition-all shadow-2xl hover:scale-105 active:scale-95`}
              style={{ backgroundColor: tier.isPopular ? membershipJoinConfig.accentColor : '#111111' }}
            >
              {data.ctaText}
            </button>
          </div>
        ))}
        
        {isAdmin && (
          <button 
            onClick={addTier}
            className="border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center p-20 text-zinc-300 hover:text-indigo-400 hover:border-indigo-100 transition-all group"
            style={{ borderRadius: membershipJoinConfig.cardRadius }}
          >
             <div className="w-20 h-20 rounded-full border-4 border-current flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">+</div>
             <p className="font-black uppercase tracking-widest text-sm">新增全新會員方案卡片</p>
          </button>
        )}
      </div>
    </section>
  );
};

export default MembershipJoin;
