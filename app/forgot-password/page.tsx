'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastEmailSent, setLastEmailSent] = useState(0);
  const EMAIL_COOLDOWN = 30000; // 30 seconds
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const now = Date.now();
    if (now - lastEmailSent < EMAIL_COOLDOWN) {
      setError("Please wait 30 seconds before requesting another email.");
      setIsLoading(false);
      return;
    }
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setLastEmailSent(Date.now());
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        switch (errorCode) {
          case 'auth/invalid-email':
            setError('The email address is not valid.');
            break;
          case 'auth/user-not-found':
            setError('No user found with this email address.');
            break;
          case 'auth/too-many-requests':
            setError('Too many requests. Please try again later.');
            break;
          default:
            setError('Password reset failed. Please try again.');
            break;
        }
      } else {
        setError('Password reset failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <p className="text-center text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 py-6">
          {message && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Email'
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
