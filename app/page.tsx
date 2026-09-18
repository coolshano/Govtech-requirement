// app/admin/page.tsx
'use client';

import { useState } from 'react';
import { deleteOnboardingRequest, updateTrackingDates } from './actions';

// Define the shape of an onboarding request record, including all pipeline sheet fields
type RequestItem = {
  id: number;
  instituteName: string;
  department: string | null;
  appName: string;
  goLiveDate: string | null;
  networkBandwidth: string | null;
  workloadType: string;
  targetEnvironment: string;
  osPreference: string;
  vCpu: string;
  ram: string;
  storageType: string | null;
  storageSize: string;
  highAvailability: string;
  workloadCriticality: string | null;
  dbEngine: string;
  backupPolicy: string | null;
  techContactName: string;
  techContactEmail: string;
  billingEmail: string;
  backupRetention: string;
  firewallRules: string | null;
  wafRequired: string | null;
  receivedDate: string | null;
  dateSentToSlt: string | null;
  architectureDiagram: string | null;
  createdAt: Date;
};

export default function AdminDashboard({ initialRequests }: { initialRequests: RequestItem[] }) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState('ALL');
  const [workloadFilter, setWorkloadFilter] = useState('ALL');

  // Delete handler
  const handleDelete = async (id: number, instituteName: string) => {
    if (window.confirm(`Are you sure you want to delete the onboarding request for "${instituteName}"?`)) {
      const res = await deleteOnboardingRequest(id);
      if (res.success) {
        setRequests(requests.filter(req => req.id !== id));
      } else {
        alert("Failed to delete record.");
      }
    }
  };

  // Date update handler
  const handleDateChange = async (id: number, newReceivedDate: string, newDateSentToSlt: string) => {
    const res = await updateTrackingDates(id, newReceivedDate, newDateSentToSlt);
    if (!res.success) {
      alert("Failed to update tracking dates.");
    }
  };

  // Filter logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.instituteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.techContactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.department && req.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesEnv = envFilter === 'ALL' || req.targetEnvironment === envFilter;
    const matchesWorkload = workloadFilter === 'ALL' || req.workloadType === workloadFilter;

    return matchesSearch && matchesEnv && matchesWorkload;
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[95rem] mx-auto">
        
        {/* Header Section */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GovTech NOC Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage and review LGC2+ tenant onboarding requests and pipeline infrastructure specifications.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              Showing: {filteredRequests.length} of {requests.length} Requests
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Box */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Search Institute / Dept / App</label>
            <input 
              type="text" 
              placeholder="Type to search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Environment Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Filter by Environment</label>
            <select 
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ALL">All Environments</option>
              <option value="Production">Production</option>
              <option value="Staging">Staging / QA</option>
              <option value="Development">Development / UAT</option>
            </select>
          </div>

          {/* Workload Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Filter by Workload</label>
            <select 
              value={workloadFilter}
              onChange={(e) => setWorkloadFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ALL">All Workloads</option>
              <option value="New Deployment">New Deployment</option>
              <option value="Migration">Migration</option>
              <option value="Modernization">Modernization</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider sm:pl-6">Institute & App</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Timeline / Go-Live</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Environment</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Compute & Criticality</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Database & Storage</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Security & Firewall</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Contacts</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Received Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Sent to SLT</th>
                      <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider sm:pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-gray-500 text-sm">
                          No matching onboarding requests found.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50">
                          
                          {/* Institute & App Name */}
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">{req.instituteName}</div>
                            <div className="text-gray-500 text-xs">{req.department || 'No Dept'} — {req.appName}</div>
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 mt-1 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {req.workloadType}
                            </span>
                          </td>

                          {/* Go-Live Date & Bandwidth */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900 font-medium">{req.goLiveDate || 'TBD'}</div>
                            <div className="text-xs text-gray-500">Bw: {req.networkBandwidth || 'Standard'}</div>
                          </td>

                          {/* Environment */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900 font-medium">{req.targetEnvironment}</div>
                            <div className="text-xs text-gray-500">{req.workloadType}</div>
                          </td>

                          {/* Compute & Criticality */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900">{req.osPreference}</div>
                            <div className="text-xs">{req.vCpu} vCPU / {req.ram}GB RAM</div>
                            <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              Crit: {req.workloadCriticality || 'N/A'}
                            </span>
                          </td>

                          {/* Database & Storage */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900">{req.dbEngine}</div>
                            <div className="text-xs">{req.storageSize}GB ({req.storageType || 'Block'} / {req.highAvailability === 'Yes' ? 'HA' : 'Standalone'})</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">Backup: {req.backupPolicy || req.backupRetention}</div>
                          </td>

                          {/* Security & Firewall */}
                          <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">
                            <div className="text-xs font-semibold text-indigo-600">WAF: {req.wafRequired || 'Not Req'}</div>
                            <div className="text-xs text-gray-700 truncate max-w-[200px]" title={req.firewallRules || ''}>
                              FW: {req.firewallRules || 'None specified'}
                            </div>
                          </td>

                          {/* Contacts */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900">{req.techContactName}</div>
                            <a href={`mailto:${req.techContactEmail}`} className="text-indigo-600 hover:text-indigo-900 text-xs">
                              {req.techContactEmail}
                            </a>
                          </td>

                          {/* Received Date (Editable inline) */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input 
                              type="date"
                              defaultValue={req.receivedDate || ''}
                              onBlur={(e) => handleDateChange(req.id, e.target.value, req.dateSentToSlt || '')}
                              className="border border-gray-300 rounded p-1 text-xs text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </td>

                          {/* Date Sent to SLT (Editable inline) */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input 
                              type="date"
                              defaultValue={req.dateSentToSlt || ''}
                              onBlur={(e) => handleDateChange(req.id, req.receivedDate || '', e.target.value)}
                              className="border border-gray-300 rounded p-1 text-xs text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </td>

                          {/* Actions: View Diagram & Delete */}
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                            {req.architectureDiagram && (
                              <a 
                                href={req.architectureDiagram} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded text-xs transition-colors"
                              >
                                Diagram
                              </a>
                            )}
                            <button
                              onClick={() => handleDelete(req.id, req.instituteName)}
                              className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}