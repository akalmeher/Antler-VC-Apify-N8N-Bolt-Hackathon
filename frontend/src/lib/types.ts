export type CompetitorStatus = 'pending' | 'scanning' | 'active' | 'error';
export type SignalType = 'baseline' | 'change';
export type Impact = 'high' | 'medium' | 'low';
export type Category =
  | 'pricing'
  | 'promotion'
  | 'menu_product'
  | 'hours'
  | 'reputation'
  | 'positioning';

export interface Business {
  id: string;
  name: string;
  category: string;
  city: string | null;
  offerings: string | null;
  created_at: string;
  // Optional nearby-search fields — omitted until those columns exist.
  address?: string | null;
  scan_radius_miles?: number | null;
}

export interface Competitor {
  id: string;
  business_id: string;
  name: string;
  url: string;
  page_urls: string[];
  status: CompetitorStatus;
  last_checked_at: string | null;
  last_error: string | null;
  created_at: string;
  // Optional nearby-search fields — omitted until those columns exist.
  address?: string | null;
  distance_miles?: number | null;
}

export interface Signal {
  id: string;
  business_id: string;
  competitor_id: string;
  snapshot_id: string | null;
  signal_type: SignalType;
  category: Category;
  impact: Impact;
  title: string;
  finding: string;
  why_it_matters: string;
  recommended_action: string;
  evidence: string | null;
  is_read: boolean;
  created_at: string;
}

export interface SignalWithCompetitor extends Signal {
  competitors: { name: string } | null;
}

export interface NearbyOpeningHours {
  day: string;
  hours: string;
}

export interface NearbyCompetitor {
  name: string;
  category: string | null;
  address: string | null;
  neighborhood: string | null;
  website: string | null;
  google_maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_miles: number | null;
  rating: number | null;
  reviews_count: number;
  price: string | null;
  image_url: string | null;
  opening_hours: NearbyOpeningHours[];
  place_id: string | null;
  can_monitor: boolean;
}

export interface DiscoverNearbyRequest {
  business_name: string;
  address: string;
  radius_miles: number;
  search_term: string;
  // Fallback only — the workflow geocodes `address` when these are absent.
  latitude?: number;
  longitude?: number;
}

export interface DiscoverNearbyResponse {
  business_name: string;
  radius_miles: number;
  count: number;
  competitors: NearbyCompetitor[];
}
