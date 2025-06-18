'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SafelistLink } from "@/types/safelist";
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
  Loader2
} from 'lucide-react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase/config'
import { getUserSafelistLinks, calculateReadiness } from '@/lib/firebase/safelist'
import Image from 'next/image'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Dashboard overview'
  },
  {
    name: 'Email Generator',
    href: '/dashboard/email-generator',
    icon: Zap,
    description: 'AI-powered email creation'
  },
  {
    name: 'Safelist Manager',
    href: '/dashboard/safelist-management',
    icon: List,
    description: 'Streamline Your Links'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account & preferences'
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [user] = useAuthState(auth)
  const [safelistsExpanded, setSafelistsExpanded] = useState(false)
  const [safelists, setSafelists] = useState<SafelistLink[]>([])
  const [loadingSafelists, setLoadingSafelists] = useState(true)

  useEffect(() => {
    async function fetchSafelists() {
      if (user) {
        setLoadingSafelists(true)
        try {
          const userLinks = await getUserSafelistLinks(user.uid)
          // Sort alphabetically by name
          const sortedLinks = userLinks.sort((a: SafelistLink, b: SafelistLink) => a.name.localeCompare(b.name))
          setSafelists(sortedLinks)
        } catch (error) {
          console.error('Error fetching safelists:', error)
        } finally {
          setLoadingSafelists(false)
        }
      }
    }

    fetchSafelists()
  }, [user])

  const getStatusIndicator = (link: SafelistLink) => {
    const { status } = calculateReadiness(link.lastSubmitted ?? null, link.frequency)
    
    switch (status) {
      case 'ready':
        return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm" />
      case 'soon':
        return <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm" />
      case 'waiting':
        return <div className="w-2 h-2 bg-red-400 rounded-full shadow-sm" />
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full shadow-sm" />
    }
  }

  return (
    <div className="w-72 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm border-r border-border/50 flex flex-col shadow-2xl">
      {/* Enhanced Logo Section with Professional Styling */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 backdrop-blur-sm">
            <Image
              src="/logo.ico"
              alt="Safelist AI Pro Logo"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Safelist AI Pro
            </h1>
            <p className="text-xs text-muted-foreground">Version 3</p>
          </div>
        </div>
      </div>

      {/* Enhanced Professional Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group shadow-sm hover:shadow-lg',
                isActive
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-400 text-black font-medium shadow-lg hover:shadow-xl hover:scale-[1.02]'
                  : 'text-muted-foreground bg-gradient-to-br from-card/50 to-card/30 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 hover:text-white hover:shadow-md hover:border-primary/20 border border-transparent backdrop-blur-sm'
              )}
            >
              <item.icon className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className={cn(
                  "text-xs transition-colors",
                  isActive ? "text-black/70" : "text-muted-foreground/70 group-hover:text-gray-400"
                )}>
                  {item.description}
                </div>
              </div>
            </Link>
          )
        })}

        {/* Enhanced My Safelists Dropdown with Professional List Icon */}
        {user && (
          <div className="mt-6">
            <button
              onClick={() => setSafelistsExpanded(!safelistsExpanded)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group text-muted-foreground bg-gradient-to-br from-card/50 to-card/30 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 hover:text-white hover:shadow-md hover:border-primary/20 border border-transparent backdrop-blur-sm shadow-sm hover:shadow-lg"
            >
              {safelistsExpanded ? (
                <ChevronDown className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
              ) : (
                <ChevronRight className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
              )}
              <List className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
              <div className="flex-1">
                <div className="font-medium">My Safelists</div>
                <div className="text-xs text-muted-foreground/70 group-hover:text-gray-400">
                  Quick access to your links
                </div>
              </div>
              {loadingSafelists && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
            </button>

            {/* Enhanced Safelists Dropdown Content */}
            {safelistsExpanded && (
              <div className="mt-2 ml-4 space-y-1 border-l border-border/50 pl-4 bg-gradient-to-br from-primary/5 to-transparent rounded-r-lg">
                {loadingSafelists ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-card/30 rounded-md backdrop-blur-sm">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Loading safelists...
                  </div>
                ) : safelists.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground bg-card/30 rounded-md backdrop-blur-sm">
                    No safelists added yet
                  </div>
                ) : (
                  safelists.map((safelist) => (
                    <a
                      key={safelist.id || 'unknown'}
                      href={safelist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 text-sm hover:shadow-md backdrop-blur-sm border border-transparent hover:border-primary/20"
                    >
                      {getStatusIndicator(safelist)}
                      <span className="flex-1 text-muted-foreground group-hover:text-white truncate font-medium">
                        {safelist.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground/50 group-hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Enhanced Professional AI Credits Footer */}
      <div className="p-4 border-t border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="text-xs text-muted-foreground">
          <div className="font-medium text-foreground bg-card/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-sm font-semibold mb-2">AI Credits</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Used today:</span>
                <span className="text-accent font-medium bg-accent/10 px-2 py-1 rounded-md">12/50</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Monthly limit:</span>
                <span className="text-primary font-medium bg-primary/10 px-2 py-1 rounded-md">150/500</span>
              </div>
            </div>
          </div>
          {user && (
            <div className="mt-3 bg-card/30 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm" />
                <span className="text-xs text-green-400 font-medium">Connected</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar;
