"use client";

import { Report } from "@/lib/reports";
import Image from "next/image";

interface IncidentCardProps {
  incident: Report;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  under_review: "bg-blue-100 text-blue-800 border-blue-200",
  investigating: "bg-purple-100 text-purple-800 border-purple-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  dismissed: "bg-gray-100 text-gray-800 border-gray-200",
};

const severityColors: Record<string, string> = {
  low: "bg-green-50 border-l-green-500",
  medium: "bg-yellow-50 border-l-yellow-500",
  high: "bg-orange-50 border-l-orange-500",
  critical: "bg-red-50 border-l-red-500",
};

const categoryIcons: Record<string, string> = {
  misconduct: "⚠️",
  excessive_force: "🚨",
  corruption: "💰",
  discrimination: "⚖️",
  other: "📋",
};

export default function IncidentCard({ incident }: IncidentCardProps) {
  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return "Unknown date";

    let date: Date;

    // Handle Firestore timestamp
    if (
      timestamp &&
      typeof timestamp === "object" &&
      "toDate" in timestamp &&
      typeof (timestamp as any).toDate === "function"
    ) {
      date = (timestamp as any).toDate();
    }
    // Handle regular Date object
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Handle string or number timestamp
    else {
      date = new Date(timestamp as string | number);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }

    const now = new Date();
    const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    // If less than 10 minutes ago, show "new"
    if (diffMinutes < 10) {
      return "new";
    }

    // Check if it's today
    const isToday = now.toDateString() === date.toDateString();

    if (isToday) {
      // Show "Today, 2:30 PM" for today's posts
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else {
      // Format as "Jan 15, 2:30 PM" for older posts
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-l-4 ${
        severityColors[incident.priority || "medium"]
      } p-6 mb-4 hover:shadow-lg transition-shadow duration-200`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {categoryIcons[incident.category || "other"]}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {incident.category || "Incident Report"}
            </h3>
            <p className="text-sm text-gray-600">Report ID: {incident.id}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            statusColors[incident.status || "pending"]
          }`}
        >
          {formatStatus(incident.status || "pending")}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {incident.text || "No description provided"}
      </p>

      {/* Media */}
      {incident.media && incident.media.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {incident.media.slice(0, 3).map((media, index) => (
              <div
                key={index}
                className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
              >
                {media.type?.startsWith("video") ||
                media.url.includes(".mp4") ||
                media.url.includes(".mov") ||
                media.url.includes(".avi") ? (
                  // For videos, use the same implementation as LiveFeed
                  <div className="relative h-full w-full">
                    <video
                      className="h-full w-full object-cover rounded-lg"
                      src={media.url}
                      controls
                      playsInline
                    />
                  </div>
                ) : (
                  // For images, use Next.js Image component
                  <Image
                    src={media.url}
                    alt={`Evidence ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
            {incident.media.length > 3 && (
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  +{incident.media.length - 3} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location and Time */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm">
            {incident.location
              ? `${incident.location.lat.toFixed(
                  4
                )}, ${incident.location.lng.toFixed(4)}`
              : "Location not specified"}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">{formatDate(incident.createdAt)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            Reported by:{" "}
            <span className="font-medium">
              {incident.citizenName || "Anonymous"}
            </span>
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              incident.priority === "critical"
                ? "bg-red-100 text-red-800"
                : incident.priority === "high"
                ? "bg-orange-100 text-orange-800"
                : incident.priority === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {incident.priority?.toUpperCase() || "MEDIUM"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
          {incident.category && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              #{incident.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
