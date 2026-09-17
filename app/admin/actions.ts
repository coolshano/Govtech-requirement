// app/admin/actions.ts
'use server';

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Delete Action
export async function deleteOnboardingRequest(id: number) {
  try {
    await prisma.onboardingRequest.delete({
      where: { id },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete record:", error);
    return { success: false, error: "Failed to delete record" };
  }
}

// 2. Update Tracking Dates Action
export async function updateTrackingDates(id: number, receivedDate: string, dateSentToSlt: string) {
  try {
    await prisma.onboardingRequest.update({
      where: { id },
      data: {
        receivedDate: receivedDate || null,
        dateSentToSlt: dateSentToSlt || null,
      },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Failed to update dates:", error);
    return { success: false, error: "Failed to update dates" };
  }
}