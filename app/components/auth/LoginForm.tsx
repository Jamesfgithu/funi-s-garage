'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailVerifiedQueryParam = searchParams.get('emailVerified');
    const userEmailFromQuery = searchParams.get('email');

    if (emailVerifiedQueryParam === 'true') {
      toast({
        title: "Email Verified!",
        description: "Your email address has been successfully verified. Please log in.",
        duration: 7000,
      });
      if (userEmailFromQuery && !email) {
        setEmail(userEmailFromQuery);
      }

      // Check if user is already authenticated and verified, then redirect
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
          toast({
            title: "Authenticated & Verified",
            description: "Redirecting to your dashboard...",
            duration: 3000,
          });
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      });
      return () => unsubscribe();
    }
  }, [searchParams, router, toast, email]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("LoginForm: handleSubmit entered.");
    setError(null);
    
    if (isLoading) {
        console.warn("LoginForm: Already loading, submission attempt ignored.");
        return;
    }
    
    console.log("LoginForm: setIsLoading(true) - spinner should be visible.");
    setIsLoading(true);

    let userFriendlyMessage = "An unexpected error occurred. Please try again.";
    let consoleMessage = "Login error";
    let firebaseErrorCode = "UNKNOWN";

    try {
      console.log("LoginForm: Entering main try block.");
      if (!auth || !auth.app) {
        console.error("LoginForm: Firebase auth or auth.app is not initialized!");
        userFriendlyMessage = "Firebase is not configured correctly. Please contact support.";
        throw new Error("Firebase auth not initialized");
      }
      console.log("LoginForm: Firebase auth instance config being used:", JSON.stringify(auth.app.options, null, 2));
      console.log(`LoginForm: Attempting Firebase sign-in with email: ${email}`);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("LoginForm: Firebase sign-in call completed.");
      
      if (!user) {
        userFriendlyMessage = "Login failed: No user object returned from Firebase.";
        console.error("LoginForm: No user object returned from signInWithEmailAndPassword despite no error throw. This should not happen.");
        throw new Error(userFriendlyMessage);
      }
      console.log(`LoginForm: Firebase sign-in successful for user: ${user.uid}, email: ${user.email}`);

      if (!user.emailVerified) {
        userFriendlyMessage = "Please verify your email before logging in. Check your inbox or resend verification from the signup/verify page.";
        console.warn(`LoginForm: User email not verified for ${user.email}.`);
        setError(userFriendlyMessage);
        toast({
          title: "Email Not Verified",
          description: userFriendlyMessage,
          variant: "destructive",
        });
        // Redirect to verify-email page if email is not verified
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return; 
      } else {
        console.log(`LoginForm: User email ${user.email} is verified. Proceeding to dashboard.`);
        toast({
          title: "Login Successful!",
          description: "Welcome back! Redirecting to dashboard...",
        });
        router.push("/dashboard");
      }
      console.log("LoginForm: Exiting main try block (after success/email verification check).");
    } catch (e: any) {
      console.log("LoginForm: Entering main catch block.");
      console.error("LoginForm: Error during Firebase sign-in process:", e);

      if (e && typeof e === 'object' && 'code' in e && 'message' in e) {
        const firebaseError = e as { code: string; message: string };
        firebaseErrorCode = firebaseError.code;
        consoleMessage = `Firebase login error: ${firebaseErrorCode} - ${firebaseError.message}`;
        let specificErrorMessage = firebaseError.message.replace("Firebase: ", "").replace(/\(auth\/[^)]+\)\.?/, "").trim();
        if (specificErrorMessage.startsWith("Error ")) {
            specificErrorMessage = specificErrorMessage.substring(6);
        }
        
        switch (firebaseError.code) {
          case "auth/user-not-found":
          case "auth/invalid-credential": 
            userFriendlyMessage = "Invalid email or password. Please check your credentials and try again.";
            break;
          case "auth/user-disabled":
            userFriendlyMessage = "This account has been disabled. Please contact support.";
            break;
          case "auth/too-many-requests":
            userFriendlyMessage = "Access to this account has been temporarily disabled due to many failed login attempts. You can try again later or reset your password.";
            break;
          case "auth/network-request-failed":
            userFriendlyMessage = "A network connection error occurred. Please check your internet connection and try again. Unable to reach Firebase servers.";
            break;
          case "auth/operation-not-allowed":
             userFriendlyMessage = "Email/password sign-in is not enabled for this project. Please contact support.";
             break;
          default:
            userFriendlyMessage = `Login failed: ${specificErrorMessage || "An unknown error occurred. Please try again."}`;
        }
      } else if (e && typeof e === 'object' && 'message' in e) {
        userFriendlyMessage = `An error occurred: ${e.message}`;
        consoleMessage = `Login error (non-Firebase): ${e.message}`;
      } else {
        userFriendlyMessage = "An unknown error occurred during login. Please try again.";
        consoleMessage = `Unknown login error (type ${typeof e}): ${String(e)}`;
      }
      
      setError(userFriendlyMessage);
      console.error(consoleMessage, e instanceof Error ? e.stack : '(no stack trace)'); 

      toast({
        title: `Login Failed (${firebaseErrorCode})`,
        description: userFriendlyMessage,
        variant: "destructive",
      });
      console.log("LoginForm: Exiting main catch block.");
    } finally {
      console.log("LoginForm: Entering main finally block.");
      setIsLoading(false);
      console.log("LoginForm: setIsLoading(false) called in finally - spinner should be hidden.");
    }
    console.log("LoginForm: handleSubmit finished.");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
