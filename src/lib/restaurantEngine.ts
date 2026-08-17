import type { Restaurant, SignalType, OpportunityLevel, MarketSummary } from '../types';

export function calculateMarketSummary(restaurants: Restaurant[]): MarketSummary {
  if (!restaurants || restaurants.length === 0) {
    return {
      totalRestaurants: 0,
      avgPlateCost: 28,
      priceRange: '$14 - $42',
      topCuisine: 'Italian & Pizza',
      topOpportunitySummary: 'Accept online reservations & offer gluten-free crusts to capture overflow crowds in Mission District.',
    };
  }

  const totalPrice = restaurants.reduce((acc, r) => acc + r.avgEntreePrice, 0);
  const avgPlateCost = Math.round(totalPrice / restaurants.length);

  const cuisineCounts: Record<string, number> = {};
  restaurants.forEach((r) => {
    cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
  });

  let topCuisine = 'Italian & Pizza';
  let maxCount = 0;
  Object.entries(cuisineCounts).forEach(([cuisine, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCuisine = cuisine;
    }
  });

  const prices = restaurants.map((r) => r.avgEntreePrice);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);

  return {
    totalRestaurants: restaurants.length,
    avgPlateCost,
    priceRange: `$${minP} - $${maxP}`,
    topCuisine,
    topOpportunitySummary: 'High customer frustration over 2-hour wait times & mandatory service fees in Mission District.',
  };
}

export function generatePlainEnglishInsight(
  type: SignalType,
  restaurantName: string,
  title: string,
  _description: string
): { opportunityScore: number; actionableInsight: string; strategy: string } {
  switch (type) {
    case 'review_complaint': {
      return {
        opportunityScore: 92,
        actionableInsight: `Customers at ${restaurantName} are complaining online ("${title}").`,
        strategy: `Solve their biggest frustration by taking online reservations and offering faster table service.`,
      };
    }
    case 'menu_price_change': {
      return {
        opportunityScore: 78,
        actionableInsight: `${restaurantName} recently raised their prices ("${title}").`,
        strategy: `Offer high-quality entrees in the $20-$24 range to attract local diners looking for fair value.`,
      };
    }
    case 'new_opening': {
      return {
        opportunityScore: 85,
        actionableInsight: `A new restaurant concept is opening nearby: ${restaurantName} ("${title}").`,
        strategy: `Host a pre-opening tasting event and highlight your unique local menu to build customer loyalty early.`,
      };
    }
    case 'permit_expansion': {
      return {
        opportunityScore: 70,
        actionableInsight: `${restaurantName} is expanding their space ("${title}").`,
        strategy: `Create a cozy outdoor seating area or late-night cocktail special to compete for neighborhood foot traffic.`,
      };
    }
    default: {
      return {
        opportunityScore: 75,
        actionableInsight: `New update at ${restaurantName}: ${title}.`,
        strategy: `Focus on warm hospitality, fresh ingredients, and reliable service.`,
      };
    }
  }
}

export function classifyOpportunityLevel(
  cuisine: string,
  _priceTier: string,
  distanceMiles: number
): OpportunityLevel {
  if (distanceMiles <= 0.5 && (cuisine.toLowerCase().includes('italian') || cuisine.toLowerCase().includes('pizza'))) {
    return 'HIGH COMPETITION';
  }
  if (distanceMiles <= 1.0) {
    return 'MODERATE OVERLAP';
  }
  return 'BEST OPPORTUNITY';
}
