import { supabase } from '@/lib/supabase';
import { BUSINESS_ID, N8N_WEBHOOK_BASE_URL } from '@/lib/config';
import type { Business, Competitor, SignalWithCompetitor } from '@/lib/types';

export async function fetchBusiness(): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, category, city, offerings, created_at')
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
