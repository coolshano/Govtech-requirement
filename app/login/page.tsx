// app/login/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticateAdmin } from './actions';

// A separate submit button component to use the useFormStatus hook for loading states
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
    >
      {pending ? "Authenticating..." : "Sign In to Admin Portal"}
    </button>
  );
}

export default function LoginPage() {
  // useActionState connects the form to our server action and tracks the return value (errors)
  const [state, formAction] = useActionState(authenticateAdmin, null);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">GovTech NOC</h2>
          <p className="mt-2 text-sm text-gray-600">Restricted Admin Access</p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Admin Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 bg-white"
                placeholder="Enter password..."
              />
            </div>
          </div>

          {state?.error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
              {state.error}
            </div>
          )}

          <SubmitButton />
        </form>
        
      </div>
    </main>
  );
}