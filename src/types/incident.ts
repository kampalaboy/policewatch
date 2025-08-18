export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  timestamp: string;
  media: {
    type: 'photo' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  status: 'pending' | 'under_review' | 'investigating' | 'resolved' | 'dismissed';
  reportedBy: string;
  category: 'misconduct' | 'excessive_force' | 'corruption' | 'discrimination' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

export interface FeedState {
  incidents: IncidentReport[];
  loading: boolean;
  hasMore: boolean;
  page: number;
}
