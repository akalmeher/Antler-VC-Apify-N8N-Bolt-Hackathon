import type { Restaurant, RestaurantSignal, RestaurantInputPayload } from '../types';
import { INITIAL_RESTAURANTS, INITIAL_RESTAURANT_SIGNALS } from './seedData';
import { generatePlainEnglishInsight, classifyOpportunityLevel } from './restaurantEngine';

const RESTAURANTS_KEY = 'restaurant_scout_sf_places';
const SIGNALS_KEY = 'restaurant_scout_sf_signals';
const STORAGE_EVENT = 'restaurant_scout_sf_change';

function notifyListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  }
}

export function subscribeToStore(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => callback();
  window.addEventListener(STORAGE_EVENT, handler);
  return () => window.removeEventListener(STORAGE_EVENT, handler);
}

export function getRestaurants(): Restaurant[] {
  if (typeof window === 'undefined') return INITIAL_RESTAURANTS;
  
  const cached = localStorage.getItem(RESTAURANTS_KEY);
  if (!cached) {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(INITIAL_RESTAURANTS));
    localStorage.setItem(SIGNALS_KEY, JSON.stringify(INITIAL_RESTAURANT_SIGNALS));
    return INITIAL_RESTAURANTS;
  }
  
  try {
    const list: Restaurant[] = JSON.parse(cached);
    return list.sort((a, b) => a.distanceMiles - b.distanceMiles);
  } catch (e) {
    return INITIAL_RESTAURANTS;
  }
}

export function getSignals(): RestaurantSignal[] {
  if (typeof window === 'undefined') return INITIAL_RESTAURANT_SIGNALS;

  const cached = localStorage.getItem(SIGNALS_KEY);
  if (!cached) {
    return INITIAL_RESTAURANT_SIGNALS;
  }

  try {
    const list: RestaurantSignal[] = JSON.parse(cached);
    return list.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  } catch (e) {
    return INITIAL_RESTAURANT_SIGNALS;
  }
}

export function resetToSeedData(): { restaurants: Restaurant[]; signals: RestaurantSignal[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(INITIAL_RESTAURANTS));
    localStorage.setItem(SIGNALS_KEY, JSON.stringify(INITIAL_RESTAURANT_SIGNALS));
    notifyListeners();
  }
  return { restaurants: INITIAL_RESTAURANTS, signals: INITIAL_RESTAURANT_SIGNALS };
}

export function addRestaurantSignalPayload(payload: RestaurantInputPayload): { restaurant: Restaurant; signal: RestaurantSignal } {
  const restaurants = getRestaurants();
  const signals = getSignals();

  const name = payload.restaurantName.trim();
  const domain = payload.restaurantDomain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  let restaurant = restaurants.find((r) => r.name.toLowerCase() === name.toLowerCase() || r.domain.toLowerCase() === domain.toLowerCase());

  if (!restaurant) {
    restaurant = {
      id: `rest-sf-${Date.now()}`,
      name: name,
      domain: domain,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      cuisine: payload.cuisine || 'Italian & Pizza',
      priceTier: payload.priceTier || '$$$',
      avgEntreePrice: 28,
      rating: 4.5,
      reviewCount: 120,
      address: payload.address || 'Valencia St, San Francisco, CA',
      neighborhood: payload.neighborhood || 'Mission District, SF (0.3 mi away)',
      distanceMiles: 0.3,
      status: 'Open & Active',
      opportunityLevel: classifyOpportunityLevel(payload.cuisine || 'Italian', payload.priceTier || '$$$', 0.3),
      menuHighlights: [
        { name: 'Specialty House Entrée', price: 28, category: 'Main Dishes', isPopular: true },
        { name: 'Signature Cocktail', price: 16, category: 'Cocktails & Drinks' }
      ],
      customerDislikes: ['Long weekend wait times', 'No online reservations'],
      signals: [],
    };
    restaurants.push(restaurant);
  }

  const generated = generatePlainEnglishInsight(payload.type, restaurant.name, payload.title, payload.description);

  const newSignal: RestaurantSignal = {
    id: `sig-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    type: payload.type,
    source: payload.source,
    title: payload.title,
    description: payload.description,
    detectedAt: new Date().toISOString(),
    opportunityScore: generated.opportunityScore,
    actionableInsight: payload.actionableInsight || generated.actionableInsight,
    sourceUrl: payload.sourceUrl,
  };

  signals.unshift(newSignal);
  restaurant.signals.unshift(newSignal);
  restaurant.primaryOpportunity = generated.actionableInsight;
  restaurant.winningStrategy = generated.strategy;

  if (typeof window !== 'undefined') {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(restaurants));
    localStorage.setItem(SIGNALS_KEY, JSON.stringify(signals));
    notifyListeners();
  }

  return { restaurant, signal: newSignal };
}
