
import React, { useState, useEffect, useRef } from 'react';
import { processAIRequest } from '../services/gemini';
import { SiteConfig } from '../types';

interface AIConsultantProps {
  isAdmin: boolean;
  currentConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  onNavigateToBooking?: () => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ isAdmin, currentConfig, onUpdateConfig, onNavigateToBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string, image?: string}[]>([
    { role: 'ai', text: '嗨囉！我是您的全能助理。有什麼我可以幫您的嗎？' }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 自動捲動到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isAdmin) {
      setMessages([{ role: 'ai', text: '店長您好！「上帝模式」已啟動。我可以幫您改顏色、換版面，或參考您的照片來裝修網頁。請直接下達指令！' }]);
    }
  }, [isAdmin]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const msgToSend = input.trim();
    if (!msgToSend && !selectedImage) return;
    
    const userMsg = { role: 'user' as const, text: msgToSend || "請參考此圖片", image: selectedImage || undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const result = await processAIRequest(msgToSend, currentConfig, isAdmin, userMsg.image);
      
      if (result.newConfig) {
        onUpdateConfig(result.newConfig);
      }

      let aiText = result.text;
      if (aiText.includes('[TRIGGER_BOOKING]')) {
        aiText = aiText.replace('[TRIGGER_BOOKING]', '').trim();
        setTimeout(() => onNavigateToBooking?.(), 1500);
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: '抱歉，系統連線稍有延遲，請您再試一次！' }]);
    }
    setLoading(false);
  };

  // 縮小後的懸浮球
  if (isMinimized || !isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end space-y-4">
        <button 
          onClick={() => { setIsOpen(true); setIsMinimized(false); }} 
          className={`${isAdmin ? 'bg-indigo-600' : 'bg-[#4a453e]'} text-white w-16 h-16 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-90 transition-all flex items-center justify-center border-4 border-white group relative`}
        >
          {isAdmin ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          )}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          
          {/* 桌面版標籤 */}
          <span className="absolute right-20 bg-white text-[#4a453e] px-4 py-2 rounded-xl shadow-xl text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
            {isAdmin ? '上帝模式設計總管' : '需要協助嗎？'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-end p-4 md:p-6 pointer-events-none">
      <div className="bg-white w-full max-w-[28rem] h-[80vh] md:h-[700px] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white flex flex-col overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Header - 緊湊排版 */}
        <div className={`${isAdmin ? 'bg-indigo-600' : 'bg-[#4a453e]'} p-4 text-white flex justify-between items-center shrink-0`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl backdrop-blur-sm">
              {isAdmin ? '⚒️' : '🐈'}
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] opacity-70 uppercase font-black">{isAdmin ? 'Master Admin' : 'Assistant'}</p>
              <h3 className="text-sm font-bold font-serif">{isAdmin ? '全能總管 (設計模式)' : 'Katty 的小助理'}</h3>
            </div>
          </div>
          <div className="flex space-x-1">
            <button onClick={() => setIsMinimized(true)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
            </button>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        {/* Messages Area - 確保滾動順暢 */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
              <div className={`max-w-[85%] p-4 rounded-[1.5rem] shadow-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-[#4a453e] rounded-tl-none border border-gray-100'
              }`}>
                {m.image && <img src={m.image} className="w-full rounded-xl mb-3 shadow-md border-2 border-white/10" alt="Ref" />}
                <p className="text-[13px] leading-relaxed font-medium whitespace-pre-line">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/80 px-4 py-2 rounded-2xl border border-gray-100 flex items-center space-x-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - 重大物理修復 */}
        <div className="bg-white border-t border-gray-100 p-4 shrink-0 pb-6 md:pb-4">
          <form onSubmit={handleSend} className="space-y-3">
            {selectedImage && (
              <div className="relative inline-block group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-xl">
                  <img src={selectedImage} className="w-full h-full object-cover" />
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedImage(null)} 
                  className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all border-2 border-white"
                >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {/* 圖片按鈕：使用寬高固定的圓鈕 */}
              <button 
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-12 h-12 shrink-0 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
              <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
              
              {/* 輸入框：加上 min-w-0 確保它不會擠開 flex 容器 */}
              <div className="flex-1 min-w-0 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isAdmin ? "對總管下令..." : "輸入訊息..."}
                  className="w-full h-12 bg-gray-100 rounded-2xl px-4 text-sm font-medium border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all outline-none"
                />
              </div>
              
              {/* 送出按鈕：使用最顯眼的樣式，並確保 shrink-0 */}
              <button 
                type="submit"
                disabled={loading || (!input.trim() && !selectedImage)}
                className={`w-14 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                  isAdmin 
                    ? 'bg-indigo-600 text-white disabled:bg-indigo-200' 
                    : 'bg-[#4a453e] text-white disabled:bg-gray-200'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
