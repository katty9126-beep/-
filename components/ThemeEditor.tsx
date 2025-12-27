
import React from 'react';
import { SiteConfig } from '../types';

interface ThemeEditorProps {
  config: SiteConfig;
  onUpdate: (config: SiteConfig) => void;
  onClose: () => void;
}

const FONTS_SERIF = [
  { name: '思源宋體 (繁中)', value: "'Noto Serif TC', serif" },
  { name: '經典英式 (Playfair)', value: "'Playfair Display', serif" },
  { name: '優雅藝術 (Garamond)', value: "'Cormorant Garamond', serif" }
];

const FONTS_SANS = [
  { name: '思源黑體 (繁中)', value: "'Noto Sans TC', sans-serif" },
  { name: '極簡現代 (Inter)', value: "'Inter', sans-serif" },
  { name: '時尚精品 (Montserrat)', value: "'Montserrat', sans-serif" }
];

const ThemeEditor: React.FC<ThemeEditorProps> = ({ config, onUpdate, onClose }) => {
  const updateTheme = (key: keyof typeof config.theme, value: any) => {
    onUpdate({
      ...config,
      theme: { ...config.theme, [key]: value }
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[200] w-full max-w-sm bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-[-20px_0_60px_rgba(0,0,0,0.1)] border-l border-gray-100 dark:border-white/10 p-8 flex flex-col animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-serif text-[var(--text-color)] tracking-widest uppercase">視覺設計面板</h3>
          <p className="text-[9px] text-gray-400 tracking-[0.2em] font-bold uppercase mt-1">Design Your Vibe</p>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-12 pr-2 custom-scrollbar">
        {/* 深色模式切換 */}
        <section className="space-y-6">
          <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-500 border-b border-amber-500/10 pb-2">🌚 顯示模式</h4>
          <button 
            onClick={() => updateTheme('darkMode', !config.theme.darkMode)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
              config.theme.darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-amber-50 border-amber-100 text-amber-900'
            }`}
          >
            <span className="text-xs font-bold tracking-widest">{config.theme.darkMode ? '目前為：深色模式' : '目前為：淺色模式'}</span>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${config.theme.darkMode ? 'bg-amber-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.theme.darkMode ? 'left-7' : 'left-1'}`}></div>
            </div>
          </button>
        </section>

        {/* 顏色選擇 - 僅在淺色模式下可見，深色模式使用預設 */}
        {!config.theme.darkMode && (
          <section className="space-y-6 animate-in fade-in duration-500">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-rose-300 border-b border-rose-50 pb-2">🎨 淺色氛圍調色盤</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase">品牌主色</label>
                <input type="color" value={config.theme.primary} onChange={(e) => updateTheme('primary', e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase">背景底色</label>
                <input type="color" value={config.theme.background} onChange={(e) => updateTheme('background', e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" />
              </div>
            </div>
          </section>
        )}

        {/* 字體與圓角 - 兩模式共用 */}
        <section className="space-y-6">
          <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-indigo-400 border-b border-indigo-50 dark:border-white/5 pb-2">✒️ 字體選與圓潤度</h4>
          <div className="space-y-4">
            <label className="text-[9px] font-bold text-gray-400 uppercase block">標題字體</label>
            <div className="flex flex-col gap-2">
              {FONTS_SERIF.map(f => (
                <button key={f.value} onClick={() => updateTheme('fontSerif', f.value)} className={`text-left px-4 py-3 rounded-xl text-xs transition-all border ${config.theme.fontSerif === f.value ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-100 dark:border-white/5'}`}>{f.name}</button>
              ))}
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <label className="text-[9px] font-bold text-gray-400 uppercase block">圓潤度</label>
            <input type="range" min="0" max="4" step="0.1" value={parseFloat(config.theme.borderRadius)} onChange={(e) => updateTheme('borderRadius', `${e.target.value}rem`)} className="w-full accent-indigo-500" />
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-gray-100 dark:border-white/5">
        <button 
          onClick={onClose}
          className="w-full bg-[var(--text-color)] text-[var(--bg-color)] py-5 rounded-3xl text-[10px] tracking-[0.5em] font-bold uppercase shadow-2xl transition-all"
        >
          儲存設定 ✨
        </button>
      </div>
    </div>
  );
};

export default ThemeEditor;
