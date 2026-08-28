// app/admin/page.tsx
import prisma from '../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // 1. Verify Authentication Server-side
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_session')?.value;

  if (authCookie !== 'authenticated') {
    redirect('/login');
  }

  // 2. Fetch data from SQLite
  const requests = await prisma.onboardingRequest.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3. Pass data to the interactive client component
  return <AdminClient initialRequests={requests} />;
}