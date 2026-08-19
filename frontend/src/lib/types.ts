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
