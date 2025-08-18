'use client';

import { useState, useEffect } from 'react';
import { IncidentReport } from '@/types/incident';
import IncidentCard from './IncidentCard';

interface OfficerNoticeBoardProps {
  incidents: IncidentReport[];
  onViewDetails: (reportId: string) => void;
  onQuickAction: (reportId: string, action: 'claim' | 'priority' | 'dismiss') => void;
}

interface FilterOptions {
  status: string;
  severity: string;
  category: string;
  district: string;
  timeRange: string;
  assignedToMe: boolean;
}

export default function OfficerNoticeBoard({ incidents, onViewDetails, onQuickAction }: OfficerNoticeBoardProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    severity: 'all',
    category: 'all',
    district: 'all',
    timeRange: 'all',
    assignedToMe: false
  });
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique districts from incidents
  const districts = [...new Set(incidents.map(i => i.location.address.split(',')[1]?.trim()).filter(Boolean))];

  // Filter and sort incidents
  const filteredIncidents = incidents
    .filter(incident => {
      if (filters.status !== 'all' && incident.status !== filters.status) return false;
      if (filters.severity !== 'all' && incident.severity !== filters.severity) return false;
      if (filters.category !== 'all' && incident.category !== filters.category) return false;
      if (filters.district !== 'all') {
        const district = incident.location.address.split(',')[1]?.trim();
        if (district !== filters.district) return false;
      }
      if (filters.timeRange !== 'all') {
        const now = new Date();
        const incidentDate = new Date(incident.timestamp);
        const diffHours = (now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60);
        
        switch (filters.timeRange) {
          case '1h':
            if (diffHours > 1) return false;
            break;
          case '24h':
            if (diffHours > 24) return false;
            break;
          case '7d':
            if (diffHours > 168) return false;
            break;
          case '30d':
            if (diffHours > 720) return false;
            break;
        }
      }
      // Note: assignedToMe filter would require officer assignment data
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'status':
          const statusOrder = { pending: 4, under_review: 3, investigating: 2, resolved: 1, dismissed: 0 };
          return statusOrder[b.status] - statusOrder[a.status];
        case 'location':
          return a.location.address.localeCompare(b.location.address);
        default:
          return 0;
      }
    });

  const stats = {
    total: filteredIncidents.length,
    pending: filteredIncidents.filter(i => i.status === 'pending').length,
    highPriority: filteredIncidents.filter(i => i.severity === 'high' || i.severity === 'critical').length,
    recent: filteredIncidents.filter(i => {
      const diffHours = (new Date().getTime() - new Date(i.timestamp).getTime()) / (1000 * 60 * 60);
      return diffHours <= 24;
    }).length
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      severity: 'all',
      category: 'all',
      district: 'all',
      timeRange: 'all',
      assignedToMe: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
              <p className="text-gray-600">Real-time incident reports from citizens</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-4V9.414a1 1 0 00-.293-.707L3.293 2.293A1 1 0 013 2v2z" />
                </svg>
                Filters
              </button>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('feed')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'feed' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  } rounded-l-lg`}
                >
                  Feed
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  } rounded-r-lg border-l border-gray-300`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.recent}</div>
              <div className="text-sm text-gray-600">Last 24 Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="misconduct">Misconduct</option>
                  <option value="excessive_force">Excessive Force</option>
                  <option value="corruption">Corruption</option>
                  <option value="discrimination">Discrimination</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select
                  value={filters.district}
                  onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="timestamp">Newest First</option>
                  <option value="severity">Highest Severity</option>
                  <option value="status">Status Priority</option>
                  <option value="location">Location</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.assignedToMe}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignedToMe: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Assigned to me</span>
                </label>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports match your filters</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filter criteria or clear all filters.</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className="relative">
                <IncidentCard incident={incident} />
                
                {/* Officer Quick Actions Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => onQuickAction(incident.id, 'claim')}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-colors"
                    title="Claim Report"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => onQuickAction(incident.id, 'priority')}
                    className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-lg transition-colors"
                    title="Mark High Priority"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => onViewDetails(incident.id)}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-lg transition-colors"
                    title="View Details"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
