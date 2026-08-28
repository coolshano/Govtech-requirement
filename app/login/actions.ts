// app/login/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function authenticateAdmin(prevState: any, formData: FormData) {
  const password = formData.get('password');

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    
    redirect('/admin');
  }

  return { error: 'Invalid admin password' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/login');
}