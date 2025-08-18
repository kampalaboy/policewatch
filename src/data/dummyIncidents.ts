import { IncidentReport } from '@/types/incident';

export const dummyIncidents: IncidentReport[] = [
  {
    id: '1',
    title: 'Excessive Force During Traffic Stop',
    description: 'Officer used unnecessary force during routine traffic violation. Multiple witnesses present.',
    location: {
      address: 'Kampala Road, Central Division, Kampala District',
      coordinates: { lat: 0.3476, lng: 32.5825 }
    },
    timestamp: '2024-01-15T14:30:00Z',
    media: [
      {
        type: 'video',
        url: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Video+Evidence',
        thumbnail: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Video+Thumbnail'
      }
    ],
    status: 'under_review',
    reportedBy: 'Anonymous Citizen',
    category: 'excessive_force',
    severity: 'high',
    tags: ['traffic_stop', 'excessive_force', 'witnesses']
  },
  {
    id: '2',
    title: 'Discriminatory Behavior at Checkpoint',
    description: 'Officer displayed discriminatory behavior during security checkpoint screening.',
    location: {
      address: 'Jinja Road, Nakawa Division, Kampala District',
      coordinates: { lat: 0.3354, lng: 32.6131 }
    },
    timestamp: '2024-01-14T09:15:00Z',
    media: [
      {
        type: 'photo',
        url: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Photo+Evidence'
      }
    ],
    status: 'investigating',
    reportedBy: 'John D.',
    category: 'discrimination',
    severity: 'medium',
    tags: ['checkpoint', 'discrimination', 'profiling']
  },
  {
    id: '3',
    title: 'Misconduct During Arrest',
    description: 'Officer failed to follow proper arrest procedures and used inappropriate language.',
    location: {
      address: 'Main Street, Jinja Municipality, Jinja District',
      coordinates: { lat: 0.4244, lng: 33.2042 }
    },
    timestamp: '2024-01-13T21:45:00Z',
    media: [
      {
        type: 'video',
        url: 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Video+Evidence',
        thumbnail: 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Video+Thumbnail'
      },
      {
        type: 'photo',
        url: 'https://via.placeholder.com/400x300/96ceb4/ffffff?text=Photo+Evidence'
      }
    ],
    status: 'pending',
    reportedBy: 'Maria S.',
    category: 'misconduct',
    severity: 'high',
    tags: ['arrest', 'misconduct', 'inappropriate_language']
  },
  {
    id: '4',
    title: 'Corruption - Bribery Attempt',
    description: 'Officer solicited bribe during routine inspection. Audio recording available.',
    location: {
      address: 'Masaka Road, Makindye Division, Kampala District',
      coordinates: { lat: 0.2816, lng: 32.5729 }
    },
    timestamp: '2024-01-12T16:20:00Z',
    media: [
      {
        type: 'photo',
        url: 'https://via.placeholder.com/400x300/f7dc6f/ffffff?text=Audio+Recording'
      }
    ],
    status: 'resolved',
    reportedBy: 'Business Owner',
    category: 'corruption',
    severity: 'critical',
    tags: ['bribery', 'corruption', 'audio_evidence']
  },
  {
    id: '5',
    title: 'Unprofessional Conduct',
    description: 'Officer displayed unprofessional behavior during public event.',
    location: {
      address: 'Bombo Road, Kawempe Division, Kampala District',
      coordinates: { lat: 0.3751, lng: 32.5729 }
    },
    timestamp: '2024-01-11T13:10:00Z',
    media: [
      {
        type: 'video',
        url: 'https://via.placeholder.com/400x300/bb8fce/ffffff?text=Video+Evidence',
        thumbnail: 'https://via.placeholder.com/400x300/bb8fce/ffffff?text=Video+Thumbnail'
      }
    ],
    status: 'dismissed',
    reportedBy: 'Event Attendee',
    category: 'other',
    severity: 'low',
    tags: ['public_event', 'unprofessional', 'conduct']
  }
];

// Function to generate more dummy data for infinite scroll
export const generateMoreIncidents = (startId: number, count: number): IncidentReport[] => {
  const statuses: IncidentReport['status'][] = ['pending', 'under_review', 'investigating', 'resolved', 'dismissed'];
  const categories: IncidentReport['category'][] = ['misconduct', 'excessive_force', 'corruption', 'discrimination', 'other'];
  const severities: IncidentReport['severity'][] = ['low', 'medium', 'high', 'critical'];
  const locations = [
    { address: 'Entebbe Road, Wakiso District', coordinates: { lat: 0.2906, lng: 32.4419 } },
    { address: 'Gayaza Road, Wakiso District', coordinates: { lat: 0.4106, lng: 32.6131 } },
    { address: 'Mukono Town, Mukono District', coordinates: { lat: 0.3533, lng: 32.7574 } },
    { address: 'Mbarara Town, Mbarara District', coordinates: { lat: -0.6103, lng: 30.6588 } },
    { address: 'Gulu Town, Gulu District', coordinates: { lat: 2.7856, lng: 32.2998 } },
    { address: 'Fort Portal, Kabarole District', coordinates: { lat: 0.6714, lng: 30.2748 } },
    { address: 'Mbale Town, Mbale District', coordinates: { lat: 1.0827, lng: 34.1755 } },
    { address: 'Soroti Town, Soroti District', coordinates: { lat: 1.7147, lng: 33.6111 } },
    { address: 'Lira Town, Lira District', coordinates: { lat: 2.2491, lng: 32.8998 } },
    { address: 'Masindi Town, Masindi District', coordinates: { lat: 1.6845, lng: 31.7148 } }
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    return {
      id: id.toString(),
      title: `Incident Report #${id}`,
      description: `This is a generated incident report for testing purposes. Report ID: ${id}`,
      location: randomLocation,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      media: [
        {
          type: Math.random() > 0.5 ? 'photo' : 'video',
          url: `https://via.placeholder.com/400x300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Evidence+${id}`,
          thumbnail: `https://via.placeholder.com/400x300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Thumb+${id}`
        }
      ],
      status: randomStatus,
      reportedBy: `Reporter ${id}`,
      category: randomCategory,
      severity: randomSeverity,
      tags: [`tag${id}`, randomCategory, randomSeverity]
    };
  });
};
