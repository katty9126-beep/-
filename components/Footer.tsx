
import React, { useState } from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  isAdmin?: boolean;
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ isAdmin, siteConfig, onUpdateConfig, onAdminClick }) => {
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const { footerConfig, theme } = siteConfig;

  const updateContent = (field: keyof typeof footerConfig, value: any) => {
    onUpdateConfig({
      ...siteConfig,
      footerConfig: { ...footerConfig, [field]: value }
    });
  };

  const updateTheme = (field: keyof typeof theme, value: string) => {
    onUpdateConfig({
      ...siteConfig,
      theme: { ...theme, [field]: value }
    });
  };

  const handleSave = () => {
    localStorage.setItem('nail_site_config', JSON.stringify(siteConfig));
    alert('🏁 頁尾設計已成功存檔！');
  };

  const alignmentClass = {
    left: 'text-left md:items-start',
    center: 'text-center md:items-center',
    right: 'text-right md:items-end'
  }[footerConfig.alignment];

  return (
    <footer 
      className={`relative py-40 px-6 border-t border-current flex flex-col items-center ${footerConfig.alignment === 'center' ? 'text-center' : ''}`}
      style={{ 
        backgroundColor: theme.footerBg, 
        color: theme.footerText,
        fontFamily: footerConfig.footerFontSerif ? theme.fontSerif : theme.fontSans
      }}
    >
      {/* 頁尾專屬編輯入口 */}
      {isAdmin && (
        <div className="absolute top-10 flex gap-4">
           <button onClick={() => setShowStyleEditor(!showStyleEditor)} className="px-8 py-3 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">🎨 頁尾視覺設計</button>
           <button onClick={handleSave} className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">儲存頁尾</button>
        </div>
      )}

      {/* Footer 設計師面板 */}
      {isAdmin && showStyleEditor && (
        <div className="fixed bottom-32 right-10 bg-white p-10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-zinc-100 w-80 z-[100] text-left text-black animate-in slide-in-from-bottom-10">
           <div className="space-y-8">
              <h5 className="text-[10px] font-black tracking-widest uppercase text-indigo-500">FOOTER 專家面板</h5>
              
              <div className="space-y-4">
                <p className="text-[8px] font-bold text-gray-400 uppercase">品牌名大小 ({footerConfig.brandSize}px)</p>
                <input type="range" min="20" max="100" value={footerConfig.brandSize} onChange={e => updateContent('brandSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
              </div>

              <div className="space-y-4">
                <p className="text-[8px] font-bold text-gray-400 uppercase">座右銘大小 ({footerConfig.quoteSize}px)</p>
                <input type="range" min="12" max="60" value={footerConfig.quoteSize} onChange={e => updateContent('quoteSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[7px] text-gray-400 uppercase font-bold">對齊方式</p>
                  <select className="w-full text-[9px] font-bold p-2 bg-zinc-50 rounded-lg" value={footerConfig.alignment} onChange={e => updateContent('alignment', e.target.value)}>
                    <option value="left">靠左</option>
                    <option value="center">居中</option>
                    <option value="right">靠右</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[7px] text-gray-400 uppercase font-bold">背景顏色</p>
                  <input type="color" value={theme.footerBg} onChange={e => updateTheme('footerBg', e.target.value)} className="w-full h-10" />
                </div>
              </div>

              <button onClick={() => setShowStyleEditor(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase">完成設定</button>
           </div>
        </div>
      )}

      <div className={`max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-32 items-start`}>
        
        {/* Section 1 */}
        <div className={`flex flex-col space-y-8 ${alignmentClass}`}>
          {isAdmin ? (
            <textarea 
              className="bg-transparent border-b border-white/20 font-bold tracking-[0.4em] uppercase w-full resize-none outline-none focus:border-white"
              style={{ color: theme.footerTitleColor, fontSize: `${footerConfig.brandSize}px` }}
              value={footerConfig.brandName}
              onChange={e => updateContent('brandName', e.target.value)}
            />
          ) : (
            <h4 className="font-bold tracking-[0.4em] uppercase" style={{ color: theme.footerTitleColor, fontSize: `${footerConfig.brandSize}px` }}>{footerConfig.brandName}</h4>
          )}

          {isAdmin ? (
            <textarea 
              className="bg-transparent border-b border-white/20 opacity-60 font-light leading-loose uppercase tracking-[0.4em] w-full h-32 resize-none outline-none focus:border-white"
              style={{ fontSize: `${footerConfig.addressSize}px` }}
              value={footerConfig.address}
              onChange={e => updateContent('address', e.target.value)}
            />
          ) : (
            <p className="opacity-60 font-light leading-loose uppercase tracking-[0.4em] whitespace-pre-line" style={{ fontSize: `${footerConfig.addressSize}px` }}>{footerConfig.address}</p>
          )}
        </div>
        
        {/* Section 2 */}
        <div className={`flex flex-col space-y-8 ${alignmentClass}`}>
          <h5 className="uppercase tracking-[0.8em] font-bold opacity-30" style={{ fontSize: `${footerConfig.headingSize}px` }}>{footerConfig.reservationHeading}</h5>
          <ul className={`space-y-6 font-light opacity-60 tracking-[0.3em] uppercase ${alignmentClass}`}>
            <li>{footerConfig.depositText}</li>
            <li>{footerConfig.locationText}</li>
            <li className="pt-8 flex space-x-12">
              <a href={footerConfig.instagramUrl} target="_blank" className="border-b border-current pb-1">Instagram</a>
              <a href={siteConfig.bookingConfig.lineUrl} target="_blank" className="border-b border-current pb-1">Line</a>
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className={`flex flex-col space-y-8 ${alignmentClass}`}>
          <h5 className="uppercase tracking-[0.8em] font-bold opacity-30" style={{ fontSize: `${footerConfig.headingSize}px` }}>{footerConfig.philosophyHeading}</h5>
          {isAdmin ? (
            <textarea 
              className="bg-transparent border-b border-white/20 opacity-80 italic leading-relaxed tracking-widest w-full h-32 resize-none outline-none focus:border-white"
              style={{ fontSize: `${footerConfig.quoteSize}px` }}
              value={footerConfig.quote}
              onChange={e => updateContent('quote', e.target.value)}
            />
          ) : (
            <p className="opacity-80 italic leading-relaxed tracking-widest whitespace-pre-line" style={{ fontSize: `${footerConfig.quoteSize}px` }}>{footerConfig.quote}</p>
          )}
        </div>
      </div>
      
      <div className="mt-40 pt-12 border-t border-white/5 w-full max-w-7xl flex justify-between items-center opacity-20 text-[8px] font-bold tracking-[0.4em] uppercase">
        <p>© {new Date().getFullYear()} {footerConfig.brandName}. ALL RIGHTS RESERVED.</p>
        <button onClick={onAdminClick}>ARTIST ACCESS</button>
      </div>
    </footer>
  );
};

export default Footer;
