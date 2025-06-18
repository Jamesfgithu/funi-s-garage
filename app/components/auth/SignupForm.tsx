'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signUpWithEmailPassword, sendVerification } from '@/lib/firebase/auth';
import { createUserProfileDocument } from '@/lib/firebase/firestore';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      console.log("SignupForm: Starting signup process for:", data.email);
      
      // Create user with Firebase Auth
      const user = await signUpWithEmailPassword(data.email, data.password);
      console.log("SignupForm: User created successfully:", user.uid);

      // Create user profile in Firestore
      await createUserProfileDocument(user, { name: data.name });
      console.log("SignupForm: User profile created in Firestore");

      // Send email verification
      await sendVerification(user);
      console.log("SignupForm: Verification email sent");


      // Redirect to verify-email page
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);

    } catch (error: any) {
      console.error("SignupForm: Error during signup:", error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error && typeof error === 'object' && 'code' in error) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "An account with this email already exists. Please try logging in instead.";
            setError('email', { message: errorMessage });
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak. Please choose a stronger password.";
            setError('password', { message: errorMessage });
            break;
          case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            setError('email', { message: errorMessage });
            break;
          case 'auth/operation-not-allowed':
            errorMessage = "Email/password accounts are not enabled. Please contact support.";
            break;
          default:
            errorMessage = `Signup failed: ${error.message || 'Unknown error'}`;
        }
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join Safelist AI Pro and revolutionize your marketing
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              {...register('name')}
              disabled={isLoading}
              autoComplete="name"
              className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={isLoading}
              autoComplete="email"
              className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              {...register('password')}
              disabled={isLoading}
              autoComplete="new-password"
              className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              disabled={isLoading}
              autoComplete="new-password"
              className="bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
