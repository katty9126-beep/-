
import { NailArtWork, AboutData, PetPhoto, SiteConfig, HeroData, MonthlySpecialItem, NewsItem, MembershipJoinData } from './types';

export const INITIAL_SITE_CONFIG: SiteConfig = {
  theme: {
    primary: '#c48d86',
    background: '#f9f7f2',
    text: '#111111',
    accent: '#111111',
    borderRadius: '0rem', 
    fontScale: 1.3,
    fontSerif: "'Playfair Display', 'Noto Serif TC', serif",
    fontSans: "'Inter', 'Noto Sans TC', sans-serif",
    darkMode: false,
    footerBg: '#080808',
    footerText: '#ffffff',
    footerTitleColor: '#ffffff',
    footerLinkColor: '#999999',
    footerHeadingColor: '#ffffff'
  },
  layout: ['hero', 'news', 'portfolio', 'membershipJoin', 'about', 'pets', 'booking', 'members'],
  sectionLabels: {
    hero: '首頁',
    news: '最新公告',
    about: '品牌故事',
    pets: '寵物日常',
    portfolio: '精選作品',
    booking: '立即預約',
    membershipJoin: '成為會員',
    members: '預約查詢'
  },
  membershipJoinConfig: {
    titleSize: 80,
    subtitleSize: 14,
    benefitSize: 22,
    priceSize: 80,
    titleColor: '#111111',
    subtitleColor: '#999999',
    bgColor: '#ffffff',
    accentColor: '#c48d86',
    cardRadius: '4rem',
    useSerif: true
  },
  newsConfig: {
    title: "最新公告。",
    subtitle: "LATEST JOURNAL",
    titleColor: "#111111",
    subtitleColor: "#999",
    itemTitleColor: "#111111",
    contentColor: "#666",
    tagBgColor: "#111111",
    tagTextColor: "#ffffff",
    titleSize: 80,
    subtitleSize: 14,
    itemTitleSize: 42,
    contentSize: 18,
    useSerif: true,
    alignment: 'left'
  },
  bookingConfig: {
    title: "預約。藝術之旅",
    subtitle: "RESERVATION",
    instructions: "致 尋求完美的妳：\n\n我們採【匯款定金制】完成後才算預約成功。\n📌 預約成功後將提供詳細工作室地址。",
    defaultSlots: ["10:00", "14:30", "19:00"],
    serviceItems: ["手繪藝術設計 (含卸甲)", "極致單色保養", "法式風格渲染"],
    bankInfo: "中國信託 (822)\n12345-67890-543\n定金：NT$ 500",
    lineUrl: "#",
    instagramBookingUrl: "https://www.instagram.com/katty_nail_design/",
    titleColor: '#111111',
    subtitleColor: '#999',
    textColor: '#111111',
    bankBgColor: '#f3f3f3',
    useSerif: true,
    alignment: 'center',
    titleSize: 80,
    subtitleSize: 14,
    textSize: 24,
    igBtnColor: '#111111',
    lineBtnColor: '#111111',
    bankInfoSize: 22,
    calendarHeaderColor: "#111111",
    calendarWeekdayColor: "#999",
    calendarDayColor: "#111111",
    calendarSelectedBg: "#111111",
    calendarSelectedText: "#ffffff",
    calendarBg: "#ffffff",
    calendarStyle: 'classic',
    dateShape: 'circle',
    calendarShadow: false
  },
  memberConfig: {
    title: "查詢妳的預約",
    subtitle: "MEMBERSHIP",
    placeholder: "輸入手機號碼",
    buttonText: "立即查詢",
    accentColor: "#111111",
    bgColor: "#ffffff",
    titleColor: "#111111",
    subtitleColor: "#999",
    useSerif: true,
    bgImage: "",
    overlayOpacity: 0.95,
    titleSize: 64,
    subtitleSize: 14,
    inputSize: 28,
    buttonSize: 14,
    alignment: 'center'
  },
  monthlySpecialsConfig: {
    title: "當月限定。",
    subtitle: "MONTHLY EDIT",
    titleColor: "#111111",
    subtitleColor: "#999",
    itemTitleColor: "#111111",
    priceColor: "#111111",
    cardBg: "transparent",
    useSerif: true,
    titleSize: 80,
    subtitleSize: 14,
    itemTitleSize: 32,
    priceSize: 20,
    cardRadius: "0rem",
    alignment: "center"
  },
  footerConfig: {
    brandName: "KY NAIL STUDIO",
    reservationHeading: "CONTACT",
    philosophyHeading: "PHILOSOPHY",
    quote: "Beauty is the soul's mirror.",
    address: "KAOHSIUNG, TAIWAN\n三民區 · 寵物友善",
    depositText: "DEPOSIT REQUIRED",
    locationText: "NEAR KAOHSIUNG MUSEUM",
    instagramUrl: "https://www.instagram.com/katty_nail_design/",
    lineUrl: "#",
    alignment: 'left',
    footerFontSerif: true,
    brandSize: 48,
    addressSize: 14,
    headingSize: 14,
    quoteSize: 24,
    linkSize: 14
  },
  aboutConfig: {
    alignment: 'left',
    imagePosition: 'left',
    titleColor: '#111111',
    textColor: '#111111',
    accentColor: '#111111',
    useSerif: true,
    instagramText: 'FOLLOW ART',
    titleSize: 80,
    textSize: 22,
    accentSize: 14
  },
  heroConfig: {
    titleColor: '#111111',
    subtitleColor: '#999',
    descColor: '#111111',
    tagColor: '#111111',
    useSerif: true,
    alignment: 'center',
    titleSize: 120,
    subtitleSize: 48,
    descSize: 28,
    tagSize: 16
  },
  portfolioConfig: {
    titleColor: '#111111',
    headingColor: '#999',
    storyColor: '#111111',
    itemTitleColor: '#111111',
    useSerif: true,
    titleSize: 80,
    headingSize: 14,
    itemTitleSize: 36,
    storySize: 22
  },
  petGalleryConfig: {
    titleColor: '#111111',
    headingColor: '#999',
    captionColor: '#111111',
    useSerif: true,
    titleSize: 80,
    headingSize: 14,
    captionSize: 16
  },
  navbarConfig: {
    brandColor: '#111111',
    linkColor: '#111111',
    bgColor: 'rgba(249, 247, 242, 0.98)',
    useSerif: true,
    blurEffect: true,
    brandSize: 28,
    linkSize: 16
  }
};

export const INITIAL_HERO: HeroData = {
  studioName: "KY NAIL STUDIO",
  location: "KAOHSIUNG",
  subtitle: "Pure & Elegant.",
  mainTitle: "指尖之上的，\n藝術靈魂。",
  description: "每一份設計，都是一段專屬的故事。\n在 KY STUDIO，我們不只做美甲，我們在創造美學。",
  image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200"
};

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    date: '2024.03.25',
    tag: 'IMPORTANT',
    title: '春季手繪系列正式上線。',
    content: '致 每位藝術追尋者：\n\n我們已經準備好迎接花季。即日起開放四月份預約。',
  }
];

export const INITIAL_ABOUT: AboutData = {
  title: "對美的，極致追求",
  description: "位於高雄科工館旁。我們深信，美甲不僅是裝飾，更是一種生活態度的表達。我們專注於每一道工序，只為呈現最完美的藝術作品。",
  image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=2000"
};

export const INITIAL_MEMBERSHIP_JOIN: MembershipJoinData = {
  title: "專屬。會籍計畫",
  subtitle: "MEMBERSHIP PRIVILEGE",
  eventNotice: "★ 本次過年會員活動：僅開放 10 位名額",
  ctaText: "立即諮詢會籍內容",
  tiers: [
    {
      id: 'tier-6m',
      name: '半年。精緻會籍',
      price: '739',
      duration: '6 Months',
      benefits: [
        "結帳金額享 92 折",
        "手+腳同日施做再折 $50",
        "消費滿千即贈護手保養 (原價 $150)"
      ],
      highlights: [
        { icon: "🎁", text: "贈：Dior 小香水乙瓶 (價值 $100)", colorClass: "text-indigo-600" },
        { icon: "⚡", text: "總計省下超過 2500 元‼️", colorClass: "text-rose-500" },
        { icon: "🔄", text: "續購價再折 $?", colorClass: "text-zinc-400" }
      ]
    },
    {
      id: 'tier-1y',
      name: '一年。尊爵會籍',
      price: '1400',
      duration: '12 Months',
      benefits: [
        "不限款式現折 $200",
        "腳部加購同日再折 $200",
        "每月卸甲續作贈護手保養 (原價 $150)"
      ],
      highlights: [
        { icon: "🎁", text: "贈：Dior 香水乙瓶 + 會員大禮 (價值 $380)", colorClass: "text-indigo-600" },
        { icon: "⚡", text: "總計省下超過 5000 元‼️", colorClass: "text-rose-500" },
        { icon: "🔄", text: "續購價再折 $?", colorClass: "text-zinc-400" }
      ],
      isPopular: true
    }
  ]
};

export const INITIAL_PET_PHOTOS: PetPhoto[] = [
  { 
    id: 'p1', 
    url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200', 
    caption: '監督進度中的貓店長 🐾' 
  }
];

export const PORTFOLIO_WORKS: NailArtWork[] = [
  {
    id: 'p1',
    title: '雲影。蝶舞',
    category: '手繪藝術',
    images: ['https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200'],
    story: '靈感來自於薄暮時分的雲彩。',
    tags: ['手繪']
  }
];

export const INITIAL_MONTHLY_SPECIALS: MonthlySpecialItem[] = [
  {
    id: 's1',
    title: '春日氣息。手繪款',
    price: 'NT$ 1,680',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800',
    description: '細膩的手繪花卉，彷彿將指尖帶入春意盎然的花園。'
  }
];
