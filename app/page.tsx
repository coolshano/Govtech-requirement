// app/page.tsx
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const localOnboardingSchema = z.object({
  instituteName: z.string().min(2, "Institute Name is required"),
  department: z.string().min(2, "Department / Business Unit is required"),
  appName: z.string().min(2, "Application Name is required"),
  goLiveDate: z.string().min(1, "Project Go-Live Date is required"),
  networkBandwidth: z.string().min(1, "Network Bandwidth requirement is required"),
  workloadType: z.string().min(1, "Please select a workload type"),
  
  targetEnvironment: z.string().min(1, "Please select an environment"),
  osPreference: z.string().min(1, "Please select an OS"),
  vCpu: z.string().min(1, "vCPU is required"),
  ram: z.string().min(1, "RAM is required"),
  publicFacing: z.string().min(1, "Please select network connectivity"),
  
  dbEngine: z.string().min(1, "Please select a database engine"),
  storageType: z.string().min(1, "Please select a storage type"),
  storageSize: z.string().min(1, "Storage size is required"),
  highAvailability: z.string().min(1, "Please select HA requirement"),
  workloadCriticality: z.string().min(1, "Please select workload criticality"),
  backupPolicy: z.string().min(2, "Backup policy details required"),

  techContactName: z.string().min(2, "Name is required"),
  techContactEmail: z.string().email("Valid email is required"),
  billingEmail: z.string().email("Valid email is required"),
  backupRetention: z.string().min(1, "Please select backup retention"),
  
  // Security & Firewall Requirements
  firewallRules: z.string().optional(),
  wafRequired: z.string().min(1, "Please specify WAF requirement"),

  // Tracking Dates
  receivedDate: z.string().optional(),
  dateSentToSlt: z.string().optional(),
  
  architectureDiagram: z.any().optional(),
});

type OnboardingFormValues = z.infer<typeof localOnboardingSchema>;

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(localOnboardingSchema),
    mode: "onSubmit",
    defaultValues: {
      instituteName: "",
      department: "",
      appName: "",
      goLiveDate: "",
      networkBandwidth: "",
      workloadType: "",
      targetEnvironment: "",
      osPreference: "",
      vCpu: "",
      ram: "",
      publicFacing: "",
      dbEngine: "",
      storageType: "",
      storageSize: "",
      highAvailability: "",
      workloadCriticality: "",
      backupPolicy: "",
      techContactName: "",
      techContactEmail: "",
      billingEmail: "",
      backupRetention: "",
      firewallRules: "",
      wafRequired: "",
      receivedDate: "",
      dateSentToSlt: "",
    },
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    setStatusMessage("");
    
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'architectureDiagram' && value && value.length > 0) {
          formData.append(key, value[0]);
        } else if (key !== 'architectureDiagram' && value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      const response = await fetch('/api/send-contract', {
        method: 'POST',
        body: formData, 
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatusMessage("Success! Tenant onboarding request saved to database.");
        form.reset();
      } else {
        setStatusMessage(`Failed to save: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatusMessage("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500";
  const sectionStyles = "space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-100";

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">LGC2+ Tenant Onboarding Form</h1>

        {statusMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {statusMessage}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          {/* SECTION 1: General Details */}
          <div className={sectionStyles}>
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">1. General & App Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gov Institute Name</label>
                <input {...form.register("instituteName")} className={inputStyles} placeholder="e.g., Ministry of Health" />
                {form.formState.errors.instituteName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.instituteName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Unit / Department</label>
                <input {...form.register("department")} className={inputStyles} placeholder="e.g., IT Division" />
                {form.formState.errors.department && <p className="text-red-500 text-xs mt-1">{form.formState.errors.department.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Application Name</label>
                <input {...form.register("appName")} className={inputStyles} placeholder="e.g., eChanneling Portal" />
                {form.formState.errors.appName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.appName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Timeline / Go-Live Date</label>
                <input type="date" {...form.register("goLiveDate")} className={inputStyles} />
                {form.formState.errors.goLiveDate && <p className="text-red-500 text-xs mt-1">{form.formState.errors.goLiveDate.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Workload Type</label>
                <select {...form.register("workloadType")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="New Deployment">New Deployment (Greenfield)</option>
                  <option value="Migration">Migration</option>
                  <option value="Modernization">Modernization</option>
                </select>
                {form.formState.errors.workloadType && <p className="text-red-500 text-xs mt-1">{form.formState.errors.workloadType.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Network Bandwidth Requirement</label>
                <input {...form.register("networkBandwidth")} className={inputStyles} placeholder="e.g., 1 Gbps" />
                {form.formState.errors.networkBandwidth && <p className="text-red-500 text-xs mt-1">{form.formState.errors.networkBandwidth.message}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: Compute & Network Sizing */}
          <div className={sectionStyles}>
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">2. Compute & Network Sizing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Environment</label>
                <select {...form.register("targetEnvironment")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="Production">Production</option>
                  <option value="Staging">Staging / QA</option>
                  <option value="Development">Development / UAT</option>
                </select>
                {form.formState.errors.targetEnvironment && <p className="text-red-500 text-xs mt-1">{form.formState.errors.targetEnvironment.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">OS Preference</label>
                <select {...form.register("osPreference")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="Ubuntu LTS">Ubuntu LTS</option>
                  <option value="RHEL">RHEL</option>
                  <option value="Windows Server">Windows Server</option>
                </select>
                {form.formState.errors.osPreference && <p className="text-red-500 text-xs mt-1">{form.formState.errors.osPreference.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total vCPU</label>
                <input type="number" {...form.register("vCpu")} className={inputStyles} placeholder="e.g., 4" />
                {form.formState.errors.vCpu && <p className="text-red-500 text-xs mt-1">{form.formState.errors.vCpu.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total RAM (GB)</label>
                <input type="number" {...form.register("ram")} className={inputStyles} placeholder="e.g., 16" />
                {form.formState.errors.ram && <p className="text-red-500 text-xs mt-1">{form.formState.errors.ram.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Workload Criticality</label>
                <select {...form.register("workloadCriticality")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {form.formState.errors.workloadCriticality && <p className="text-red-500 text-xs mt-1">{form.formState.errors.workloadCriticality.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Network Connectivity</label>
              <select {...form.register("publicFacing")} className={inputStyles}>
                <option value="">Select...</option>
                <option value="Public Internet Facing">Public Internet Facing</option>
                <option value="Internal LGN Only">Internal LGN Only</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {form.formState.errors.publicFacing && <p className="text-red-500 text-xs mt-1">{form.formState.errors.publicFacing.message}</p>}
            </div>
          </div>

          {/* SECTION 3: Database & Storage */}
          <div className={sectionStyles}>
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">3. Database & Storage</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Database Engine</label>
                <select {...form.register("dbEngine")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MySQL">MySQL</option>
                  <option value="Microsoft SQL Server">Microsoft SQL Server</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="None">No Database Required</option>
                </select>
                {form.formState.errors.dbEngine && <p className="text-red-500 text-xs mt-1">{form.formState.errors.dbEngine.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Storage Type</label>
                <select {...form.register("storageType")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="Block">Block</option>
                  <option value="Object">Object</option>
                  <option value="File">File</option>
                </select>
                {form.formState.errors.storageType && <p className="text-red-500 text-xs mt-1">{form.formState.errors.storageType.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Storage Size (GB)</label>
                <input type="number" {...form.register("storageSize")} className={inputStyles} placeholder="e.g., 500" />
                {form.formState.errors.storageSize && <p className="text-red-500 text-xs mt-1">{form.formState.errors.storageSize.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">High Availability Required?</label>
                <select {...form.register("highAvailability")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="Yes">Yes (Multi-AZ / Replication)</option>
                  <option value="No">No (Standalone)</option>
                </select>
                {form.formState.errors.highAvailability && <p className="text-red-500 text-xs mt-1">{form.formState.errors.highAvailability.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Backup Policy & Frequency</label>
              <input {...form.register("backupPolicy")} className={inputStyles} placeholder="e.g., Daily incremental, Weekly full" />
              {form.formState.errors.backupPolicy && <p className="text-red-500 text-xs mt-1">{form.formState.errors.backupPolicy.message}</p>}
            </div>
          </div>

          {/* SECTION 4: Contacts & Security Rules */}
          <div className={sectionStyles}>
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">4. Contacts & Security Rules</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tech Contact Name</label>
                <input {...form.register("techContactName")} className={inputStyles} />
                {form.formState.errors.techContactName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.techContactName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tech Contact Email</label>
                <input type="email" {...form.register("techContactEmail")} className={inputStyles} />
                {form.formState.errors.techContactEmail && <p className="text-red-500 text-xs mt-1">{form.formState.errors.techContactEmail.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Billing Email (For Contract Delivery)</label>
              <input type="email" {...form.register("billingEmail")} className={inputStyles} />
              {form.formState.errors.billingEmail && <p className="text-red-500 text-xs mt-1">{form.formState.errors.billingEmail.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Backup Retention Policy</label>
                <select {...form.register("backupRetention")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="7 Days">7 Days</option>
                  <option value="14 Days">14 Days</option>
                  <option value="30 Days">30 Days</option>
                </select>
                {form.formState.errors.backupRetention && <p className="text-red-500 text-xs mt-1">{form.formState.errors.backupRetention.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">WAF Requirement</label>
                <select {...form.register("wafRequired")} className={inputStyles}>
                  <option value="">Select...</option>
                  <option value="Required">Required (Provide Domain Details)</option>
                  <option value="Not Required">Not Required</option>
                </select>
                {form.formState.errors.wafRequired && <p className="text-red-500 text-xs mt-1">{form.formState.errors.wafRequired.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Firewall Rules / Port Requirements</label>
              <textarea rows={3} {...form.register("firewallRules")} className={inputStyles} placeholder="e.g., Allow HTTP (TCP/80), HTTPS (TCP/443), SSH (TCP/22) from Public Internet" />
            </div>

            {/* Tracking Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Received Date</label>
                <input type="date" {...form.register("receivedDate")} className={inputStyles} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Sent to SLT</label>
                <input type="date" {...form.register("dateSentToSlt")} className={inputStyles} />
              </div>
            </div>
          </div>

          {/* SECTION 5: Documents */}
          <div className={sectionStyles}>
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">5. Supporting Documents</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Architecture Diagram / Topology (Optional)</label>
              <p className="text-xs text-gray-500 mb-2">Upload a PDF, PNG, or JPG detailing the target architecture.</p>
              <input 
                type="file" 
                accept="image/png, image/jpeg, application/pdf"
                {...form.register("architectureDiagram")} 
                className="mt-1 block w-full text-gray-900 bg-white border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
              />
            </div>
          </div>

          {Object.keys(form.formState.errors).length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
              Please fix the errors above before submitting.
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 px-6 border border-transparent rounded-lg shadow-md text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Processing..." : "Submit to NOC & Save"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}