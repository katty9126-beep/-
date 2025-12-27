
import React, { useState, useRef } from 'react';
import { PetPhoto, SiteConfig } from '../types';

interface PetGalleryProps {
  isAdmin: boolean;
  photos: PetPhoto[];
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  onPhotosChange: (photos: PetPhoto[]) => void;
}

const PetGallery: React.FC<PetGalleryProps> = ({ isAdmin, photos, siteConfig, onUpdateConfig, onPhotosChange }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDesigner, setShowDesigner] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PetPhoto | null>(null);
  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const { petGalleryConfig, theme } = siteConfig;

  const updateConfig = (field: keyof typeof petGalleryConfig, value: any) => {
    onUpdateConfig({
      ...siteConfig,
      petGalleryConfig: { ...petGalleryConfig, [field]: value }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isEdit && editingPhoto) {
          setEditingPhoto({ ...editingPhoto, url: base64 });
        } else {
          setNewPhoto(prev => ({ ...prev, url: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!newPhoto.url) {
      alert("請先選取一張貓貓/狗狗的照片喔！");
      return;
    }
    const photo: PetPhoto = {
      id: Date.now().toString(),
      url: newPhoto.url,
      caption: newPhoto.caption || '可愛的日常瞬間'
    };
    onPhotosChange([photo, ...photos]);
    setShowAddModal(false);
    setNewPhoto({ url: '', caption: '' });
  };

  const handleUpdate = () => {
    if (!editingPhoto) return;
    onPhotosChange(photos.map(p => p.id === editingPhoto.id ? editingPhoto : p));
    setShowEditModal(false);
    setEditingPhoto(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('確定要刪除這張照片嗎？')) {
      onPhotosChange(photos.filter(p => p.id !== id));
    }
  };

  const openEdit = (e: React.MouseEvent, photo: PetPhoto) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPhoto({ ...photo });
    setShowEditModal(true);
  };

  return (
    <section 
      id="pets"
      className="py-32 px-6 scroll-mt-32"
      style={{ fontFamily: petGalleryConfig.useSerif ? theme.fontSerif : theme.fontSans }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8 relative">
          <div className="text-center md:text-left">
            <span className="text-[10px] tracking-[0.5em] uppercase font-bold mb-4 block" style={{ color: petGalleryConfig.headingColor }}>Soul Mates</span>
            <h2 className="text-4xl md:text-5xl font-serif" style={{ color: petGalleryConfig.titleColor }}>寵物日常</h2>
            <div className="w-12 h-1 mt-6 mx-auto md:mx-0" style={{ backgroundColor: petGalleryConfig.headingColor }}></div>
          </div>
          
          {isAdmin && (
            <div className="flex flex-wrap justify-center gap-4">
               <button 
                onClick={() => setShowDesigner(!showDesigner)}
                className="p-4 bg-white dark:bg-zinc-800 border border-indigo-100 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
               >
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
               </button>

               <button 
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-zinc-900 text-white text-[10px] tracking-widest font-bold uppercase rounded-full shadow-2xl hover:scale-105 transition-all flex items-center space-x-3 border-2 border-white/20"
               >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>+ 新增貓貓照片</span>
              </button>

              {showDesigner && (
                <div className="absolute top-full right-0 mt-6 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 w-80 animate-in slide-in-from-top-6 duration-300 z-[200]">
                  <div className="space-y-6">
                    <h5 className="text-[9px] font-black tracking-widest uppercase text-indigo-500 mb-4">寵物日常設計師</h5>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[7px] font-bold text-gray-400 uppercase">標題文字大小</p>
                        <input type="range" min="20" max="100" value={petGalleryConfig.titleSize} onChange={e => updateConfig('titleSize', parseInt(e.target.value))} className="w-full h-8 accent-indigo-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[7px] font-bold text-gray-400 uppercase">標題顏色</p>
                        <input type="color" value={petGalleryConfig.titleColor} onChange={e => updateConfig('titleColor', e.target.value)} className="w-full h-8 rounded-lg" />
                      </div>
                    </div>
                    <button onClick={() => setShowDesigner(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[9px] font-bold uppercase">關閉設計面板</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-[3rem]">
             <p className="text-zinc-300 font-serif italic text-lg">還沒有上傳照片喔，點擊上方按鈕開始分享店貓日常 ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="bg-white p-4 pb-12 shadow-sm rounded-sm transform transition-all duration-500 hover:-rotate-2 hover:shadow-2xl hover:scale-105 border border-gray-50">
                  <div className="aspect-square overflow-hidden mb-6 bg-gray-50">
                    <img src={photo.url} alt="Pet" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <p className="text-xs font-serif italic text-center tracking-wide leading-relaxed px-2" style={{ color: petGalleryConfig.captionColor }}>
                    "{photo.caption}"
                  </p>
                </div>
                
                {isAdmin && (
                  <div className="absolute -top-4 -right-4 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-opacity z-[150]">
                    <button onClick={(e) => handleDelete(e, photo.id)} className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-2 border-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    <button onClick={(e) => openEdit(e, photo)} className="w-10 h-10 bg-white text-[#4a453e] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-2 border-gray-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 新增照片 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-serif text-[#4a453e] mb-8 tracking-widest text-center">分享新的日常瞬間</h3>
            
            <div className="space-y-6">
              <div 
                onClick={() => addFileInputRef.current?.click()}
                className="aspect-square bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition-all overflow-hidden"
              >
                {newPhoto.url ? (
                  <img src={newPhoto.url} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-12 h-12 text-zinc-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">點擊上傳貓貓照片</p>
                  </>
                )}
              </div>
              <input type="file" ref={addFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">拍立得小語 (Caption)</label>
                 <input 
                  type="text" 
                  className="w-full bg-zinc-50 p-4 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-indigo-100"
                  placeholder="例如：今天貓貓又在偷看客人了..."
                  value={newPhoto.caption}
                  onChange={e => setNewPhoto({...newPhoto, caption: e.target.value})}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                 <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-full text-[10px] font-bold uppercase">取消</button>
                 <button onClick={handleAdd} className="flex-1 py-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase shadow-xl">上傳發佈</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 編輯 Modal */}
      {showEditModal && editingPhoto && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-serif text-[#4a453e] mb-8 tracking-widest text-center">修改拍立得小語</h3>
            <div className="space-y-6">
              <div 
                className="aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-inner cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <img src={editingPhoto.url} className="w-full h-full object-cover" />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
              
              <input 
                type="text" 
                className="w-full bg-zinc-50 p-4 rounded-2xl outline-none focus:border-rose-200 text-sm"
                value={editingPhoto.caption}
                onChange={e => setEditingPhoto({...editingPhoto, caption: e.target.value})}
              />
              <button onClick={handleUpdate} className="w-full bg-indigo-600 text-white py-4 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xl">確認修改</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PetGallery;
