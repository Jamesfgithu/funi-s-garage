import { SignupForm } from '@/components/auth/SignupForm';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <SignupForm />
        
        {/* More Prominent Login Option */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Already have an account?</p>
          <Button variant="outline" size="lg" asChild className="w-full">
            <Link href="/login">
              <span className="font-semibold">Log In to Your Account</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
