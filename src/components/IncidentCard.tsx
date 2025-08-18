'use client';

import { IncidentReport } from '@/types/incident';
import Image from 'next/image';

interface IncidentCardProps {
  incident: IncidentReport;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  under_review: 'bg-blue-100 text-blue-800 border-blue-200',
  investigating: 'bg-purple-100 text-purple-800 border-purple-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  dismissed: 'bg-gray-100 text-gray-800 border-gray-200'
};

const severityColors = {
  low: 'bg-green-50 border-l-green-500',
  medium: 'bg-yellow-50 border-l-yellow-500',
  high: 'bg-orange-50 border-l-orange-500',
  critical: 'bg-red-50 border-l-red-500'
};

const categoryIcons = {
  misconduct: '⚠️',
  excessive_force: '🚨',
  corruption: '💰',
  discrimination: '⚖️',
  other: '📋'
};

export default function IncidentCard({ incident }: IncidentCardProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${severityColors[incident.severity]} p-6 mb-4 hover:shadow-lg transition-shadow duration-200`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{categoryIcons[incident.category]}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
            <p className="text-sm text-gray-600">Report ID: {incident.id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[incident.status]}`}>
          {formatStatus(incident.status)}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3">{incident.description}</p>

      {/* Media */}
      {incident.media.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {incident.media.slice(0, 3).map((media, index) => (
              <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={media.thumbnail || media.url}
                  alt={`Evidence ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {media.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {incident.media.length > 3 && (
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-medium">+{incident.media.length - 3} more</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location and Time */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{incident.location.address}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{formatDate(incident.timestamp)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Reported by: <span className="font-medium">{incident.reportedBy}</span></span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
            incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
            incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {incident.severity.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
          {incident.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              #{tag}
            </span>
          ))}
          {incident.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              +{incident.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
