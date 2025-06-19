'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SafelistLink } from '@/types/safelist';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Mail,
  Zap,
  BookOpen,
  Settings,
  Home,
  List,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import {
  getUserSafelistLinks,
  calculateReadiness,
} from '@/lib/firebase/safelist';
import Image from 'next/image';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Dashboard overview',
  },
  {
    name: 'Email Generator',
    href: '/dashboard/email-generator',
    icon: Zap,
    description: 'AI-powered email creation',
  },
  {
    name: 'Safelist Manager',
    href: '/dashboard/safelist-management',
    icon: List,
    description: 'Streamline Your Links',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account & preferences',
  },
];

export function Sidebar() {
  const pathname = usePathname();
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
          const sortedLinks = userLinks.sort(
            (a: SafelistLink, b: SafelistLink) => a.name.localeCompare(b.name)
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
    <div className="from-card to-card/95 border-border/50 flex w-72 flex-col border-r bg-gradient-to-br shadow-2xl backdrop-blur-sm">
      {/* Enhanced Logo Section with Professional Styling */}
      <div className="border-border/50 from-primary/5 border-b bg-gradient-to-br to-transparent p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 shadow-lg backdrop-blur-sm transition-shadow duration-200 hover:shadow-xl">
            <Image
              src="/logo.ico"
              alt="Safelist AI Pro Logo"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-lg font-bold text-transparent">
              Safelist AI Pro
            </h1>
            <p className="text-muted-foreground text-xs">Version 3</p>
          </div>
        </div>
      </div>

      {/* Enhanced Professional Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center space-x-3 rounded-lg px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:shadow-lg',
                isActive
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-400 font-medium text-black shadow-lg hover:scale-[1.02] hover:shadow-xl'
                  : 'text-muted-foreground from-card/50 to-card/30 hover:from-primary/10 hover:to-primary/5 hover:border-primary/20 border border-transparent bg-gradient-to-br backdrop-blur-sm hover:bg-gradient-to-br hover:text-white hover:shadow-md'
              )}
            >
              <item.icon className="h-5 w-5" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div
                  className={cn(
                    'text-xs transition-colors',
                    isActive
                      ? 'text-black/70'
                      : 'text-muted-foreground/70 group-hover:text-gray-400'
                  )}
                >
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Enhanced My Safelists Dropdown with Professional List Icon */}
        {user && (
          <div className="mt-6">
            <button
              onClick={() => setSafelistsExpanded(!safelistsExpanded)}
              className="group text-muted-foreground from-card/50 to-card/30 hover:from-primary/10 hover:to-primary/5 hover:border-primary/20 flex w-full items-center space-x-3 rounded-lg border border-transparent bg-gradient-to-br px-4 py-3 text-sm shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-gradient-to-br hover:text-white hover:shadow-lg hover:shadow-md"
            >
              {safelistsExpanded ? (
                <ChevronDown className="h-4 w-4 transition-colors duration-200 group-hover:text-white" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-colors duration-200 group-hover:text-white" />
              )}
              <List className="h-5 w-5 text-blue-400 transition-colors duration-200 group-hover:text-blue-300" />
              <div className="flex-1">
                <div className="font-medium">My Safelists</div>
                <div className="text-muted-foreground/70 text-xs group-hover:text-gray-400">
                  Quick access to your links
                </div>
              </div>
              {loadingSafelists && (
                <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
              )}
            </button>

            {/* Enhanced Safelists Dropdown Content */}
            {safelistsExpanded && (
              <div className="border-border/50 from-primary/5 mt-2 ml-4 space-y-1 rounded-r-lg border-l bg-gradient-to-br to-transparent pl-4">
                {loadingSafelists ? (
                  <div className="text-muted-foreground bg-card/30 flex items-center gap-2 rounded-md px-3 py-2 text-sm backdrop-blur-sm">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading safelists...
                  </div>
                ) : safelists.length === 0 ? (
                  <div className="text-muted-foreground bg-card/30 rounded-md px-3 py-2 text-sm backdrop-blur-sm">
                    No safelists added yet
                  </div>
                ) : (
                  safelists.map((safelist) => (
                    <a
                      key={safelist.id || 'unknown'}
                      href={safelist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group hover:from-primary/10 hover:to-primary/5 hover:border-primary/20 flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm backdrop-blur-sm transition-all duration-200 hover:bg-gradient-to-br hover:shadow-md"
                    >
                      {getStatusIndicator(safelist)}
                      <span className="text-muted-foreground flex-1 truncate font-medium group-hover:text-white">
                        {safelist.name}
                      </span>
                      <ExternalLink className="text-muted-foreground/50 h-3 w-3 opacity-0 transition-all duration-200 group-hover:text-gray-300 group-hover:opacity-100" />
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Enhanced Professional AI Credits Footer */}
      <div className="border-border/50 from-primary/5 border-t bg-gradient-to-br to-transparent p-4">
        <div className="text-muted-foreground text-xs">
          <div className="text-foreground bg-card/30 rounded-lg p-3 font-medium backdrop-blur-sm">
            <div className="mb-2 text-sm font-semibold">AI Credits</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Used today:</span>
                <span className="text-accent bg-accent/10 rounded-md px-2 py-1 font-medium">
                  12/50
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monthly limit:</span>
                <span className="text-primary bg-primary/10 rounded-md px-2 py-1 font-medium">
                  150/500
                </span>
              </div>
            </div>
          </div>
          {user && (
            <div className="bg-card/30 mt-3 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-sm" />
                <span className="text-xs font-medium text-green-400">
                  Connected
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
