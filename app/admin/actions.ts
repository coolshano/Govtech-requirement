// app/admin/actions.ts
'use server';

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteOnboardingRequest(id: number) {
  try {
    await prisma.onboardingRequest.delete({
      where: { id },
    });
    // Refresh the admin page data cache
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete record:", error);
    return { success: false, error: "Failed to delete record" };
  }
}