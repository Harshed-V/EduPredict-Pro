import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';

export default function ProfileModal() {
  const { username: currentUsername, role: currentRole, saveProfile, showModal } = useProfile();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Student');

  useEffect(() => {
    if (showModal) {
      setUsername(currentUsername || '');
      setRole(currentRole || 'Student');
    }
  }, [showModal, currentUsername, currentRole]);

  if (!showModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      saveProfile(username.trim(), role);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111c2d]/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#f9f9ff] dark:bg-[#111c2d] border border-[#dad7ff]/20 shadow-2xl rounded-[2rem] p-8 max-w-md w-full transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3525cd]/10 flex items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-2xl font-semibold">school</span>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-[#3525cd] dark:text-[#c3c0ff] tracking-tight">
              Welcome to EduPredict AI
            </h2>
            <p className="text-[#464555] dark:text-[#c7c4d8] text-xs">
              Let's customize your workspace
            </p>
          </div>
        </div>
        
        <p className="text-[#464555] dark:text-[#c7c4d8] text-sm mb-6 leading-relaxed">
          Please enter your name and select your current profile type to personalize the predictive analytics engine.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="font-label-md text-[#111c2d] dark:text-[#f9f9ff] text-sm font-semibold block">
              What should we call you?
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prof. Henderson"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#e7eeff]/40 dark:bg-[#1e293b] border border-[#c7c4d8]/40 rounded-xl px-4 py-3 text-[#111c2d] dark:text-[#f9f9ff] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:border-[#3525cd] outline-none transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-md text-[#111c2d] dark:text-[#f9f9ff] text-sm font-semibold block">
              Choose your profile
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('Student')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'Student'
                    ? 'border-[#3525cd] bg-[#3525cd]/5 text-[#3525cd] font-semibold'
                    : 'border-[#c7c4d8]/30 hover:border-[#c7c4d8] text-[#464555] dark:text-[#c7c4d8]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl mb-1">local_library</span>
                <span className="text-xs">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('Working')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'Working'
                    ? 'border-[#3525cd] bg-[#3525cd]/5 text-[#3525cd] font-semibold'
                    : 'border-[#c7c4d8]/30 hover:border-[#c7c4d8] text-[#464555] dark:text-[#c7c4d8]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl mb-1">work</span>
                <span className="text-xs">Working</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3525cd] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#3525cd]/25 hover:bg-[#2b1ebb] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>Proceed to App</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
}
