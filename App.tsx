
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestNews from './components/LatestNews';
import Portfolio from './components/Portfolio';
import Booking from './components/Booking';
import Footer from './components/Footer';
import About from './components/About';
import AdminLogin from './components/AdminLogin';
import PetGallery from './components/PetGallery';
import MonthlySpecials from './components/MonthlySpecials';
import MembershipJoin from './components/MembershipJoin';
import Members from './components/Members'; 
import { View, NailArtWork, AboutData, PetPhoto, SiteConfig, HeroData, MonthlySpecialItem, NewsItem, MembershipJoinData } from './types';
import { PORTFOLIO_WORKS as INITIAL_WORKS, INITIAL_ABOUT, INITIAL_PET_PHOTOS, INITIAL_SITE_CONFIG, INITIAL_HERO, INITIAL_MONTHLY_SPECIALS, INITIAL_NEWS, INITIAL_MEMBERSHIP_JOIN } from './constants';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.HOME);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('nail_admin_active') === 'true');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- 資料狀態管理 ---
  const [works, setWorks] = useState<NailArtWork[]>(() => {
    const saved = localStorage.getItem('nail_art_portfolio');
    return saved ? JSON.parse(saved) : INITIAL_WORKS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('nail_art_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('nail_site_config');
    const base = INITIAL_SITE_CONFIG;
    if (!saved) return base;
    try {
      const parsed: SiteConfig = JSON.parse(saved);
      return { ...base, ...parsed };
    } catch (e) { return base; }
  });

  const [heroData, setHeroData] = useState<HeroData>(() => {
    const saved = localStorage.getItem('nail_art_hero');
    return saved ? JSON.parse(saved) : INITIAL_HERO;
  });

  const [aboutData, setAboutData] = useState<AboutData>(() => {
    const saved = localStorage.getItem('nail_art_about');
    return saved ? JSON.parse(saved) : INITIAL_ABOUT;
  });

  const [membershipJoinData, setMembershipJoinData] = useState<MembershipJoinData>(() => {
    const saved = localStorage.getItem('nail_membership_join');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIP_JOIN;
  });

  const [petPhotos, setPetPhotos] = useState<PetPhoto[]>(() => {
    const saved = localStorage.getItem('nail_art_pets');
    return saved ? JSON.parse(saved) : INITIAL_PET_PHOTOS;
  });

  const [specials, setSpecials] = useState<MonthlySpecialItem[]>(() => {
    const saved = localStorage.getItem('nail_monthly_specials');
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_SPECIALS;
  });

  // --- 自動儲存邏輯 (Auto-Save Effects) ---
  useEffect(() => { setIsInitialized(true); }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('nail_site_config', JSON.stringify(siteConfig));
  }, [siteConfig, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('nail_art_portfolio', JSON.stringify(works));
  }, [works, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('nail_art_news', JSON.stringify(news));
  }, [news, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('nail_art_hero', JSON.stringify(heroData));
  }, [heroData, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('nail_art_about', JSON.stringify(aboutData));
  }, [aboutData, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('nail_membership_join', JSON.stringify(membershipJoinData));
  }, [membershipJoinData, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('nail_art_pets', JSON.stringify(petPhotos));
  }, [petPhotos, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('nail_monthly_specials', JSON.stringify(specials));
  }, [specials, isInitialized]);

  const updateSiteConfig = (newConfig: SiteConfig) => setSiteConfig(newConfig);

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero': return <Hero key="hero" isAdmin={isAdminLoggedIn} onExplore={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} onBook={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} recentWorks={works} heroData={heroData} siteConfig={siteConfig} onUpdateHero={(d) => setHeroData(d)} onUpdateConfig={updateSiteConfig} />;
      case 'news': return <LatestNews key="news" isAdmin={isAdminLoggedIn} news={news} siteConfig={siteConfig} onUpdateConfig={updateSiteConfig} onUpdateNews={(n) => setNews(n)} />;
      case 'specials': return <MonthlySpecials key="specials" isAdmin={isAdminLoggedIn} specials={specials} siteConfig={siteConfig} onUpdateConfig={updateSiteConfig} onUpdateSpecials={(s) => setSpecials(s)} />;
      case 'membershipJoin': return <MembershipJoin key="membershipJoin" isAdmin={isAdminLoggedIn} data={membershipJoinData} siteConfig={siteConfig} onUpdateData={setMembershipJoinData} onUpdateConfig={updateSiteConfig} />;
      case 'members': return <Members key="members" isAdmin={isAdminLoggedIn} siteConfig={siteConfig} onUpdateConfig={updateSiteConfig} />;
      case 'about': return <About key="about" isAdmin={isAdminLoggedIn} aboutData={aboutData} siteConfig={siteConfig} onUpdateAbout={(a) => setAboutData(a)} onUpdateConfig={updateSiteConfig} />;
      case 'pets': return <PetGallery key="pets" isAdmin={isAdminLoggedIn} siteConfig={siteConfig} onUpdateConfig={updateSiteConfig} photos={petPhotos} onPhotosChange={(p) => setPetPhotos(p)} />;
      case 'portfolio': return <Portfolio key="portfolio" isAdmin={isAdminLoggedIn} siteConfig={siteConfig} onUpdateConfig={updateSiteConfig} works={works} onEditWork={(w) => setWorks(works.map(item => item.id === w.id ? w : item))} onAddWork={(w) => setWorks([w, ...works])} onUpdateWorks={(newList) => setWorks(newList)} />;
      case 'booking': return <Booking key="booking" isAdmin={isAdminLoggedIn} siteConfig={siteConfig} onUpdateConfig={updateSiteConfig} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen selection:bg-black selection:text-white">
      <Navbar 
        currentView={currentView} setView={setView} 
        onAdminClick={() => isAdminLoggedIn ? (localStorage.setItem('nail_admin_active', 'false'), setIsAdminLoggedIn(false)) : setShowLoginModal(true)} 
        isAdminLoggedIn={isAdminLoggedIn} siteConfig={siteConfig} onUpdateConfig={updateSiteConfig}
      />
      <main className="bg-transparent">
        {siteConfig.layout.map(renderSection)}
      </main>
      {showLoginModal && (
        <AdminLogin onLogin={(p) => p === 'ky90570206' ? (setIsAdminLoggedIn(true), localStorage.setItem('nail_admin_active', 'true'), true) : false} onClose={() => setShowLoginModal(false)} />
      )}
      <Footer isAdmin={isAdminLoggedIn} siteConfig={siteConfig} onUpdateConfig={updateSiteConfig} onAdminClick={() => isAdminLoggedIn ? setIsAdminLoggedIn(false) : setShowLoginModal(true)} />
    </div>
  );
};

export default App;
