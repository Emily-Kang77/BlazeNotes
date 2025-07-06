import { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

/**
 * This SHOULD use Firebase Auth.
 */

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Notes App</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your notes
          </p>
        </div>

        <AuthForm mode={mode} onSuccess={onAuthSuccess} />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button
            variant="link"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm"
          >
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </Button>
        </div>
      </div>
    </div>
  );
} 