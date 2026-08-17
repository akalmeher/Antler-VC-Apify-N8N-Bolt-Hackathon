export type PriceTier = '$' | '$$' | '$$$' | '$$$$';

export type OpportunityLevel = 'BEST OPPORTUNITY' | 'MODERATE OVERLAP' | 'HIGH COMPETITION';

export type SignalType = 'new_opening' | 'menu_price_change' | 'review_complaint' | 'permit_expansion';

export interface MenuItem {
  name: string;
  price: number;
  category: 'Appetizers & Starters' | 'Main Dishes' | 'Pizzas' | 'Pastas' | 'Cocktails & Drinks';
  description?: string;
  isPopular?: boolean;
}

export interface RestaurantSignal {
  id: string;
  restaurantId: string;
  restaurantName: string;
  type: SignalType;
  source: string;
  title: string;
  description: string;
  detectedAt: string;
  opportunityScore: number;
  actionableInsight: string;
  sourceUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  domain: string;
  imageUrl?: string;
  cuisine: string;
  priceTier: PriceTier;
  avgEntreePrice: number;
  rating: number;
  reviewCount: number;
  address: string;
  neighborhood: string; // e.g. "Mission District, SF (0.3 mi)"
  distanceMiles: number;
  status: 'Open & Active' | 'Opening Soon' | 'Recently Closed';
  opportunityLevel: OpportunityLevel;
  menuHighlights: MenuItem[];
  customerDislikes: string[]; // Plain English customer complaints
  signals: RestaurantSignal[];
  primaryOpportunity?: string;
  winningStrategy?: string; // Plain English advice for non-tech user
}

export interface RestaurantInputPayload {
  restaurantDomain?: string;
  restaurantName: string;
  cuisine?: string;
  priceTier?: PriceTier;
  address?: string;
  neighborhood?: string;
  type: SignalType;
  source: string;
  title: string;
  description: string;
  sourceUrl?: string;
  actionableInsight?: string;
}

export interface MarketSummary {
  totalRestaurants: number;
  avgPlateCost: number;
  priceRange: string;
  topCuisine: string;
  topOpportunitySummary: string;
}
