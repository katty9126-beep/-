
import React, { useState, useRef, useEffect } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 使用更穩定的 MP3 來源 (Erik Satie: Gymnopédie No. 1 - 經典鋼琴曲，非常適合美甲店氛圍)
  const MUSIC_URL = "https://cdn.pixabay.com/audio/2022/01/18/audio_248674d812.mp3"; 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // 預設適中的背景音量
    }
    // 12秒後自動隱藏提示文字
    const timer = setTimeout(() => setShowHint(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    setShowHint(false);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Playback blocked by browser:", error);
          // 再次嘗試加載
          audioRef.current?.load();
          audioRef.current?.play().then(() => setIsPlaying(true));
        });
      }
    }
  };

  return (
    <div className="fixed bottom-10 left-10 z-[5000] flex items-center group/music">
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src={MUSIC_URL} 
      />
      
      <button 
        onClick={togglePlay}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-2 border-white/80 backdrop-blur-3xl hover:scale-110 active:scale-95 ${
          isPlaying 
          ? 'bg-gradient-to-tr from-[#c48d86] to-[#e8c1ba] text-white shadow-[#c48d86]/40' 
          : 'bg-white/90 text-zinc-400'
        }`}
      >
        {/* 未播放時的擴散漣漪動畫 */}
        {!isPlaying && (
          <>
            <div className="absolute inset-0 rounded-full bg-[#c48d86]/20 animate-ping"></div>
            <div className="absolute inset-[-4px] rounded-full border border-[#c48d86]/10 animate-pulse"></div>
          </>
        )}
        
        {/* 播放/暫停 圖標 */}
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
          <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>

      {/* 提示對話框 - 現代化質感 */}
      {(showHint && !isPlaying) && (
        <div className="ml-6 px-6 py-4 bg-white/90 backdrop-blur-xl text-[#1a1a1a] rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-white animate-in slide-in-from-left-4 duration-700">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase flex items-center whitespace-nowrap">
            <span className="mr-3 text-sm">🎹</span>
            開啟店內氛圍音樂
          </p>
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/90 rotate-45 border-l border-b border-transparent"></div>
        </div>
      )}

      {/* 播放中的聲波視覺效果 - 更細緻的動畫 */}
      {isPlaying && (
        <div className="ml-5 flex items-end space-x-1.5 h-5 opacity-60">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className="w-1 bg-[#c48d86] rounded-full animate-bounce" 
              style={{ 
                height: `${30 + Math.random() * 70}%`, 
                animationDuration: `${0.6 + i * 0.15}s`,
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BackgroundMusic;
