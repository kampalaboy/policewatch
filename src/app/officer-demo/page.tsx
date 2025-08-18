'use client';

import { useState } from 'react';
import { IncidentReport } from '@/types/incident';
import { dummyIncidents } from '@/data/dummyIncidents';
import OfficerLogin from '@/components/OfficerLogin';
import OfficerDashboard from '@/components/OfficerDashboard';
import OfficerNoticeBoard from '@/components/OfficerNoticeBoard';
import ReportDetails from '@/components/ReportDetails';
import ReportManagement from '@/components/ReportManagement';
import ComplaintChat from '@/components/ComplaintChat';

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

type Screen = 'login' | 'dashboard' | 'notice-board' | 'report-details' | 'report-management' | 'complaint-chat';

export default function OfficerDemoPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [incidents, setIncidents] = useState<IncidentReport[]>(dummyIncidents);
  const [messages, setMessages] = useState(demoMessages);

  const officerInfo = {
    name: 'Sarah Nakato',
    badgeNumber: 'UPF001',
    station: 'Kampala Central Police Station',
    district: 'Kampala Central Division'
  };

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

  // Navigation component
  const Navigation = () => (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Officer Demo Navigation</h3>
        <div className="space-y-2">
          <button
            onClick={() => setCurrentScreen('login')}
            className={`block w-full text-left px-3 py-2 rounded text-sm ${
              currentScreen === 'login' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔐 Login
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`block w-full text-left px-3 py-2 rounded text-sm ${
              currentScreen === 'dashboard' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setCurrentScreen('notice-board')}
            className={`block w-full text-left px-3 py-2 rounded text-sm ${
              currentScreen === 'notice-board' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📋 Notice Board
          </button>
          <button
            onClick={() => setCurrentScreen('report-management')}
            className={`block w-full text-left px-3 py-2 rounded text-sm ${
              currentScreen === 'report-management' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⚙️ Report Management
          </button>
          <button
            onClick={() => setCurrentScreen('complaint-chat')}
            className={`block w-full text-left px-3 py-2 rounded text-sm ${
              currentScreen === 'complaint-chat' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💬 Complaint Chat
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {currentScreen !== 'login' && <Navigation />}
      
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
    </div>
  );
}
