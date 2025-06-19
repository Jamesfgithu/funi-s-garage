'use client';

import { useState } from 'react';

interface PremiumGradientLayoutProps {
  children: React.ReactNode;
}

export default function PremiumGradientLayout({
  children,
}: PremiumGradientLayoutProps) {
  const [activeTab, setActiveTab] = useState('email-generator');

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      subtitle: 'Overview & analytics',
    },
    {
      id: 'email-generator',
      label: 'Email Generator',
      icon: '⭐',
      subtitle: 'AI-powered creation',
      active: true,
    },
    {
      id: 'quick-generate',
      label: 'Quick Generate',
      icon: '⚡',
      subtitle: 'Instant templates',
    },
    {
      id: 'safelist-manager',
      label: 'Safelist Manager',
      icon: '🎯',
      subtitle: 'Ready indicators',
    },
    {
      id: 'template-library',
      label: 'Template Library',
      icon: '📚',
      subtitle: 'Proven frameworks',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      subtitle: 'Performance metrics',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      subtitle: 'Account preferences',
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white">
      {/* Sidebar with Premium Gradient */}
      <div className="w-72 border-r border-purple-500/20 bg-gradient-to-b from-gray-800/90 via-purple-800/50 to-gray-900/90 backdrop-blur-sm">
        {/* Logo with Gradient Text */}
        <div className="border-b border-purple-500/20 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg">
              <span className="text-lg font-bold text-white">⭐</span>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-xl font-bold text-transparent">
                Safelist AI Pro
              </h1>
              <p className="text-xs text-purple-300">Premium Edition</p>
            </div>
          </div>
        </div>

        {/* Navigation with Gradient Accents */}
        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left transition-all duration-300 ${
                item.id === activeTab
                  ? 'scale-105 transform bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-semibold text-black shadow-lg'
                  : 'text-gray-300 hover:scale-102 hover:bg-gradient-to-r hover:from-purple-600/30 hover:via-pink-600/30 hover:to-red-600/30 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{item.label}</div>
                <div
                  className={`truncate text-xs ${
                    item.id === activeTab ? 'text-black/70' : 'text-gray-400'
                  }`}
                >
                  {item.subtitle}
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Premium Badge */}
        <div className="absolute right-4 bottom-4 left-4">
          <div className="rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-3 text-center">
            <div className="text-sm font-semibold">Premium Account</div>
            <div className="text-xs text-purple-100">Unlimited everything</div>
          </div>
        </div>
      </div>

      {/* Main Content with Gradient Header */}
      <div className="flex flex-1 flex-col">
        {/* Premium Header with Three-Color Gradient */}
        <header className="border-b border-purple-500/20 bg-gradient-to-r from-gray-800/95 via-purple-800/95 to-gray-800/95 px-8 py-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-white via-purple-200 to-yellow-300 bg-clip-text text-3xl font-bold text-transparent">
                Email Generator
              </h1>
              <p className="mt-1 text-purple-200">
                Create high-converting safelist emails with world-class AI
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="transform rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-3 transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-pink-500">
                🔔
              </button>
              <button className="transform rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3 transition-all duration-300 hover:scale-105 hover:from-yellow-400 hover:to-orange-400">
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
