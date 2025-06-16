'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Mail, 
  Zap, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Sparkles,
  Home
} from 'lucide-react'

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
    name: 'Quick Generate',
    href: '/dashboard/quick',
    icon: Mail,
    description: 'Fast email generation'
  },
  {
    name: 'Template Library',
    href: '/dashboard/templates',
    icon: BookOpen,
    description: 'BAB, PAS, 4Ps frameworks'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Usage & performance'
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

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Safelist AI Pro</h1>
            <p className="text-xs text-muted-foreground">Personal Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="w-5 h-5" />
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-70">{item.description}</div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* AI Credits Footer (Functional for Beta) */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="font-medium">AI Credits</div>
          <div className="mt-1">
            <div className="flex justify-between">
              <span>Used today:</span>
              <span className="text-accent">12/50</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Monthly limit:</span>
              <span className="text-primary">150/500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// Add this link in your navigation
<Link 
  href="/dashboard/email-generator"
  className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
>
  <Zap className="h-5 w-5" />
  Email Generator
</Link>
