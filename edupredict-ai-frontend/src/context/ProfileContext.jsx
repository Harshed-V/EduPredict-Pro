import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext(null);

export function getAvatarDetails(name) {
  if (!name) {
    return {
      initials: '?',
      gradient: 'from-[#3525cd] to-[#4f46e5]',
    };
  }
  const parts = name.trim().split(/\s+/);
  let initials = parts[0].charAt(0).toUpperCase();
  if (parts.length > 1) {
    initials += parts[parts.length - 1].charAt(0).toUpperCase();
  } else if (parts[0].length > 1) {
    initials = parts[0].substring(0, 2).toUpperCase();
  }
  
  // Pick gradient from pre-defined list based on name hash
  const gradients = [
    'from-[#3525cd] to-[#4f46e5]', // Indigo/Purple
    'from-[#00687a] to-[#00acff]', // Cyan/Blue
    'from-[#571ac0] to-[#7f3dd9]', // Deep Purple
    'from-[#ba1a1a] to-[#ff5454]', // Red/Pink
    'from-[#1b8a5a] to-[#2ecc71]', // Green
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  
  return {
    initials,
    gradient: gradients[index],
  };
}

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState({
    username: localStorage.getItem('edupredict_username') || '',
    role: localStorage.getItem('edupredict_role') || ''
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!profile.username || !profile.role) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [profile.username, profile.role]);

  const saveProfile = (username, role) => {
    localStorage.setItem('edupredict_username', username);
    localStorage.setItem('edupredict_role', role);
    setProfileState({ username, role });
    setShowModal(false);
  };

  const clearProfile = () => {
    localStorage.removeItem('edupredict_username');
    localStorage.removeItem('edupredict_role');
    setProfileState({ username: '', role: '' });
    setShowModal(true);
  };

  return (
    <ProfileContext.Provider value={{ ...profile, saveProfile, clearProfile, showModal, setShowModal }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
