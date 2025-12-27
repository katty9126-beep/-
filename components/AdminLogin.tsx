
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      onClose();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-serif mb-8 text-center tracking-widest">ARTIST ACCESS</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2 block text-center">請輸入管理暗號</label>
            <input 
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className={`w-full text-center text-2xl tracking-[0.5em] bg-transparent border-b ${error ? 'border-red-400' : 'border-gray-200'} py-4 focus:border-black transition-colors outline-none font-light`}
            />
            {error && <p className="text-red-400 text-[10px] text-center mt-2 uppercase tracking-widest">密碼錯誤，請重新輸入</p>}
          </div>
          <div className="flex flex-col space-y-4 pt-4">
            <button 
              type="submit"
              className="bg-[#2d2d2d] text-white py-4 text-xs tracking-[0.3em] hover:bg-black transition-all"
            >
              進入工作室
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="text-gray-400 py-2 text-[10px] tracking-[0.3em] hover:text-black transition-all uppercase"
            >
              取消返回
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
