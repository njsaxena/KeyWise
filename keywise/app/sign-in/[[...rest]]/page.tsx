'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect_url') ?? '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-16">
      <div className="w-full max-w-md">
        <SignIn
          routing="path"
          path="/sign-in"
          forceRedirectUrl={redirectUrl}
          appearance={{
            elements: {
              card: 'rounded-3xl border border-slate-800 bg-slate-900 shadow-xl',
            },
          }}
        />
      </div>
    </div>
  );
}
