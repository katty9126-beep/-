
import React, { useState } from 'react';
import { NewsItem, SiteConfig } from '../types';

interface LatestNewsProps {
  isAdmin: boolean;
  news: NewsItem[];
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  onUpdateNews: (items: NewsItem[]) => void;
}

const LatestNews: React.FC<LatestNewsProps> = ({ isAdmin, news, siteConfig, onUpdateConfig, onUpdateNews }) => {
  const [showDesigner, setShowDesigner] = useState(false);
  const { newsConfig, theme } = siteConfig;

  const updateConfig = (field: keyof typeof newsConfig, value: any) => {
    onUpdateConfig({
      ...siteConfig,
      newsConfig: { ...newsConfig, [field]: value }
    });
  };

  const handleAddNews = () => {
    const newItem: NewsItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('zh-TW').replace(/\//g, '.'),
      tag: 'NEW',
      title: '請輸入公告標題',
      content: '請在此輸入詳細內容...'
    };
    onUpdateNews([newItem, ...news]);
  };

  const handleUpdateItem = (id: string, field: keyof NewsItem, value: string) => {
    onUpdateNews(news.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('確定要移除這則公告嗎？')) {
      onUpdateNews(news.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    localStorage.setItem('nail_art_news', JSON.stringify(news));
    localStorage.setItem('nail_site_config', JSON.stringify(siteConfig));
    alert('📰 公告版面設計已成功儲存！');
  };

  return (
    <section id="news" className="py-60 px-10 max-w-[100rem] mx-auto scroll-mt-32 reveal relative">
      {/* 店長專屬控制列 */}
      {isAdmin && (
        <div className="absolute top-0 right-10 flex gap-4 z-50">
          <button 
            onClick={() => setShowDesigner(!showDesigner)} 
            className="px-8 py-3 bg-indigo-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            🎨 調整文字與樣式
          </button>
          <button 
            onClick={handleAddNews} 
            className="px-8 py-3 bg-zinc-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            ＋ 發佈公告
          </button>
          <button 
            onClick={handleSave} 
            className="px-8 py-3 bg-white border border-zinc-200 text-black rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-zinc-50 transition-all"
          >
            儲存所有內容
          </button>
        </div>
      )}

      {/* 公告設計師面板 */}
      {isAdmin && showDesigner && (
        <div className="fixed top-24 right-10 bg-white p-10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-zinc-100 w-80 z-[100] text-left animate-in zoom-in duration-300 text-black">
          <div className="space-y-8">
            <h5 className="text-[10px] font-black tracking-widest uppercase text-indigo-500 mb-6">公告視覺控制面板</h5>
            
            <div className="space-y-4">
              <p className="text-[8px] font-bold text-gray-400 uppercase">主標題大小 ({newsConfig.titleSize}px)</p>
              <input type="range" min="30" max="180" value={newsConfig.titleSize} onChange={e => updateConfig('titleSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
            </div>

            <div className="space-y-4">
              <p className="text-[8px] font-bold text-gray-400 uppercase">副標題大小 ({newsConfig.subtitleSize}px)</p>
              <input type="range" min="10" max="40" value={newsConfig.subtitleSize} onChange={e => updateConfig('subtitleSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
            </div>

            <div className="space-y-4">
              <p className="text-[8px] font-bold text-gray-400 uppercase">項目標題大小 ({newsConfig.itemTitleSize}px)</p>
              <input type="range" min="20" max="100" value={newsConfig.itemTitleSize} onChange={e => updateConfig('itemTitleSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[7px] text-gray-400 uppercase font-bold">標題顏色</p>
                <input type="color" value={newsConfig.titleColor} onChange={e => updateConfig('titleColor', e.target.value)} className="w-full h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <p className="text-[7px] text-gray-400 uppercase font-bold">對齊方式</p>
                <select className="w-full text-[9px] font-bold p-2 bg-zinc-50 rounded-lg" value={newsConfig.alignment} onChange={e => updateConfig('alignment', e.target.value)}>
                  <option value="left">靠左</option>
                  <option value="center">居中</option>
                </select>
              </div>
            </div>

            <button onClick={() => setShowDesigner(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase">完成設計</button>
          </div>
        </div>
      )}

      <div className={`mb-48 ${newsConfig.alignment === 'center' ? 'text-center' : 'text-left'}`}>
        {isAdmin ? (
          <input 
            className="bg-transparent border-b border-dashed border-zinc-200 outline-none uppercase font-bold tracking-[1.2em] w-full mb-6"
            style={{ color: newsConfig.subtitleColor, fontSize: `${newsConfig.subtitleSize}px`, textAlign: newsConfig.alignment as any }}
            value={newsConfig.subtitle}
            onChange={e => updateConfig('subtitle', e.target.value)}
          />
        ) : (
          <span className="text-[13px] tracking-[1.2em] font-bold uppercase mb-6 opacity-30 block" style={{ color: newsConfig.subtitleColor, fontSize: `${newsConfig.subtitleSize}px` }}>{newsConfig.subtitle}</span>
        )}

        {isAdmin ? (
          <textarea 
            className="font-serif bg-transparent border-b-2 border-dashed border-zinc-200 w-full outline-none focus:border-black py-4 resize-none leading-tight break-keep"
            style={{ fontSize: `${newsConfig.titleSize}px`, color: newsConfig.titleColor, textAlign: newsConfig.alignment as any, height: 'auto' }}
            value={newsConfig.title}
            onChange={e => updateConfig('title', e.target.value)}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        ) : (
          <h2 className="font-serif leading-tight whitespace-pre-line break-keep inline-block" style={{ color: newsConfig.titleColor, fontSize: `${newsConfig.titleSize}px` }}>{newsConfig.title}</h2>
        )}
      </div>

      <div className="space-y-20">
        {news.map((item) => (
          <div key={item.id} className="group border-b border-zinc-100 pb-24 flex flex-col md:flex-row gap-16 md:gap-32 items-start relative">
            {isAdmin && (
              <button onClick={() => handleDeleteItem(item.id)} className="absolute -top-4 -right-4 p-4 bg-rose-500 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20">✕</button>
            )}
            
            <div className="w-full md:w-64 shrink-0 space-y-4">
              {isAdmin ? (
                <input className="bg-transparent border-b border-dashed border-zinc-200 w-full outline-none font-bold tracking-[0.2em] text-zinc-400" value={item.date} onChange={e => handleUpdateItem(item.id, 'date', e.target.value)} />
              ) : (
                <p className="font-bold tracking-[0.3em] text-zinc-300 text-[11px]">{item.date}</p>
              )}
              
              {isAdmin ? (
                <input className="bg-black text-white text-[9px] font-black uppercase px-6 py-2 rounded-full outline-none" value={item.tag} onChange={e => handleUpdateItem(item.id, 'tag', e.target.value)} />
              ) : (
                <span className="inline-block bg-zinc-900 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">{item.tag}</span>
              )}
            </div>

            <div className="flex-1 space-y-10">
              {isAdmin ? (
                <textarea 
                  className="font-serif bg-transparent border-b-2 border-dashed border-zinc-100 w-full outline-none focus:border-black py-4 resize-none leading-tight break-keep"
                  style={{ fontSize: `${newsConfig.itemTitleSize}px`, color: newsConfig.itemTitleColor }}
                  value={item.title}
                  onChange={e => handleUpdateItem(item.id, 'title', e.target.value)}
                />
              ) : (
                <h3 className="font-serif leading-tight whitespace-pre-line break-keep" style={{ fontSize: `${newsConfig.itemTitleSize}px`, color: newsConfig.itemTitleColor }}>{item.title}</h3>
              )}

              {isAdmin ? (
                <textarea 
                  className="font-light leading-[2.2] bg-white border border-dashed border-zinc-200 w-full h-48 p-10 outline-none focus:border-black rounded-[3rem]"
                  style={{ fontSize: `${newsConfig.contentSize}px`, color: newsConfig.contentColor }}
                  value={item.content}
                  onChange={e => handleUpdateItem(item.id, 'content', e.target.value)}
                />
              ) : (
                <p className="font-light leading-[2.2] whitespace-pre-line tracking-tight opacity-50" style={{ fontSize: `${newsConfig.contentSize}px`, color: newsConfig.contentColor }}>{item.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
