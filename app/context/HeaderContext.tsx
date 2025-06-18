"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface HeaderContextType {
  title: string;
  subtitle: string;
  setHeader: (title: string, subtitle: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState('Dashboard'); // Default title
  const [subtitle, setSubtitle] = useState(''); // Default subtitle

  const setHeader = (newTitle: string, newSubtitle: string) => {
    setTitle(newTitle);
    setSubtitle(newSubtitle);
  };

  return (
    <HeaderContext.Provider value={{ title, subtitle, setHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};
