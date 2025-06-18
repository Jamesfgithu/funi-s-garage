'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus, Loader2, Mail, Clock, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { SafelistLink } from '@/types/safelist';
import Link from 'next/link';

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
function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

// Calculate readiness status
function calculateReadiness(link: SafelistLink) {
  if (!link?.lastSubmitted) {
    return { status: 'ready', daysUntilReady: 0 };
  }
  const lastSubmittedTime = (link.lastSubmitted as any).toDate().getTime();
  const frequencyMs = link.frequency * 24 * 60 * 60 * 1000;
  const readyTime = lastSubmittedTime + frequencyMs;
  const now = Date.now();
  const timeLeft = readyTime - now;

  if (timeLeft <= 0) {
    return { status: 'ready', daysUntilReady: 0 };
  }
  const oneHour = 60 * 60 * 1000;
  if (timeLeft < oneHour) {
    return { status: 'soon', daysUntilReady: timeLeft };
  }
  return { status: 'waiting', daysUntilReady: timeLeft };
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
  const [user, loading] = useAuthState(auth);
  const [links, setLinks] = useState<SafelistLink[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    readyNow: 0,
    readySoon: 0,
    waiting: 0,
    totalLinks: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  // Real-time data fetching with onSnapshot
  useEffect(() => {
    if (!user) {
      setActivityLoading(false);
      return;
    }

    setActivityLoading(true);
    
    const safelistLinksRef = collection(db, `users/${user.uid}/safelistLinks`);
    const q = query(safelistLinksRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const linksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SafelistLink[];
        
        setLinks(linksData);

        // Calculate stats from real-time data
        let readyNow = 0;
        let readySoon = 0;
        let waiting = 0;

        linksData.forEach((link) => {
          const { status } = calculateReadiness(link);
          switch (status) {
            case 'ready':
              readyNow++;
              break;
            case 'soon':
              readySoon++;
              break;
            case 'waiting':
              waiting++;
              break;
          }
        });

        const newStats = {
          readyNow,
          readySoon,
          waiting,
          totalLinks: linksData.length
        };

        setStats(newStats);

        // Generate activity items from real-time data
        const activities: ActivityItem[] = [];
        
        linksData.forEach((link: any) => {
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

          // Add ready status activities
          const { status } = calculateReadiness(link);
          if (status === 'ready') {
            activities.push({
              id: `${link.id}-ready`,
              type: 'ready',
              linkName: link.name,
              timestamp: new Date(Date.now() - Math.random() * 3600000), // Random within last hour
              details: `Ready for mailing`
            });
          }
        });

        // Sort activities by timestamp (newest first)
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActivities(activities.slice(0, 5)); // Show only latest 5

        setActivityLoading(false);
        setShowAnimation(true);
      },
      (error) => {
        console.error("Error fetching safelist links:", error);
        setActivityLoading(false);
      }
    );

    return () => unsubscribe();
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

  if (loading || activityLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Please log in to access your dashboard.</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">{getSmartMessage()}</p>
        </div>
        <Shield className="h-8 w-8 text-primary" />
      </div>

      {stats.totalLinks === 0 ? (
        /* Welcome State */
        <Card className="relative overflow-hidden border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300">
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
      ) : (
        /* Dashboard Content */
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border border-blue-200 hover:border-blue-300 transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  Total Links
                </CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-500">
                  {showAnimation ? <AnimatedCounter value={stats.totalLinks} /> : stats.totalLinks}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total safelist links
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-green-200 hover:border-green-300 transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  Ready Now
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-green-500">
                  {showAnimation ? <AnimatedCounter value={stats.readyNow} /> : stats.readyNow}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready for mailing
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-amber-200 hover:border-amber-300 transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-700">
                  Ready Soon
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-amber-500">
                  {showAnimation ? <AnimatedCounter value={stats.readySoon} /> : stats.readySoon}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Within the hour
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-red-200 hover:border-red-300 transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">
                  Waiting
                </CardTitle>
                <Clock className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-red-500">
                  {showAnimation ? <AnimatedCounter value={stats.waiting} /> : stats.waiting}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Not ready yet
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
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
                
                {/* Manage Links Button */}
                <Link 
                  href="/dashboard/safelist-management"
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                >
                  <div>
                    <h3 className="font-medium">Manage Links</h3>
                    <p className="text-sm text-muted-foreground">Add, edit, or delete safelist links</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
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
                      {stats.readyNow > 0 ? `${stats.readyNow} links ready` : 'No links ready'}
                    </p>
                  </div>
                  <Mail className={`h-5 w-5 ${stats.readyNow > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Summary */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent" />
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
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
