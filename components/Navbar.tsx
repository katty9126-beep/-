
import React, { useState } from 'react';
import { View, SiteConfig } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  onAdminClick?: () => void;
  isAdminLoggedIn?: boolean;
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  setView, 
  onAdminClick, 
  isAdminLoggedIn, 
  siteConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const { navbarConfig, theme, sectionLabels } = siteConfig;

  const scrollToSection = (id: string) => {
    setView(View.HOME);
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const navLinks = [
    { label: sectionLabels.hero || '首頁', id: 'hero', action: () => { setView(View.HOME); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsOpen(false); } },
    { label: sectionLabels.news || '最新公告', id: 'news', action: () => scrollToSection('news') },
    { label: sectionLabels.portfolio || '精選作品', id: 'portfolio', action: () => scrollToSection('portfolio') },
    { label: sectionLabels.about || '品牌故事', id: 'about', action: () => scrollToSection('about') },
    { label: sectionLabels.booking || '立即預約', id: 'booking', action: () => scrollToSection('booking') },
  ];

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-[100] border-b transition-all duration-500"
        style={{ 
          backgroundColor: navbarConfig.bgColor,
          backdropFilter: navbarConfig.blurEffect ? 'blur(20px)' : 'none',
          borderColor: 'rgba(0,0,0,0.05)',
          fontFamily: navbarConfig.useSerif ? theme.fontSerif : theme.fontSans
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-[#111111]">
          <div 
            className="text-2xl md:text-3xl font-black tracking-[0.3em] cursor-pointer"
            style={{ color: navbarConfig.brandColor }}
            onClick={() => { setView(View.HOME); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            {siteConfig.footerConfig.brandName}
          </div>

          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={link.action}
                className="uppercase tracking-[0.4em] font-black opacity-60 hover:opacity-100 transition-all whitespace-nowrap"
                style={{ color: navbarConfig.linkColor, fontSize: '16px' }}
              >
                {link.label}
              </button>
            ))}

            <button 
              onClick={() => scrollToSection('membershipJoin')}
              className="flex items-center gap-2 px-8 py-3 bg-amber-100 text-[#b4837c] rounded-full text-[15px] font-black tracking-widest uppercase hover:bg-[#b4837c] hover:text-white transition-all border border-[#b4837c]/20 whitespace-nowrap shrink-0"
            >
              <span>👑</span>
              <span>{sectionLabels.membershipJoin || '成為會員'}</span>
            </button>
            
            {isAdminLoggedIn && (
              <button 
                onClick={() => setShowManual(true)}
                className="ml-4 px-6 py-3 bg-amber-500 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg animate-pulse whitespace-nowrap"
              >
                ❓ 操作手冊
              </button>
            )}

            <button 
              onClick={onAdminClick}
              className="ml-4 px-6 py-3 border-2 border-zinc-200 text-zinc-400 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-zinc-50 whitespace-nowrap"
            >
              {isAdminLoggedIn ? '🔒 店長模式' : '🔑 店長登入'}
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white fixed inset-0 z-[200] pt-40 px-10 flex flex-col space-y-12">
            <button onClick={() => setIsOpen(false)} className="absolute top-10 right-10 text-4xl">✕</button>
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => { link.action(); setIsOpen(false); }} className="text-3xl font-black uppercase text-left">{link.label}</button>
            ))}
            <button 
              onClick={() => { scrollToSection('membershipJoin'); setIsOpen(false); }} 
              className="text-3xl font-black uppercase text-left text-[#b4837c] flex items-center gap-4"
            >
              <span>👑</span> 成為會員
            </button>
          </div>
        )}
      </nav>

      {/* 操作手冊 Modal */}
      {showManual && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowManual(false)}></div>
          <div className="relative bg-white w-full max-w-2xl p-12 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-3xl font-serif mb-8 text-indigo-600">店長操作手冊 (Katty 專屬)</h2>
            <div className="space-y-8 text-zinc-600 leading-relaxed">
              <section>
                <h4 className="font-black text-zinc-900 mb-2">如何拿網址傳給客人？</h4>
                <p>在預覽視窗上方點擊「新分頁開啟」圖示，跳出的那個乾淨網頁網址，就是傳給客人用的！</p>
              </section>
              <section>
                <h4 className="font-black text-zinc-900 mb-2">如何修改照片與文字？</h4>
                <p>在目前的「店長模式」下，滑鼠移到任何區塊點擊即可編輯文字，或點擊「更換照片」按鈕。</p>
              </section>
              <section>
                <h4 className="font-black text-zinc-900 mb-2">如何儲存變更？</h4>
                <p>改完後點擊各區塊的「儲存」按鈕，或是在右下角 AI 助理下指令「幫我儲存網站」。</p>
              </section>
            </div>
            <button onClick={() => setShowManual(false)} className="mt-12 w-full py-5 bg-indigo-600 text-white rounded-full font-black">我知道了</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
