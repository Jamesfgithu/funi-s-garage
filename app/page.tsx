"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail as MailIconLucide, Zap, ArrowRight, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [currentYear, setCurrentYear] = useState<number | string>("...");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <MailIconLucide className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Safelist AI Pro</h1>
          </Link>
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Revolutionize Your Safelist Marketing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Safelist AI Pro empowers you with intelligent tools to organize links, craft high-converting emails, and save valuable time. Achieve peak efficiency and campaign effectiveness.
          </p>
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/signup">
              Start Your 30-Day Free Trial <Zap className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12">Core Features</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border bg-card hover:bg-accent/5 transition-colors duration-300">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <LinkIcon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Safelist Link Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Organize your safelist links, track mailing frequencies, and never miss an opportunity with our smart readiness indicators.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card hover:bg-accent/5 transition-colors duration-300">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <MailIconLucide className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>AI-Powered Email Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Craft compelling emails with our intuitive WYSIWYG editor and AI assistant. Generate headlines, body copy, and CTAs that convert.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card hover:bg-accent/5 transition-colors duration-300">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Intelligent Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Save time and boost your ROI with AI, template management, and streamlined workflows designed for marketers.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-muted/20 rounded-lg p-8 border border-border">
              <div className="text-center text-muted-foreground">
                <MailIconLucide className="h-24 w-24 mx-auto mb-4 text-primary/50" />
                <p className="text-lg">Dashboard Preview Coming Soon</p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6">Your Command Center for Success</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Our minimalist, modern interface is designed for clarity and ease of use. Focus on what matters most – growing your business.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" /> 
                  Intuitive navigation and workflow.
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" /> 
                  Mobile-responsive for marketing on the go.
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0" /> 
                  Powerful features, elegantly presented.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Safelist AI Pro by JNRF Marketing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
