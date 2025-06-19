'use client';

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  List,
} from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { SafelistLink } from '@/types/safelist';
import {
  getUserSafelistLinks,
  calculateReadiness,
} from '@/lib/firebase/safelist';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user] = useAuthState(auth);
  const [safelistsExpanded, setSafelistsExpanded] = useState(false);
  const [safelists, setSafelists] = useState<SafelistLink[]>([]);
  const [loadingSafelists, setLoadingSafelists] = useState(true);

  useEffect(() => {
    async function fetchSafelists() {
      if (user) {
        setLoadingSafelists(true);
        try {
          const userLinks = await getUserSafelistLinks(user.uid);
          // Sort alphabetically by name
          const sortedLinks = userLinks.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setSafelists(sortedLinks);
        } catch (error) {
          console.error('Error fetching safelists:', error);
        } finally {
          setLoadingSafelists(false);
        }
      }
    }

    fetchSafelists();
  }, [user]);

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      subtitle: 'Dashboard overview',
    },
    {
      id: 'email-generator',
      label: 'Email Generator',
      icon: '⭐',
      subtitle: 'AI-powered email creation',
    },
    {
      id: 'safelist-manager',
      label: 'Safelist Manager',
      icon: '🛡️',
      subtitle: 'Streamline Your Links',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      subtitle: 'Account & preferences',
    },
  ];

  // Get current tab info for dynamic header
  const currentTab =
    sidebarItems.find((item) => item.id === activeTab) || sidebarItems[0];

  const getStatusIndicator = (link: SafelistLink) => {
    const { status } = calculateReadiness(
      link.lastSubmitted ?? null,
      link.frequency
    );

    switch (status) {
      case 'ready':
        return (
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-sm" />
        );
      case 'soon':
        return <div className="h-2 w-2 rounded-full bg-amber-400 shadow-sm" />;
      case 'waiting':
        return <div className="h-2 w-2 rounded-full bg-red-400 shadow-sm" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500 shadow-sm" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Enhanced Professional Sidebar */}
      <div className="from-card to-card/95 w-72 border-r border-gray-700/50 bg-gradient-to-br shadow-2xl backdrop-blur-sm">
        {/* Enhanced Logo Section */}
        <div className="from-primary/5 border-b border-gray-700/50 bg-gradient-to-br to-transparent p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg transition-shadow duration-200 hover:shadow-xl">
              <span className="text-lg font-bold text-black">⭐</span>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-lg font-bold text-transparent text-white">
                Safelist AI Pro
              </h1>
              <p className="text-xs text-gray-400">Version 3</p>
            </div>
          </div>
        </div>

        {/* Enhanced Professional Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {sidebarItems.map((item) => (
            <a
              key={item.id}
              href={
                item.id === 'dashboard'
                  ? '/dashboard'
                  : item.id === 'safelist-manager'
                    ? '/dashboard/safelist-management'
                    : '#'
              }
              onClick={() => setActiveTab(item.id)}
              className={`group block flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left shadow-sm transition-all duration-200 hover:shadow-lg ${
                item.id === activeTab
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-400 font-medium text-black shadow-lg hover:scale-[1.02] hover:shadow-xl'
                  : 'from-card/50 to-card/30 hover:from-primary/10 hover:to-primary/5 hover:border-primary/20 border border-transparent bg-gradient-to-br text-gray-300 backdrop-blur-sm hover:bg-gradient-to-br hover:text-white hover:shadow-md'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{item.label}</div>
                <div
                  className={`truncate text-xs ${
                    item.id === activeTab
                      ? 'text-black/70'
                      : 'text-gray-500 group-hover:text-gray-400'
                  }`}
                >
                  {item.subtitle}
                </div>
              </div>
            </a>
          ))}

          {/* Enhanced My Safelists Dropdown */}
          {user && (
            <div className="mt-6">
              <button
                onClick={() => setSafelistsExpanded(!safelistsExpanded)}
                className="group from-card/50 to-card/30 hover:from-primary/10 hover:to-primary/5 hover:border-primary/20 flex w-full items-center space-x-3 rounded-lg border border-transparent bg-gradient-to-br px-4 py-3 text-gray-300 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-gradient-to-br hover:text-white hover:shadow-lg hover:shadow-md"
              >
                {safelistsExpanded ? (
                  <ChevronDown className="h-4 w-4 transition-colors duration-200 group-hover:text-white" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-colors duration-200 group-hover:text-white" />
                )}
                <List className="h-4 w-4 text-blue-400 transition-colors duration-200 group-hover:text-blue-300" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">My Safelists</div>
                  <div className="truncate text-xs text-gray-500 group-hover:text-gray-400">
                    Quick access to your links
                  </div>
                </div>
                {loadingSafelists && (
                  <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                )}
              </button>

              {/* Enhanced Safelists Dropdown Content */}
              {safelistsExpanded && (
                <div className="from-primary/5 mt-2 ml-4 space-y-1 rounded-r-lg border-l border-gray-600/50 bg-gradient-to-br to-transparent pl-4">
                  {loadingSafelists ? (
                    <div className="bg-card/30 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-400 backdrop-blur-sm">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading safelists...
                    </div>
                  ) : safelists.length === 0 ? (
                    <div className="bg-card/30 rounded-md px-3 py-2 text-sm text-gray-400 backdrop-blur-sm">
                      No safelists added yet
                    </div>
                  ) : (
                    safelists.map((safelist) => (
                      <a
                        key={safelist.id}
                        href={safelist.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hover:from-primary/10 hover:to-primary/5 hover:border-primary/20 flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm backdrop-blur-sm transition-all duration-200 hover:bg-gradient-to-br hover:shadow-md"
                      >
                        {getStatusIndicator(safelist)}
                        <span className="flex-1 truncate font-medium text-gray-300 group-hover:text-white">
                          {safelist.name}
                        </span>
                        <ExternalLink className="h-3 w-3 text-gray-500 opacity-0 transition-all duration-200 group-hover:text-gray-300 group-hover:opacity-100" />
                      </a>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Enhanced Professional Footer */}
        <div className="from-primary/5 border-t border-gray-700/50 bg-gradient-to-br to-transparent p-4">
          <div className="text-center text-xs text-gray-400">
            {user ? (
              <div className="bg-card/30 space-y-1 rounded-lg p-3 backdrop-blur-sm">
                <p className="truncate font-medium text-gray-200">
                  {user.email}
                </p>
                <p className="flex items-center justify-center gap-1 text-green-400">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></div>
                  Connected
                </p>
              </div>
            ) : (
              <p className="bg-card/30 flex items-center justify-center gap-1 rounded-lg p-3 text-red-400 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                Not authenticated
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Enhanced Professional Header */}
        <header className="from-card to-card/95 border-b border-gray-700/50 bg-gradient-to-br px-6 py-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-2xl font-bold text-transparent">
                {currentTab.label}
              </h1>
              <p className="text-gray-400">{currentTab.subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:bg-primary/10 rounded-lg p-2 text-gray-400 transition-colors hover:text-white">
                🔔
              </button>
              <button className="hover:bg-primary/10 rounded-lg p-2 text-gray-400 transition-colors hover:text-white">
                👤
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
