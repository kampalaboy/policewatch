'use client';

import { IncidentReport } from '@/types/incident';

interface PoliceDashboardProps {
  incidents: IncidentReport[];
}

export default function PoliceDashboard({ incidents }: PoliceDashboardProps) {
  const totalIncidents = incidents.length;
  const pendingCount = incidents.filter(i => i.status === 'pending').length;
  const underReviewCount = incidents.filter(i => i.status === 'under_review').length;
  const investigatingCount = incidents.filter(i => i.status === 'investigating').length;

  return (
    <div className="fixed top-20 left-0 right-0 bg-gray-50 z-40 border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Header Stats - Reduced padding and size */}
        <div className="bg-white rounded-lg shadow-sm border p-3 mb-3">
          <h1 className="text-lg font-bold text-gray-900 mb-2">PoliceWatch Dashboard</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{totalIncidents}</div>
              <div className="text-xs text-gray-600">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{underReviewCount}</div>
              <div className="text-xs text-gray-600">Under Review</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{investigatingCount}</div>
              <div className="text-xs text-gray-600">Investigating</div>
            </div>
          </div>
        </div>

        {/* Filter Bar - Reduced padding */}
        <div className="bg-white rounded-lg shadow-sm border p-2">
          <div className="flex flex-wrap gap-1">
            <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors">
              All Reports
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              Pending
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              Under Review
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              High Priority
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              Recent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
