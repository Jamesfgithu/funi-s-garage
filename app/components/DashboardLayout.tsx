'use client';

import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('email-generator');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', subtitle: 'Dashboard overview' },
    { id: 'email-generator', label: 'Email Generator', icon: '⭐', subtitle: 'AI-powered email creation', active: true },
    { id: 'quick-generate', label: 'Quick Generate', icon: '⚡', subtitle: 'Fast email generation' },
    { id: 'template-library', label: 'Template Library', icon: '📚', subtitle: 'BAB, PAS, 4Ps frameworks' },
    { id: 'analytics', label: 'Analytics', icon: '📈', subtitle: 'Usage & performance' },
    { id: 'settings', label: 'Settings', icon: '⚙️', subtitle: 'Account & preferences' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">⭐</span>
            </div>
            <div>
              <h1 className="font-bold text-white">Safelist AI Pro</h1>
              <p className="text-xs text-gray-400">Personal Edition</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                item.id === activeTab
                  ? 'bg-yellow-500 text-black font-medium'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.label}</div>
                <div className={`text-xs truncate ${
                  item.id === activeTab ? 'text-black/70' : 'text-gray-500'
                }`}>
                  {item.subtitle}
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Email Generator</h1>
              <p className="text-gray-400">Create high-converting safelist emails with AI</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white">
                🔔
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                👤
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
