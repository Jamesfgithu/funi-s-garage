'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="bg-card border-border w-full max-w-md rounded-lg border p-8 text-center">
        <div className="mb-6">
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-primary h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to{' '}
            <span className="text-foreground font-medium">
              {email || 'your email address'}
            </span>
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex items-start gap-3 text-left">
            <svg
              className="text-primary mt-0.5 h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="font-medium">Click the verification link</p>
              <p className="text-muted-foreground text-sm">
                Check your inbox and click the verification link we sent you
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <svg
              className="text-primary mt-0.5 h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="font-medium">Return to login</p>
              <p className="text-muted-foreground text-sm">
                After verification, you&apos;ll be redirected back to login
                automatically
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-colors"
          >
            Continue to Login
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Didn&apos;t receive the email?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Try signing up again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center p-4">
          <div className="bg-card border-border w-full max-w-md rounded-lg border p-8 text-center">
            <div className="animate-pulse">
              <div className="bg-muted mx-auto mb-4 h-16 w-16 rounded-full"></div>
              <div className="bg-muted mb-4 h-8 rounded"></div>
              <div className="bg-muted mb-6 h-4 rounded"></div>
              <div className="space-y-4">
                <div className="bg-muted h-10 rounded"></div>
                <div className="bg-muted h-10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
