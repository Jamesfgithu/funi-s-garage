'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Mail as MailIconLucide,
  Zap,
  ArrowRight,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [currentYear, setCurrentYear] = useState<number | string>('...');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-border bg-card/50 supports-[backdrop-filter]:bg-card/50 border-b backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <MailIconLucide className="text-primary h-8 w-8" />
            <h1 className="text-primary text-2xl font-bold">Safelist AI Pro</h1>
          </Link>
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <h2 className="from-primary to-primary/60 mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent">
            Revolutionize Your Safelist Marketing
          </h2>
          <p className="text-muted-foreground mx-auto mb-10 max-w-3xl text-xl">
            Safelist AI Pro empowers you with intelligent tools to organize
            links, craft high-converting emails, and save valuable time. Achieve
            peak efficiency and campaign effectiveness.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/signup">
              Start Your 30-Day Free Trial <Zap className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="mb-12 text-center text-3xl font-bold">
              Core Features
            </h3>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-border bg-card hover:bg-accent/5 transition-colors duration-300">
                <CardHeader>
                  <div className="bg-primary/10 mb-4 w-fit rounded-full p-3">
                    <LinkIcon className="text-primary h-8 w-8" />
                  </div>
                  <CardTitle>Safelist Link Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Organize your safelist links, track mailing frequencies, and
                    never miss an opportunity with our smart readiness
                    indicators.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:bg-accent/5 transition-colors duration-300">
                <CardHeader>
                  <div className="bg-primary/10 mb-4 w-fit rounded-full p-3">
                    <MailIconLucide className="text-primary h-8 w-8" />
                  </div>
                  <CardTitle>AI-Powered Email Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Craft compelling emails with our intuitive WYSIWYG editor
                    and AI assistant. Generate headlines, body copy, and CTAs
                    that convert.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:bg-accent/5 transition-colors duration-300">
                <CardHeader>
                  <div className="bg-primary/10 mb-4 w-fit rounded-full p-3">
                    <Zap className="text-primary h-8 w-8" />
                  </div>
                  <CardTitle>Intelligent Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Save time and boost your ROI with features like AI-retry,
                    template management, and streamlined workflows designed for
                    marketers.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="bg-muted/20 border-border rounded-lg border p-8">
              <div className="text-muted-foreground text-center">
                <MailIconLucide className="text-primary/50 mx-auto mb-4 h-24 w-24" />
                <p className="text-lg">Dashboard Preview Coming Soon</p>
              </div>
            </div>
            <div>
              <h3 className="mb-6 text-3xl font-bold">
                Your Command Center for Success
              </h3>
              <p className="text-muted-foreground mb-4 text-lg">
                Our minimalist, modern interface is designed for clarity and
                ease of use. Focus on what matters most – growing your business.
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-5 w-5 shrink-0" />
                  Intuitive navigation and workflow.
                </li>
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-5 w-5 shrink-0" />
                  Mobile-responsive for marketing on the go.
                </li>
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-5 w-5 shrink-0" />
                  Powerful features, elegantly presented.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-border bg-card/50 border-t">
        <div className="text-muted-foreground container mx-auto px-4 py-8 text-center sm:px-6 lg:px-8">
          <p>
            &copy; {currentYear} Safelist AI Pro by JNRF Marketing. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
