// app/api/send-contract/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract text fields
    const instituteName = formData.get('instituteName') as string;
    const department = formData.get('department') as string;
    const appName = formData.get('appName') as string;
    const goLiveDate = formData.get('goLiveDate') as string;
    const networkBandwidth = formData.get('networkBandwidth') as string;
    const workloadType = formData.get('workloadType') as string;
    const targetEnvironment = formData.get('targetEnvironment') as string;
    const osPreference = formData.get('osPreference') as string;
    const vCpu = formData.get('vCpu') as string;
    const ram = formData.get('ram') as string;
    const storageType = formData.get('storageType') as string;
    const storageSize = formData.get('storageSize') as string;
    const highAvailability = formData.get('highAvailability') as string;
    const workloadCriticality = formData.get('workloadCriticality') as string;
    const dbEngine = formData.get('dbEngine') as string;
    const backupPolicy = formData.get('backupPolicy') as string;
    const techContactName = formData.get('techContactName') as string;
    const techContactEmail = formData.get('techContactEmail') as string;
    const billingEmail = formData.get('billingEmail') as string;
    const backupRetention = formData.get('backupRetention') as string;
    const firewallRules = formData.get('firewallRules') as string;
    const wafRequired = formData.get('wafRequired') as string;
    const receivedDate = formData.get('receivedDate') as string;
    const dateSentToSlt = formData.get('dateSentToSlt') as string;

    // Handle file upload by capturing the filename securely as text
    const file = formData.get('architectureDiagram') as File | null;
    const diagramFilename = (file && file.size > 0 && file.name) ? file.name : null;

    // Save record to database
    await prisma.onboardingRequest.create({
      data: {
        instituteName,
        department,
        appName,
        goLiveDate,
        networkBandwidth,
        workloadType,
        targetEnvironment,
        osPreference,
        vCpu,
        ram,
        storageType,
        storageSize,
        highAvailability,
        workloadCriticality,
        dbEngine,
        backupPolicy,
        techContactName,
        techContactEmail,
        billingEmail,
        backupRetention,
        firewallRules,
        wafRequired,
        receivedDate: receivedDate || null,
        dateSentToSlt: dateSentToSlt || null,
        architectureDiagram: diagramFilename,
      },
    });

    return NextResponse.json({ success: true, message: 'Request saved successfully' });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}