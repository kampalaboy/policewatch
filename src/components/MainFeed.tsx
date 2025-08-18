'use client';

import { useState, useEffect, useCallback } from 'react';
import { IncidentReport } from '@/types/incident';
import { dummyIncidents, generateMoreIncidents } from '@/data/dummyIncidents';
import IncidentCard from './IncidentCard';

interface MainFeedProps {
  className?: string;
  incidents?: IncidentReport[];
}

export default function MainFeed({ className = '', incidents: initialIncidents = [] }: MainFeedProps) {
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialIncidents);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Update incidents when prop changes
  useEffect(() => {
    if (initialIncidents.length > 0) {
      setIncidents(initialIncidents);
      setPage(1);
    }
  }, [initialIncidents]);

  // Simulate API call to load more incidents
  const loadMoreIncidents = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const startId = dummyIncidents.length + (page - 1) * 10 + 1;
    const newIncidents = generateMoreIncidents(startId, 10);
    
    setIncidents(prev => [...prev, ...newIncidents]);
    setPage(prev => prev + 1);
    
    // Stop loading more after 5 pages (50 additional items)
    if (page >= 5) {
      setHasMore(false);
    }
    
    setLoading(false);
  }, [loading, hasMore, page]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        loadMoreIncidents();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreIncidents]);

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Incidents Feed */}
      <div className="space-y-4 mt-6">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading more reports...</span>
        </div>
      )}

      {/* End of Feed Message */}
      {!hasMore && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">You've reached the end of the feed</div>
          <div className="text-sm text-gray-400">
            Showing {incidents.length} incident reports
          </div>
        </div>
      )}

      {/* Empty State */}
      {incidents.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No incident reports</h3>
          <p className="text-gray-500">New reports from CitizenWatch will appear here.</p>
        </div>
      )}
    </div>
  );
}
