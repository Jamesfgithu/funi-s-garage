'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, CheckCircle, ArrowRight, Loader2, TrendingUp, Mail, Link as LinkIcon, Plus, Zap, AlertCircle, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { getDashboardStats, getUserSafelistLinks } from '@/lib/firebase/safelist';

interface DashboardStats {
  readyNow: number;
  readySoon: number;
  waiting: number;
  totalLinks: number;
}

interface ActivityItem {
  id: string;
  type: 'added' | 'updated' | 'ready' | 'submitted';
  linkName: string;
  timestamp: Date;
  details?: string;
}

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

// Format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default function DashboardPage() {
  const [user, loading, error] = useAuthState(auth);
  const [stats, setStats] = useState<DashboardStats>({
    readyNow: 0,
    readySoon: 0,
    waiting: 0,
    totalLinks: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (user) {
        setStatsLoading(true);
        const dashboardStats = await getDashboardStats(user.uid);
        setStats(dashboardStats);
        setStatsLoading(false);
        // Trigger animation after data loads
        setTimeout(() => setShowAnimation(true), 100);
      }
    }

    fetchStats();
  }, [user]);

  useEffect(() => {
    async function fetchActivity() {
      if (user) {
        setActivityLoading(true);
        try {
          const links = await getUserSafelistLinks(user.uid);
          
          // Generate activity items from links data
          const activities: ActivityItem[] = [];
          
          links.forEach((link: any) => {
            // Add creation activity
            if (link.createdAt) {
              activities.push({
                id: `${link.id}-created`,
                type: 'added',
                linkName: link.name,
                timestamp: link.createdAt instanceof Date ? link.createdAt : (link.createdAt?.toDate ? link.createdAt.toDate() : new Date(link.createdAt?.seconds ? link.createdAt.seconds * 1000 : link.createdAt)),
                details: `Added to safelist management`
              });
            }
            
            // Add update activity if updated
            if (link.updatedAt && link.updatedAt !== link.createdAt) {
              activities.push({
                id: `${link.id}-updated`,
                type: 'updated',
                linkName: link.name,
                timestamp: link.updatedAt.toDate(),
                details: `Link details updated`
              });
            }
            
            // Add ready status activity
            if (link.isReady) {
              activities.push({
                id: `${link.id}-ready`,
                type: 'ready',
                linkName: link.name,
                timestamp: new Date(Date.now() - Math.random() * 3600000), // Random within last hour
                details: `Ready for mailing`
              });
            }
          });
          
          // Sort by timestamp (newest first) and take last 5
          const sortedActivities = activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5);
            
          setRecentActivity(sortedActivities);
        } catch (error) {
          console.error('Error fetching activity:', error);
        } finally {
          setActivityLoading(false);
        }
      }
    }

    fetchActivity();
  }, [user]);

  // Smart messaging based on user status
  const getSmartMessage = () => {
    if (stats.readyNow > 0) {
      return `🚀 ${stats.readyNow} link${stats.readyNow > 1 ? 's' : ''} ready to mail now!`;
    }
    if (stats.readySoon > 0) {
      return `⏰ ${stats.readySoon} link${stats.readySoon > 1 ? 's' : ''} ready within the hour`;
    }
    if (stats.totalLinks > 0) {
      return `📊 Managing ${stats.totalLinks} safelist link${stats.totalLinks > 1 ? 's' : ''}`;
    }
    return "🎯 Ready to start your safelist journey";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="h-3 w-3 text-blue-500" />;
      case 'updated': return <Activity className="h-3 w-3 text-amber-500" />;
      case 'ready': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'submitted': return <Mail className="h-3 w-3 text-purple-500" />;
      default: return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'added': return 'border-blue-500/20 bg-blue-500/5';
      case 'updated': return 'border-amber-500/20 bg-amber-500/5';
      case 'ready': return 'border-green-500/20 bg-green-500/5';
      case 'submitted': return 'border-purple-500/20 bg-purple-500/5';
      default: return 'border-muted bg-muted/20';
    }
  };

  // Show loading state while authenticating
  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to view your safelist dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with Smart Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Your safelist management overview
          </p>
          {!statsLoading && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                <Zap className="h-4 w-4" />
                {getSmartMessage()}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Enhanced Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Managed Links Card */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">Managed Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="relative">
            {statsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-blue-500">
                  {showAnimation ? <AnimatedCounter value={stats.totalLinks} /> : stats.totalLinks}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total safelist links
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ready to Mail Card - With Enhanced Pulsing */}
        <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm ${
          stats.readyNow > 0 ? 'ring-2 ring-green-500/20 animate-pulse' : ''
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ready to Mail</CardTitle>
            <CheckCircle className={`h-4 w-4 text-green-500 ${stats.readyNow > 0 ? 'animate-pulse' : ''}`} />
          </CardHeader>
          <CardContent className="relative">
            {statsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className={`text-3xl font-bold text-green-500 ${stats.readyNow > 0 ? 'animate-pulse' : ''}`}>
                  {showAnimation ? <AnimatedCounter value={stats.readyNow} /> : stats.readyNow}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Links ready now
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ready Soon Card */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ready Soon</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="relative">
            {statsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-amber-500">
                  {showAnimation ? <AnimatedCounter value={stats.readySoon} /> : stats.readySoon}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready in &lt;1 hour
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Smart Quick Actions */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            {stats.readyNow > 0 
              ? `${stats.readyNow} link${stats.readyNow > 1 ? 's' : ''} ready for mailing - take action now!`
              : "Manage your safelist links and compose emails"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Enhanced Manage Links Button */}
            <Link 
              href="/dashboard/safelist-management"
              className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 group ${
                stats.totalLinks > 0 
                  ? 'border-primary/20 hover:border-primary hover:bg-primary/5' 
                  : 'border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/5'
              }`}
            >
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {stats.totalLinks > 0 
                    ? `Manage ${stats.totalLinks} Link${stats.totalLinks > 1 ? 's' : ''}`
                    : 'Add Your First Link'
                  }
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stats.readyNow > 0 
                    ? `${stats.readyNow} ready to mail now`
                    : 'Streamline Your Links'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {stats.readyNow > 0 && (
                  <div className="flex items-center gap-1 text-green-500 text-xs font-medium animate-pulse">
                    <AlertCircle className="h-3 w-3" />
                    {stats.readyNow}
                  </div>
                )}
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            {/* Smart Compose Email Button */}
            <div className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
              stats.readyNow > 0 
                ? 'border-green-500/30 hover:border-green-500 hover:bg-green-500/5 cursor-pointer'
                : 'border-muted opacity-60 cursor-not-allowed'
            }`}>
              <div>
                <h3 className={`font-medium ${stats.readyNow > 0 ? 'text-green-500' : ''}`}>
                  Compose Email
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stats.readyNow > 0 
                    ? `${stats.readyNow} link${stats.readyNow > 1 ? 's' : ''} ready to mail`
                    : 'Coming Soon'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {stats.readyNow > 0 && (
                  <div className="flex items-center gap-1 text-green-500 text-xs font-medium animate-pulse">
                    <Zap className="h-3 w-3" />
                    Ready
                  </div>
                )}
                <Mail className={`h-4 w-4 ${stats.readyNow > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEW: Live Activity Feed */}
      {!activityLoading && recentActivity.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your safelist management
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getActivityColor(activity.type)}`}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.linkName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.details}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stats Summary */}
      {!statsLoading && stats.totalLinks > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent" />
          <CardHeader className="relative">
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-sm text-muted-foreground">
              You're managing <span className="font-medium text-foreground text-lg">{stats.totalLinks}</span> safelist links
              {stats.readyNow > 0 && (
                <span className="ml-2 text-green-500 font-medium animate-pulse">
                  • {stats.readyNow} ready to mail now!
                </span>
              )}
              {stats.readySoon > 0 && (
                <span className="ml-2 text-amber-500 font-medium">
                  • {stats.readySoon} ready within the hour
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Empty State */}
      {!statsLoading && stats.totalLinks === 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <CardHeader className="relative text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Welcome to Safelist AI Pro V3</CardTitle>
            <CardDescription className="text-base mt-2">
              Add your first safelist link to begin tracking mailing frequency and unlock the power of automated safelist management
            </CardDescription>
          </CardHeader>
          <CardContent className="relative text-center">
            <Link 
              href="/dashboard/safelist-management"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Link
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
