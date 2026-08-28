// app/api/send-contract/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Adjust this path if your lib folder is located somewhere else
import prisma from '../../../lib/prisma'; 

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // 1. Extract the file
    const file = formData.get('architectureDiagram') as File | null;
    let savedFilePath = null;

    // 2. Save the file to the local filesystem (public/uploads)
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename to prevent overwrites
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const uploadDir = join(process.cwd(), 'public/uploads');
      
      // Ensure the directory exists
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);
      
      savedFilePath = `/uploads/${uniqueName}`; // Path to store in DB
    }

    // 3. Save all data to SQLite using Prisma
    const newRequest = await prisma.onboardingRequest.create({
      data: {
        instituteName: formData.get('instituteName') as string,
        appName: formData.get('appName') as string,
        workloadType: formData.get('workloadType') as string,
        targetEnvironment: formData.get('targetEnvironment') as string,
        osPreference: formData.get('osPreference') as string,
        vCpu: formData.get('vCpu') as string,
        ram: formData.get('ram') as string,
        publicFacing: formData.get('publicFacing') as string,
        dbEngine: formData.get('dbEngine') as string,
        storageSize: formData.get('storageSize') as string,
        highAvailability: formData.get('highAvailability') as string,
        techContactName: formData.get('techContactName') as string,
        techContactEmail: formData.get('techContactEmail') as string,
        billingEmail: formData.get('billingEmail') as string,
        backupRetention: formData.get('backupRetention') as string,
        architectureDiagram: savedFilePath,
      },
    });

    // EMAIL DISABLED FOR TESTING
    // console.log("Email would have been sent to:", formData.get('billingEmail'));

    return NextResponse.json({ success: true, recordId: newRequest.id });
  } catch (error: any) {
    console.error("API Error:", error);
    // This will send the exact error message back to the browser if it fails
    return NextResponse.json({ success: false, error: error.message || "Failed to process request" }, { status: 500 });
  }
}