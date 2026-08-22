import { supabase } from '@/lib/supabase';
import { BUSINESS_ID, N8N_WEBHOOK_BASE_URL } from '@/lib/config';
import type {
  Business,
  Competitor,
  DiscoverNearbyRequest,
  DiscoverNearbyResponse,
  EditCompetitorRequest,
  EditCompetitorResponse,
  RemoveCompetitorResponse,
  RescanAllResponse,
  SignalWithCompetitor,
} from '@/lib/types';

export async function fetchBusiness(): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, category, city, address, offerings, created_at')
    .eq('id', BUSINESS_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchCompetitors(): Promise<Competitor[]> {
  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('business_id', BUSINESS_ID)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchCompetitor(id: string): Promise<Competitor | null> {
  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchSignals(): Promise<SignalWithCompetitor[]> {
  const { data, error } = await supabase
    .from('signals')
    .select('*, competitors(name)')
    .eq('business_id', BUSINESS_ID)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as SignalWithCompetitor[]) ?? [];
}

async function postWebhook(path: string, body: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${N8N_WEBHOOK_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`The scan service returned an error (${res.status}). Please try again.`);
  }
}

async function webhookJson<T>(
  path: string,
  body: Record<string, unknown>,
  method: 'POST' | 'PATCH' | 'DELETE',
): Promise<T> {
  const res = await fetch(`${N8N_WEBHOOK_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`The scan service returned an error (${res.status}). Please try again.`);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new Error('The scan service returned an unreadable response. Please try again.');
  }
}

async function postWebhookJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  return webhookJson<T>(path, body, 'POST');
}

export async function requestAddCompetitor(input: {
  name: string;
  url: string;
  page_urls: string[];
}): Promise<void> {
  await postWebhook('/webhook/add-competitor', {
    business_id: BUSINESS_ID,
    name: input.name,
    url: input.url,
    page_urls: input.page_urls,
  });
}

export async function requestRescan(competitorId: string): Promise<void> {
  await postWebhook('/webhook/rescan', { competitor_id: competitorId });
}

export async function rescanAllCompetitors(businessId: string): Promise<RescanAllResponse> {
  return postWebhookJson<RescanAllResponse>('/webhook/rescan-all', {
    business_id: businessId,
  });
}

export async function discoverNearbyCompetitors(
  input: DiscoverNearbyRequest,
): Promise<DiscoverNearbyResponse> {
  const data = await postWebhookJson<DiscoverNearbyResponse>('/webhook/discover-nearby', {
    business_name: input.business_name,
    address: input.address,
    radius_miles: input.radius_miles,
    search_term: input.search_term,
    ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
    ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
  });
  return {
    ...data,
    competitors: data.competitors ?? [],
  };
}

export async function editCompetitor(input: EditCompetitorRequest): Promise<EditCompetitorResponse> {
  return webhookJson<EditCompetitorResponse>(
    '/webhook/edit-competitor',
    {
      competitor_id: input.competitor_id,
      name: input.name,
      url: input.url,
      page_urls: input.page_urls,
    },
    'PATCH',
  );
}

export async function removeCompetitor(competitorId: string): Promise<RemoveCompetitorResponse> {
  return webhookJson<RemoveCompetitorResponse>(
    '/webhook/remove-competitor',
    { competitor_id: competitorId },
    'DELETE',
  );
}
