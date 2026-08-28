// schemas/onboardingSchema.ts
import { z } from "zod";

export const onboardingSchema = z.object({
  // Step 1
  instituteName: z.string().min(2, "Institute Name is required"),
  appName: z.string().min(2, "Application Name is required"),
  workloadType: z.string().min(1, "Please select a workload type"),

  // Step 2
  targetEnvironment: z.string().min(1, "Please select an environment"),
  osPreference: z.string().min(1, "Please select an OS"),
  vCpu: z.string().min(1, "vCPU is required"),
  ram: z.string().min(1, "RAM is required"),
  publicFacing: z.string().min(1, "Please select network connectivity"),

  // Step 3
  dbEngine: z.string().min(1, "Please select a database engine"),
  storageSize: z.string().min(1, "Storage size is required"),
  highAvailability: z.string().min(1, "Please select HA requirement"),

  // Step 4
  techContactName: z.string().min(2, "Name is required"),
  techContactEmail: z.string().email("Valid email is required"),
  billingEmail: z.string().email("Valid email is required"),
  backupRetention: z.string().min(1, "Please select backup retention"),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;