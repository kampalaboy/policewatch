"use client";

import { useEffect, useState } from "react";
import { Report } from "@/lib/reports";
import { useAuth } from "@/lib/auth";
import { getFirebaseClients } from "@/lib/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

interface OfficerDashboardProps {
  incidents: Report[];
  officerInfo: {
    name: string;
    badgeNumber: string;
    station: string;
    district: string;
  };
  onSignOut?: () => void;
}

interface StatCard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function OfficerDashboard({
  incidents,
  officerInfo,
  onSignOut,
}: OfficerDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const { user } = useAuth();
  const [resolvedBadgeNumber, setResolvedBadgeNumber] = useState<string>(
    officerInfo.badgeNumber
  );

  useEffect(() => {
    const fetchBadgeFromIndex = async () => {
      try {
        // If already provided, keep it
        if (officerInfo.badgeNumber && officerInfo.badgeNumber !== "Unknown") {
          setResolvedBadgeNumber(officerInfo.badgeNumber);
          return;
        }
        const { db } = getFirebaseClients();
        // Try lookup by email (requires rules to allow this query)
        if (user?.uid) {
          const q = query(
            collection(db, "badgeIndex"),
            where("uid", "==", user.uid),
            limit(1)
          );
          const qs = await getDocs(q);
          if (!qs.empty) {
            setResolvedBadgeNumber(qs.docs[0].id);
            return;
          }
        }
      } catch {
        // Silently ignore; keep existing value if rules block queries
      }
    };
    fetchBadgeFromIndex();
  }, [user?.uid, officerInfo.badgeNumber]);

  // Calculate statistics
  const totalReports = incidents.length;
  const pendingReports = incidents.filter((i) => i.status === "pending").length;
  const underReviewReports = incidents.filter(
    (i) => i.status === "under_review"
  ).length;
  const investigatingReports = incidents.filter(
    (i) => i.status === "investigating"
  ).length;
  const resolvedReports = incidents.filter(
    (i) => i.status === "resolved"
  ).length;
  const highPriorityReports = incidents.filter(
    (i) => i.priority === "high" || i.priority === "critical"
  ).length;

  const stats: StatCard[] = [
    {
      title: "Total Reports",
      value: totalReports,
      change: +12,
      color: "bg-blue-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Pending Review",
      value: pendingReports,
      change: +3,
      color: "bg-yellow-500",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      title: "Under Investigation",
      value: investigatingReports,
      change: -1,
      color: "bg-purple-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      title: "Under Review",
      value: underReviewReports,
      change: +1,
      color: "bg-amber-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 9v2m9 1a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Resolved",
      value: resolvedReports,
      change: +4,
      color: "bg-green-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      title: "High Priority",
      value: highPriorityReports,
      change: +2,
      color: "bg-red-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
  ];

  const recentActivity = [
    {
      action: "New report submitted",
      location: "Kampala Central",
      time: "5 min ago",
      type: "new",
    },
    {
      action: "Report status updated",
      location: "Nakawa Division",
      time: "15 min ago",
      type: "update",
    },
    {
      action: "Investigation completed",
      location: "Kawempe Division",
      time: "1 hour ago",
      type: "completed",
    },
    {
      action: "High priority alert",
      location: "Makindye Division",
      time: "2 hours ago",
      type: "alert",
    },
  ];

  const districtStats = [
    { district: "Kampala Central", reports: 23, trend: "up" },
    { district: "Nakawa", reports: 18, trend: "down" },
    { district: "Kawempe", reports: 15, trend: "up" },
    { district: "Makindye", reports: 12, trend: "stable" },
    { district: "Rubaga", reports: 8, trend: "down" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Officer Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, Officer {officerInfo.name} • Badge:{" "}
                {resolvedBadgeNumber}
              </p>
              <p className="text-sm text-gray-500">
                {officerInfo.station} • {officerInfo.district}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Generate Report
              </button>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    stat.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change >= 0 ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  from last period
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-600">
                  Latest updates from your jurisdiction
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.type === "new"
                            ? "bg-blue-500"
                            : activity.type === "update"
                            ? "bg-yellow-500"
                            : activity.type === "completed"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.location}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All Activity
                </button>
              </div>
            </div>
          </div>

          {/* District Statistics */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  District Overview
                </h3>
                <p className="text-sm text-gray-600">Reports by district</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {districtStats.map((district, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {district.district}
                        </p>
                        <p className="text-xs text-gray-600">
                          {district.reports} reports
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            district.trend === "up"
                              ? "bg-red-500"
                              : district.trend === "down"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        <svg
                          className={`w-4 h-4 ${
                            district.trend === "up"
                              ? "text-red-500 rotate-180"
                              : district.trend === "down"
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Review Pending Reports
                  </span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Open Complaint Chats
                  </span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <svg
                    className="w-5 h-5 text-purple-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
