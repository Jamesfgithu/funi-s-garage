'use client';

import { useState } from 'react';

interface PremiumGradientLayoutProps {
  children: React.ReactNode;
}

export default function PremiumGradientLayout({ children }: PremiumGradientLayoutProps) {
  const [activeTab, setActiveTab] = useState('email-generator');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', subtitle: 'Overview & analytics' },
    { id: 'email-generator', label: 'Email Generator', icon: '⭐', subtitle: 'AI-powered creation', active: true },
    { id: 'quick-generate', label: 'Quick Generate', icon: '⚡', subtitle: 'Instant templates' },
    { id: 'safelist-manager', label: 'Safelist Manager', icon: '🎯', subtitle: 'Ready indicators' },
    { id: 'template-library', label: 'Template Library', icon: '📚', subtitle: 'Proven frameworks' },
    { id: 'analytics', label: 'Analytics', icon: '📈', subtitle: 'Performance metrics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', subtitle: 'Account preferences' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white">
      {/* Sidebar with Premium Gradient */}
      <div className="w-72 bg-gradient-to-b from-gray-800/90 via-purple-800/50 to-gray-900/90 backdrop-blur-sm border-r border-purple-500/20">
        {/* Logo with Gradient Text */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">⭐</span>
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Safelist AI Pro
              </h1>
              <p className="text-xs text-purple-300">Premium Edition</p>
            </div>
          </div>
        </div>

        {/* Navigation with Gradient Accents */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                item.id === activeTab
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-semibold shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:via-pink-600/30 hover:to-red-600/30 hover:text-white hover:scale-102'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.label}</div>
                <div className={`text-xs truncate ${
                  item.id === activeTab ? 'text-black/70' : 'text-gray-400'
                }`}>
                  {item.subtitle}
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Premium Badge */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-3 rounded-xl text-center">
            <div className="text-sm font-semibold">Premium Account</div>
            <div className="text-xs text-purple-100">Unlimited everything</div>
          </div>
        </div>
      </div>

      {/* Main Content with Gradient Header */}
      <div className="flex-1 flex flex-col">
        {/* Premium Header with Three-Color Gradient */}
        <header className="bg-gradient-to-r from-gray-800/95 via-purple-800/95 to-gray-800/95 backdrop-blur-sm border-b border-purple-500/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-yellow-300 bg-clip-text text-transparent">
                Email Generator
              </h1>
              <p className="text-purple-200 mt-1">Create high-converting safelist emails with world-class AI</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105">
                🔔
              </button>
              <button className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105">
                👤
              </button>
            </div>
          </div>
        </header>

        {/* Content Area with Subtle Gradient */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900/50 via-purple-900/30 to-gray-800/50">
          {children}
        </main>
      </div>
    </div>
  );
}
