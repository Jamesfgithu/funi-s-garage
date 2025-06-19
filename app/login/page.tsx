import { LoginForm } from '@/components/auth/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="bg-card border-border mx-auto w-full max-w-md rounded-lg border p-6">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="bg-muted mb-4 h-8 rounded"></div>
                  <div className="bg-muted mb-6 h-4 rounded"></div>
                  <div className="space-y-4">
                    <div className="bg-muted h-10 rounded"></div>
                    <div className="bg-muted h-10 rounded"></div>
                    <div className="bg-muted h-10 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
