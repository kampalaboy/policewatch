'use client';

import { useState, useEffect } from 'react';
import MainFeed from '@/components/MainFeed';
import PoliceDashboard from '@/components/PoliceDashboard';

import OfficerLogin from '@/components/OfficerLogin';
import OfficerDashboard from '@/components/OfficerDashboard';
import OfficerNoticeBoard from '@/components/OfficerNoticeBoard';
import ReportDetails from '@/components/ReportDetails';
import ReportManagement from '@/components/ReportManagement';
import ComplaintChat from '@/components/ComplaintChat';
import { IncidentReport } from '@/types/incident';
import { dummyIncidents } from '@/data/dummyIncidents';

// Demo data for complaints and messages
const demoComplaints = [
  {
    id: 'COMP001',
    title: 'Excessive Force During Arrest',
    citizenName: 'John Mukasa',
    citizenId: 'citizen_001',
    officerId: 'officer_001',
    officerName: 'Inspector Nakato Sarah',
    status: 'in_progress' as const,
    category: 'Excessive Force',
    location: {
      address: 'Kampala Road, Central Division, Kampala District',
      coordinates: { lat: 0.3476, lng: 32.5825 }
    },
    incidentDate: '2024-01-15T14:30:00Z',
    createdAt: '2024-01-15T15:00:00Z',
    priority: 'high' as const
  }
];

const demoMessages = [
  {
    id: 'msg_001',
    senderId: 'citizen_001',
    senderName: 'John Mukasa',
    senderRole: 'citizen' as const,
    content: 'I was arrested yesterday and the officer used excessive force. I have video evidence.',
    type: 'text' as const,
    timestamp: '2024-01-15T15:00:00Z'
  },
  {
    id: 'msg_002',
    senderId: 'citizen_001',
    senderName: 'John Mukasa',
    senderRole: 'citizen' as const,
    content: 'Here is the video evidence of the incident.',
    type: 'image' as const,
    timestamp: '2024-01-15T15:05:00Z',
    mediaUrl: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Video+Evidence'
  },
  {
    id: 'msg_003',
    senderId: 'officer_001',
    senderName: 'Inspector Nakato Sarah',
    senderRole: 'officer' as const,
    content: 'Thank you for reporting this incident. I have reviewed your complaint and will investigate this matter thoroughly. Can you provide more details about the time and exact location?',
    type: 'text' as const,
    timestamp: '2024-01-15T16:30:00Z'
  },
  {
    id: 'msg_004',
    senderId: 'citizen_001',
    senderName: 'John Mukasa',
    senderRole: 'citizen' as const,
    content: 'The incident happened at around 2:30 PM near the Central Police Station. There were several witnesses present.',
    type: 'text' as const,
    timestamp: '2024-01-15T17:00:00Z'
  }
];

type Screen = 'login' | 'dashboard' | 'notice-board' | 'report-details' | 'report-management' | 'complaint-chat' | 'citizen-view';

export default function Home() {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [messages, setMessages] = useState(demoMessages);

  const officerInfo = {
    name: 'Sarah Nakato',
    badgeNumber: 'UPF001',
    station: 'Kampala Central Police Station',
    district: 'Kampala Central Division'
  };

  // Load initial data
  useEffect(() => {
    setIncidents(dummyIncidents);
  }, []);

  const handleLogin = (credentials: { badgeNumber: string; password: string }) => {
    // Simulate login validation
    if (credentials.badgeNumber === 'UPF001' && credentials.password === 'demo123') {
      setCurrentScreen('dashboard');
    } else {
      alert('Invalid credentials. Use Badge: UPF001, Password: demo123');
    }
  };

  const handleViewDetails = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentScreen('report-details');
  };

  const handleStatusUpdate = (reportId: string, status: IncidentReport['status'], notes?: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === reportId 
        ? { ...incident, status }
        : incident
    ));
    console.log(`Updated report ${reportId} to ${status}`, notes);
  };

  const handleBulkStatusUpdate = (reportIds: string[], status: IncidentReport['status'], notes?: string) => {
    setIncidents(prev => prev.map(incident => 
      reportIds.includes(incident.id)
        ? { ...incident, status }
        : incident
    ));
    console.log(`Updated ${reportIds.length} reports to ${status}`, notes);
  };

  const handleAssignOfficer = (reportId: string, officerId: string) => {
    console.log(`Assigned officer ${officerId} to report ${reportId}`);
  };

  const handleBulkAssign = (reportIds: string[], officerId: string) => {
    console.log(`Assigned officer ${officerId} to ${reportIds.length} reports`);
  };

  const handleQuickAction = (reportId: string, action: 'claim' | 'priority' | 'dismiss') => {
    switch (action) {
      case 'claim':
        handleStatusUpdate(reportId, 'under_review');
        break;
      case 'priority':
        setIncidents(prev => prev.map(incident => 
          incident.id === reportId 
            ? { ...incident, severity: 'high' as const }
            : incident
        ));
        break;
      case 'dismiss':
        handleStatusUpdate(reportId, 'dismissed');
        break;
    }
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file', mediaUrl?: string, fileName?: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'officer_001',
      senderName: 'Inspector Nakato Sarah',
      senderRole: 'officer' as const,
      content,
      type,
      timestamp: new Date().toISOString(),
      mediaUrl,
      fileName
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUpdateComplaintStatus = (status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    console.log(`Updated complaint status to ${status}`);
  };

  const selectedReport = incidents.find(i => i.id === selectedReportId);

  // Bottom Navigation component
  const BottomNavigation = () => {
    const navItems = [
      {
        id: 'dashboard',
        label: 'Home',
        screen: 'dashboard' as Screen,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      },
      {
        id: 'notice-board',
        label: 'Notice Board',
        screen: 'notice-board' as Screen,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      {
        id: 'report-management',
        label: 'Manage',
        screen: 'report-management' as Screen,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      },
      {
        id: 'complaint-chat',
        label: 'Chat',
        screen: 'complaint-chat' as Screen,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      }
    ];

    // Show different nav items on mobile vs desktop
    const displayItems = navItems; // Show all items, let CSS handle responsive behavior

    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
        <div className="mx-auto">
          <div className="flex justify-center md:justify-start">
            {displayItems.map((item) => {
              const isActive = currentScreen === item.screen;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.screen)}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[64px] transition-all duration-200 relative ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 active:bg-gray-100'
                  }`}
                  aria-label={item.label}
                  role="tab"
                  aria-selected={isActive}
                >
                  <div className={`transition-all duration-200 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}

          </div>
        </div>

        {/* Citizen View Toggle - Desktop only */}
        <div className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setCurrentScreen('citizen-view')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              currentScreen === 'citizen-view'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            👥 Citizen View
          </button>
        </div>
      </nav>
    );
  };



  // Show officer screens
  if (currentScreen !== 'citizen-view') {
    return (
      <div className="min-h-screen pb-16">
        
        {currentScreen === 'login' && (
          <OfficerLogin onLogin={handleLogin} />
        )}

        {currentScreen === 'dashboard' && (
          <OfficerDashboard 
            incidents={incidents}
            officerInfo={officerInfo}
          />
        )}

        {currentScreen === 'notice-board' && (
          <OfficerNoticeBoard
            incidents={incidents}
            onViewDetails={handleViewDetails}
            onQuickAction={handleQuickAction}
          />
        )}

        {currentScreen === 'report-details' && selectedReport && (
          <ReportDetails
            incident={selectedReport}
            onStatusUpdate={handleStatusUpdate}
            onAssignOfficer={handleAssignOfficer}
            onBack={() => setCurrentScreen('notice-board')}
          />
        )}

        {currentScreen === 'report-management' && (
          <ReportManagement
            incidents={incidents}
            onStatusUpdate={handleBulkStatusUpdate}
            onBulkAssign={handleBulkAssign}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentScreen === 'complaint-chat' && (
          <ComplaintChat
            complaint={demoComplaints[0]}
            messages={messages}
            currentUserId="officer_001"
            currentUserRole="officer"
            onSendMessage={handleSendMessage}
            onUpdateStatus={handleUpdateComplaintStatus}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {/* Bottom Navigation - Hide on login screen */}
        {currentScreen !== 'login' && <BottomNavigation />}
      </div>
    );
  }

  // Original citizen view
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">PoliceWatch</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Police Dashboard - Fixed */}
      <PoliceDashboard incidents={incidents} />

      {/* Main Content */}
      <main className="content-with-dashboard-padding pb-8 px-4 sm:px-6 lg:px-8 bottom-nav-padding">
        <MainFeed incidents={incidents} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12" style={{ marginBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-gray-600">PoliceWatch © 2024</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
              <a href="#" className="hover:text-gray-700">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Citizen Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
        <div className="mx-auto">
          <div className="flex justify-center md:justify-start">
            <button className="flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[64px] text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Notice Board</span>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
            </button>
            
            <button className="flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[64px] text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Complaints</span>
            </button>
            
            <button className="flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[64px] text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Analytics</span>
            </button>
            
            <button className="flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[64px] text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs mt-1 font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Officer View Toggle - Desktop only */}
        <div className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setCurrentScreen('login')}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
          >
            🔐 Officer Login
          </button>
        </div>
      </nav>
    </div>
  );
}
