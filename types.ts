
export interface NailArtWork {
  id: string;
  title: string;
  category: string;
  images: string[];
  story: string;
  tags: string[];
}

export interface NewsItem {
  id: string;
  date: string;
  tag: string;
  title: string;
  content: string;
  image?: string;
}

export interface MonthlySpecialItem {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
}

export interface PetPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface AboutData {
  title: string;
  description: string;
  image: string;
}

export interface MemberHighlight {
  icon: string;
  text: string;
  colorClass: string;
}

export interface MemberTier {
  id: string;
  name: string;
  price: string;
  duration: string;
  benefits: string[];
  highlights: MemberHighlight[];
  isPopular?: boolean;
}

export interface MembershipJoinData {
  title: string;
  subtitle: string;
  eventNotice: string;
  tiers: MemberTier[];
  ctaText: string;
}

export interface HeroData {
  studioName: string;
  subtitle: string;
  mainTitle: string;
  description: string;
  location: string;
  image?: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  service: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SiteConfig {
  theme: {
    primary: string;
    background: string;
    text: string;
    accent: string;
    borderRadius: string;
    fontScale: number;
    fontSerif: string;
    fontSans: string;
    darkMode: boolean;
    footerBg: string;
    footerText: string;
    footerTitleColor: string;
    footerLinkColor: string;
    footerHeadingColor: string;
  };
  layout: string[];
  sectionLabels: Record<string, string>;
  bookingConfig: {
    title: string;
    subtitle: string;
    instructions: string;
    defaultSlots: string[];
    serviceItems: string[];
    bankInfo: string;
    lineUrl: string;
    instagramBookingUrl: string;
    titleColor: string;
    subtitleColor: string;
    textColor: string;
    bankBgColor: string;
    useSerif: boolean;
    alignment: 'left' | 'center';
    titleSize: number;
    subtitleSize: number;
    textSize: number;
    igBtnColor: string;
    lineBtnColor: string;
    bankInfoSize: number;
    calendarHeaderColor: string;
    calendarWeekdayColor: string;
    calendarDayColor: string;
    calendarSelectedBg: string;
    calendarSelectedText: string;
    calendarBg: string;
    calendarStyle: 'minimal' | 'glass' | 'classic';
    dateShape: 'circle' | 'rounded' | 'square';
    calendarShadow: boolean;
  };
  memberConfig: {
    title: string;
    subtitle: string;
    placeholder: string;
    buttonText: string;
    accentColor: string;
    bgColor: string;
    titleColor: string;
    subtitleColor: string;
    useSerif: boolean;
    bgImage: string;
    overlayOpacity: number;
    titleSize: number;
    subtitleSize: number;
    inputSize: number;
    buttonSize: number;
    alignment: 'left' | 'center';
  };
  membershipJoinConfig: {
    titleSize: number;
    subtitleSize: number;
    benefitSize: number;
    priceSize: number;
    titleColor: string;
    subtitleColor: string;
    bgColor: string;
    accentColor: string;
    cardRadius: string;
    useSerif: boolean;
  };
  newsConfig: {
    title: string;
    subtitle: string;
    titleColor: string;
    subtitleColor: string;
    itemTitleColor: string;
    contentColor: string;
    tagBgColor: string;
    tagTextColor: string;
    titleSize: number;
    subtitleSize: number;
    itemTitleSize: number;
    contentSize: number;
    useSerif: boolean;
    alignment: 'left' | 'center';
  };
  monthlySpecialsConfig: {
    title: string;
    subtitle: string;
    titleColor: string;
    subtitleColor: string;
    itemTitleColor: string;
    priceColor: string;
    cardBg: string;
    useSerif: boolean;
    titleSize: number;
    subtitleSize: number;
    itemTitleSize: number;
    priceSize: number;
    cardRadius: string;
    alignment: 'left' | 'center';
  };
  footerConfig: {
    brandName: string;
    reservationHeading: string;
    philosophyHeading: string;
    address: string;
    quote: string;
    instagramUrl: string;
    lineUrl: string;
    alignment: 'left' | 'center' | 'right';
    footerFontSerif: boolean;
    depositText: string;
    locationText: string;
    brandSize: number;
    addressSize: number;
    headingSize: number;
    quoteSize: number;
    linkSize: number;
  };
  aboutConfig: {
    alignment: 'left' | 'center' | 'right';
    imagePosition: 'left' | 'right';
    titleColor: string;
    textColor: string;
    accentColor: string;
    useSerif: boolean;
    instagramText: string;
    titleSize: number;
    textSize: number;
    accentSize: number;
  };
  heroConfig: {
    titleColor: string;
    subtitleColor: string;
    descColor: string;
    tagColor: string;
    useSerif: boolean;
    alignment: 'left' | 'center';
    titleSize: number;
    subtitleSize: number;
    descSize: number;
    tagSize: number;
  };
  portfolioConfig: {
    titleColor: string;
    headingColor: string;
    storyColor: string;
    itemTitleColor: string;
    useSerif: boolean;
    titleSize: number;
    headingSize: number;
    itemTitleSize: number;
    storySize: number;
  };
  petGalleryConfig: {
    titleColor: string;
    headingColor: string;
    captionColor: string;
    useSerif: boolean;
    titleSize: number;
    headingSize: number;
    captionSize: number;
  };
  navbarConfig: {
    brandColor: string;
    linkColor: string;
    bgColor: string;
    useSerif: boolean;
    blurEffect: boolean;
    brandSize: number;
    linkSize: number;
  };
}

export enum View {
  HOME = 'home',
  GALLERY = 'gallery',
  BOOKING = 'booking',
  ABOUT = 'about',
  ADMIN = 'admin'
}
