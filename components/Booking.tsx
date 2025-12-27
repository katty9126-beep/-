
import React, { useState, useMemo, useEffect } from 'react';
import { SiteConfig, Appointment } from '../types';

interface BookingProps {
  isAdmin?: boolean;
  siteConfig: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
}

const Booking: React.FC<BookingProps> = ({ isAdmin = false, siteConfig, onUpdateConfig }) => {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [allSchedules, setAllSchedules] = useState<Record<string, string[]>>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // 管理員編輯面板狀態
  const [editTarget, setEditTarget] = useState<'calendar' | 'slots' | 'content' | 'bank' | 'dashboard' | null>(null);
  const [isDayEditing, setIsDayEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState<typeof siteConfig.bookingConfig | null>(null);

  // 客戶填寫表單狀態
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [customerData, setCustomerData] = useState({ name: '', phone: '', service: '', notes: '' });
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const { bookingConfig, theme } = siteConfig;

  useEffect(() => {
    const savedSchedules = localStorage.getItem('nail_day_schedules');
    if (savedSchedules) setAllSchedules(JSON.parse(savedSchedules));

    const savedAppointments = localStorage.getItem('nail_appointments');
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
  }, []);

  // 當選擇時段或開啟表單時，確保有預設項目
  useEffect(() => {
    if (showBookingForm && !customerData.service && bookingConfig.serviceItems.length > 0) {
      setCustomerData(prev => ({ ...prev, service: bookingConfig.serviceItems[0] }));
    }
  }, [showBookingForm, bookingConfig.serviceItems]);

  const saveAppointments = (list: Appointment[]) => {
    setAppointments(list);
    localStorage.setItem('nail_appointments', JSON.stringify(list));
  };

  // 開啟編輯
  const startEdit = (target: any) => {
    setTempConfig({ ...bookingConfig });
    setEditTarget(target);
  };

  const confirmEdit = () => {
    if (tempConfig) onUpdateConfig({ ...siteConfig, bookingConfig: tempConfig });
    setEditTarget(null);
    setTempConfig(null);
  };

  const cancelEdit = () => {
    setEditTarget(null);
    setTempConfig(null);
  };

  const updateTemp = (updates: Partial<typeof bookingConfig>) => {
    if (tempConfig) setTempConfig({ ...tempConfig, ...updates });
  };

  // 客戶提交預約
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      date: selectedDate,
      time: selectedSlot,
      customerName: customerData.name,
      phone: customerData.phone,
      service: customerData.service,
      notes: customerData.notes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    saveAppointments([newAppointment, ...appointments]);
    setIsBookingSuccess(true);
    setTimeout(() => {
      setShowBookingForm(false);
      setIsBookingSuccess(false);
      setSelectedSlot(null);
      setCustomerData({ name: '', phone: '', service: bookingConfig.serviceItems[0] || '', notes: '' });
    }, 2500);
  };

  // 時段可用性判斷：比對已有的預約紀錄
  const getBookedTimes = (date: string) => {
    return appointments
      .filter(app => app.date === date && app.status !== 'cancelled')
      .map(app => app.time);
  };

  const handleToggleDaySlot = (time: string) => {
    if (!selectedDate || !isAdmin) return;
    const currentSlots = allSchedules[selectedDate] || [...bookingConfig.defaultSlots];
    const newSlots = currentSlots.includes(time) 
      ? currentSlots.filter(t => t !== time)
      : [...currentSlots, time].sort();
    
    const nextSchedules = { ...allSchedules, [selectedDate]: newSlots };
    setAllSchedules(nextSchedules);
    localStorage.setItem('nail_day_schedules', JSON.stringify(nextSchedules));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentDate, firstDayOfMonth, daysInMonth]);

  const calendarClass = {
    minimal: 'bg-transparent border-none',
    glass: 'bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl',
    classic: 'bg-white border border-gray-100 shadow-xl'
  }[bookingConfig.calendarStyle];

  const dateShapeClass = {
    circle: 'rounded-full',
    rounded: 'rounded-2xl',
    square: 'rounded-none'
  }[bookingConfig.dateShape];

  return (
    <section id="booking" className="py-32 px-6 max-w-7xl mx-auto min-h-screen relative overflow-hidden" style={{ fontFamily: bookingConfig.useSerif ? theme.fontSerif : theme.fontSans }}>
      
      {/* --- 店長中央控制列 --- */}
      <div className="flex flex-col items-center text-center mb-16">
        <span className="uppercase font-bold tracking-[1em] mb-4" style={{ color: bookingConfig.subtitleColor, fontSize: `${bookingConfig.subtitleSize}px` }}>{bookingConfig.subtitle}</span>
        <h2 className="font-serif leading-tight mb-8" style={{ color: bookingConfig.titleColor, fontSize: `${bookingConfig.titleSize}px` }}>{bookingConfig.title}</h2>
        
        {isAdmin && (
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <button onClick={() => startEdit('content')} className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                <span>✎ 內容與項目修正</span>
             </button>
             <button onClick={() => startEdit('calendar')} className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                <span>🎨 日曆設計</span>
             </button>
             <button onClick={() => startEdit('slots')} className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>⏰ 時段管理</span>
             </button>
             <button onClick={() => startEdit('dashboard')} className="flex items-center space-x-2 px-6 py-2.5 bg-zinc-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all border border-zinc-700">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002-2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <span className="text-yellow-400">📋 預約資料總覽</span>
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* 左側：日曆區域 */}
        <div className={`${calendarClass} p-10 rounded-[3rem] transition-all duration-700`} style={{ backgroundColor: bookingConfig.calendarStyle === 'classic' ? bookingConfig.calendarBg : undefined }}>
            <div className="flex justify-between items-center mb-10 px-4">
              <h3 className="text-2xl font-serif" style={{ color: bookingConfig.calendarHeaderColor }}>{year} 年 {month + 1} 月</h3>
              <div className="flex space-x-2">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-3 hover:bg-black/5 rounded-full" style={{ color: bookingConfig.calendarHeaderColor }}>❮</button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-3 hover:bg-black/5 rounded-full" style={{ color: bookingConfig.calendarHeaderColor }}>❯</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3 text-center">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4" style={{ color: bookingConfig.calendarWeekdayColor }}>{d}</div>
              ))}
              {calendarDays.map((day, i) => {
                const dateStr = day ? `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : null;
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={i}
                    disabled={!day}
                    onClick={() => { day && setSelectedDate(dateStr); setSelectedSlot(null); }}
                    className={`aspect-square flex items-center justify-center text-lg transition-all duration-300 relative ${!day ? 'opacity-0' : dateShapeClass} hover:scale-110`}
                    style={{ 
                      backgroundColor: isSelected ? bookingConfig.calendarSelectedBg : 'transparent',
                      color: isSelected ? bookingConfig.calendarSelectedText : bookingConfig.calendarDayColor,
                      boxShadow: isSelected ? `0 10px 20px ${bookingConfig.calendarSelectedBg}30` : 'none'
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
        </div>

        {/* 右側：時段區域 */}
        <div className="relative">
          {isAdmin && (
            <div className="absolute -top-12 right-0 flex space-x-2 z-20">
               <button onClick={() => setIsDayEditing(!isDayEditing)} className={`px-5 py-2 ${isDayEditing ? 'bg-rose-500' : 'bg-zinc-800'} text-white rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg transition-all`}>
                  <span>{isDayEditing ? '結束單日開關' : '🗓️ 單日營業開關'}</span>
               </button>
            </div>
          )}
          
          {!selectedDate ? (
            <div className="h-[500px] border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-white/20">
               <p className="text-gray-400 font-serif text-lg tracking-widest">請選取日期</p>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-serif text-zinc-800">{selectedDate}</h3>
                  {isDayEditing && <span className="text-[9px] font-black bg-rose-500 text-white px-3 py-1 rounded-full uppercase">開關模式</span>}
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-3">
                     {(isDayEditing ? bookingConfig.defaultSlots : (allSchedules[selectedDate] || bookingConfig.defaultSlots)).map(slot => {
                        const isSetOpen = (allSchedules[selectedDate] || bookingConfig.defaultSlots).includes(slot);
                        const isBooked = getBookedTimes(selectedDate).includes(slot);
                        const isCurrentSelected = selectedSlot === slot;
                        
                        // 如果該時段已被預約，且不是在管理員編輯模式下，則不顯示或改為不可點選
                        const shouldHide = !isDayEditing && isBooked;

                        return (
                          <button 
                            key={slot} 
                            disabled={!isDayEditing && (isBooked || !isSetOpen)}
                            onClick={() => isDayEditing ? handleToggleDaySlot(slot) : isSetOpen && setSelectedSlot(slot)}
                            className={`py-4 border-2 rounded-2xl text-[11px] font-bold transition-all relative ${
                              isCurrentSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 
                              shouldHide ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed grayscale' :
                              isSetOpen ? 'border-gray-100 text-zinc-600 hover:border-indigo-300' : 
                              isDayEditing ? 'border-gray-50 text-gray-200' : 'hidden'
                            }`}
                          >
                            {slot}
                            {isBooked && !isDayEditing && <span className="absolute -top-2 -right-2 bg-zinc-800 text-[8px] px-2 py-0.5 text-white rounded-full">已約滿</span>}
                          </button>
                        );
                     })}
                  </div>

                  {selectedSlot && !isDayEditing && (
                    <button 
                      onClick={() => setShowBookingForm(true)}
                      className="w-full py-5 bg-zinc-900 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
                    >
                      ✓ 確認填寫預約資料 ({selectedSlot})
                    </button>
                  )}

                  <div className="p-6 rounded-[2rem] relative group/bank shadow-inner text-center" style={{ backgroundColor: bookingConfig.bankBgColor }}>
                     <p className="text-[8px] font-black opacity-30 uppercase mb-3">匯款資訊</p>
                     <p className="font-serif leading-relaxed opacity-80 whitespace-pre-line" style={{ fontSize: `${bookingConfig.bankInfoSize}px` }}>{bookingConfig.bankInfo}</p>
                     {isAdmin && <button onClick={() => startEdit('bank')} className="absolute top-3 right-3 opacity-0 group-hover/bank:opacity-100 p-2 bg-indigo-600 text-white rounded-full text-[8px] font-bold shadow-lg">✎ 修改</button>}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* --- 客戶填寫表單 Modal --- */}
      {showBookingForm && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isBookingSuccess && setShowBookingForm(false)}></div>
           <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 flex flex-col items-center">
              {isBookingSuccess ? (
                <div className="py-20 flex flex-col items-center text-center animate-bounce">
                   <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-2xl">✓</div>
                   <h4 className="text-2xl font-serif text-zinc-800">預約成功！</h4>
                   <p className="text-gray-400 mt-2">我們將盡快與您聯繫確認 ✨</p>
                </div>
              ) : (
                <>
                  <div className="w-full flex justify-between items-start mb-8">
                     <div className="bg-zinc-50 px-5 py-3 rounded-2xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Selected Date & Time</p>
                        <h4 className="text-lg font-serif mt-1">{selectedDate} @ {selectedSlot}</h4>
                     </div>
                     <button onClick={() => setShowBookingForm(false)} className="w-10 h-10 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center hover:text-rose-500 transition-colors">✕</button>
                  </div>
                  
                  <form onSubmit={handleCustomerSubmit} className="w-full space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">您的稱呼 / Name</label>
                        <input required className="w-full bg-gray-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all" value={customerData.name} onChange={e => setCustomerData({...customerData, name: e.target.value})} placeholder="例如：林小姐" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">聯繫電話 / Phone</label>
                        <input required className="w-full bg-gray-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all" value={customerData.phone} onChange={e => setCustomerData({...customerData, phone: e.target.value})} placeholder="09XX-XXX-XXX" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">想做的項目 / Service</label>
                        <select 
                          required 
                          className="w-full bg-gray-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-100 focus:bg-white appearance-none cursor-pointer" 
                          value={customerData.service} 
                          onChange={e => setCustomerData({...customerData, service: e.target.value})}
                        >
                           {bookingConfig.serviceItems.map(item => (
                             <option key={item} value={item}>{item}</option>
                           ))}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">備註 (卸甲、特殊需求)</label>
                        <input className="w-full bg-gray-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all" value={customerData.notes} onChange={e => setCustomerData({...customerData, notes: e.target.value})} placeholder="是否有他店卸甲？或其他需求..." />
                     </div>
                     <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-700 transition-all pt-10 mt-4">送出預約申請</button>
                  </form>
                </>
              )}
           </div>
        </div>
      )}

      {/* --- 管理員：預約總覽 Dashboard --- */}
      {editTarget === 'dashboard' && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setEditTarget(null)}></div>
           <div className="relative bg-white w-full max-w-6xl h-[85vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden">
              <div className="p-10 border-b flex justify-between items-center bg-zinc-900 text-white">
                 <div>
                    <h4 className="text-2xl font-serif text-yellow-400">預約管理總覽</h4>
                    <p className="text-[10px] opacity-60 uppercase font-black tracking-widest mt-1">Total: {appointments.length} Appointments</p>
                 </div>
                 <button onClick={() => setEditTarget(null)} className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-white bg-white/5 rounded-full transition-colors">✕</button>
              </div>

              <div className="flex-1 overflow-auto p-10 custom-scrollbar bg-gray-50">
                 {appointments.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-gray-300">
                      <div className="text-6xl mb-6">📄</div>
                      <p className="text-xl font-serif text-center">目前還沒有客戶提交預約喔</p>
                   </div>
                 ) : (
                   <div className="min-w-[800px]">
                      <table className="w-full border-separate border-spacing-y-4">
                        <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">
                          <tr>
                            <th className="px-6 py-4">預約日期</th>
                            <th className="px-6 py-4">時段</th>
                            <th className="px-6 py-4">客戶資料</th>
                            <th className="px-6 py-4">預約項目</th>
                            <th className="px-6 py-4">狀態</th>
                            <th className="px-6 py-4 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {appointments.map(app => (
                            <tr key={app.id} className="bg-white rounded-3xl group hover:shadow-md transition-all">
                              <td className="px-6 py-6 font-bold rounded-l-3xl">{app.date}</td>
                              <td className="px-6 py-6 font-black text-indigo-600">{app.time}</td>
                              <td className="px-6 py-6">
                                <p className="font-bold text-zinc-800">{app.customerName}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{app.phone}</p>
                              </td>
                              <td className="px-6 py-6">
                                <span className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full text-[10px] font-bold text-gray-500">{app.service}</span>
                                {app.notes && <p className="text-[9px] text-zinc-400 mt-1 italic">備註: {app.notes}</p>}
                              </td>
                              <td className="px-6 py-6">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${
                                  app.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                                  app.status === 'confirmed' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-right rounded-r-3xl">
                                <div className="flex justify-end space-x-2">
                                  <button onClick={() => {
                                    if(window.confirm('確定要刪除這筆預約嗎？這將釋出該時段。')){
                                       saveAppointments(appointments.filter(a => a.id !== app.id));
                                    }
                                  }} className="p-3 text-rose-400 hover:bg-rose-50 rounded-full transition-colors">🗑️</button>
                                  {app.status === 'pending' && (
                                    <button onClick={() => {
                                      const next = appointments.map(a => a.id === app.id ? {...a, status: 'confirmed' as const} : a);
                                      saveAppointments(next);
                                    }} className="p-3 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors">✓ 確認預約</button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* --- 其餘編輯面板 (Calendar, Slots, Bank, Content) --- */}
      {editTarget && editTarget !== 'dashboard' && tempConfig && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={cancelEdit}></div>
           <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
              <div className="p-10 border-b flex justify-between items-center shrink-0">
                 <div>
                    <h4 className="text-2xl font-serif text-indigo-600">
                      {editTarget === 'calendar' ? '日曆視覺實驗室' : editTarget === 'slots' ? '時段清單修正' : editTarget === 'bank' ? '修改匯款資訊' : '內容與預約項目修正'}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">Design Master Tool v2.5</p>
                 </div>
                 <button onClick={cancelEdit} className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-rose-500 bg-gray-50 rounded-full">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 {/* 預約項目與標題編輯 */}
                 {editTarget === 'content' && (
                   <div className="space-y-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">主副標題文字</label>
                         <input className="w-full bg-gray-50 p-6 rounded-2xl outline-none font-serif text-2xl mb-4" value={tempConfig.title} onChange={e => updateTemp({ title: e.target.value })} />
                         <input className="w-full bg-gray-50 p-6 rounded-2xl outline-none font-black tracking-[1em] uppercase" value={tempConfig.subtitle} onChange={e => updateTemp({ subtitle: e.target.value })} />
                      </div>

                      <div className="space-y-4 pt-8 border-t border-gray-100">
                         <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">📜 預約須知說明文字 (必填區塊)</label>
                         <textarea 
                          className="w-full bg-gray-50 p-6 rounded-2xl outline-none font-medium text-sm leading-relaxed h-48 focus:bg-white border-2 border-transparent focus:border-indigo-100" 
                          value={tempConfig.instructions} 
                          onChange={e => updateTemp({ instructions: e.target.value })}
                          placeholder="在此輸入您的預約須知內容..."
                        />
                         <p className="text-[8px] text-gray-400">這段文字將顯示在預約區塊的上方，幫助客人了解您的預約規定。</p>
                      </div>

                      <div className="space-y-4 pt-8 border-t border-gray-100">
                         <div className="flex justify-between items-center mb-4">
                            <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">預約項目管理 (Service Items)</label>
                            <button onClick={() => updateTemp({ serviceItems: [...tempConfig.serviceItems, '新服務項目'] })} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[9px] font-black">+ 增加項目</button>
                         </div>
                         <div className="space-y-3">
                            {tempConfig.serviceItems.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-3 group">
                                 <input className="flex-1 bg-gray-50 p-4 rounded-xl outline-none focus:bg-white border-2 border-transparent focus:border-indigo-100" value={item} onChange={e => {
                                   const next = [...tempConfig.serviceItems];
                                   next[idx] = e.target.value;
                                   updateTemp({ serviceItems: next });
                                 }} />
                                 <button onClick={() => updateTemp({ serviceItems: tempConfig.serviceItems.filter((_, i) => i !== idx) })} className="p-2 text-rose-400 hover:bg-rose-50 rounded-full">✕</button>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}

                 {/* 時段編輯 */}
                 {editTarget === 'slots' && (
                   <div className="space-y-10">
                      <div className="flex justify-between items-center mb-4">
                         <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">預設時段管理</h5>
                         <button onClick={() => updateTemp({ defaultSlots: [...tempConfig.defaultSlots, '00:00'] })} className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase shadow-lg">+ 增加時段</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         {tempConfig.defaultSlots.map((slot, idx) => (
                           <div key={idx} className="relative group flex items-center">
                              <input className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-5 text-center font-black text-sm outline-none transition-all" value={slot} onChange={e => {
                                const next = [...tempConfig.defaultSlots]; next[idx] = e.target.value; updateTemp({ defaultSlots: next });
                              }} />
                              <button onClick={() => updateTemp({ defaultSlots: tempConfig.defaultSlots.filter((_, i) => i !== idx) })} className="absolute -top-2 -right-2 bg-rose-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-[11px] shadow-xl transition-all">✕</button>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {/* 銀行資訊 */}
                 {editTarget === 'bank' && (
                    <div className="space-y-8">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">匯款資訊內容</label>
                       <textarea className="w-full bg-gray-50 p-8 rounded-[2.5rem] h-64 outline-none focus:ring-4 ring-indigo-500/10 font-serif leading-relaxed text-lg" value={tempConfig.bankInfo} onChange={e => updateTemp({ bankInfo: e.target.value })} />
                    </div>
                 )}

                 {/* 日曆樣式 */}
                 {editTarget === 'calendar' && (
                   <div className="space-y-12">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">精品日曆風格</label>
                        <div className="grid grid-cols-3 gap-3">
                           {(['minimal', 'glass', 'classic'] as const).map(s => (
                             <button key={s} onClick={() => updateTemp({ calendarStyle: s })} className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${tempConfig.calendarStyle === s ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>{s}</button>
                           ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-gray-50">
                         {[
                           { label: '日曆背景色', key: 'calendarBg' },
                           { label: '標題月份色', key: 'calendarHeaderColor' },
                           { label: '選中圈背景', key: 'calendarSelectedBg' },
                           { label: '選中圈字色', key: 'calendarSelectedText' }
                         ].map(item => (
                           <div key={item.key} className="space-y-3">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                             <input type="color" value={(tempConfig as any)[item.key]} onChange={e => updateTemp({ [item.key]: e.target.value })} className="w-full h-12 rounded-2xl cursor-pointer border-none" />
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-10 border-t bg-gray-50/50 flex space-x-6 shrink-0">
                 <button onClick={cancelEdit} className="flex-1 py-6 bg-white border-2 border-gray-100 text-gray-400 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-100 transition-all shadow-sm">✕ 取消變更</button>
                 <button onClick={confirmEdit} className="flex-1 py-6 bg-indigo-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all">✓ 儲存套用</button>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default Booking;
