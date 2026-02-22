/**
 * API service stubs for admin entities.
 * Replace with actual API calls when backend is ready.
 * Same interfaces ensure easy integration.
 */

import type { AdvertisingConfig, AdvertisingConfigCreate, AdvertisingConfigUpdate } from '@/types/advertising';
import type { ExchangeRule, ExchangeRuleCreate, ExchangeRuleUpdate } from '@/types/exchange';
import type { PurchaseRule, PurchaseRuleCreate, PurchaseRuleUpdate } from '@/types/purchase';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Advertising Configuration */
export async function fetchAdvertisings(): Promise<AdvertisingConfig[]> {
  await delay(300);
  return [];
}

export async function createAdvertising(data: AdvertisingConfigCreate): Promise<AdvertisingConfig> {
  await delay(300);
  throw new Error('API not connected');
}

export async function updateAdvertising(id: string | number, data: AdvertisingConfigUpdate): Promise<AdvertisingConfig> {
  await delay(300);
  throw new Error('API not connected');
}

export async function deleteAdvertising(id: string | number): Promise<void> {
  await delay(300);
  throw new Error('API not connected');
}

/** Exchange Rules */
export async function fetchExchangeRules(): Promise<ExchangeRule[]> {
  await delay(300);
  return [];
}

export async function createExchangeRule(data: ExchangeRuleCreate): Promise<ExchangeRule> {
  await delay(300);
  throw new Error('API not connected');
}

export async function updateExchangeRule(id: string | number, data: ExchangeRuleUpdate): Promise<ExchangeRule> {
  await delay(300);
  throw new Error('API not connected');
}

export async function deleteExchangeRule(id: string | number): Promise<void> {
  await delay(300);
  throw new Error('API not connected');
}

/** Purchase Rules */
export async function fetchPurchaseRules(): Promise<PurchaseRule[]> {
  await delay(300);
  return [];
}

export async function createPurchaseRule(data: PurchaseRuleCreate): Promise<PurchaseRule> {
  await delay(300);
  throw new Error('API not connected');
}

export async function updatePurchaseRule(id: string | number, data: PurchaseRuleUpdate): Promise<PurchaseRule> {
  await delay(300);
  throw new Error('API not connected');
}

export async function deletePurchaseRule(id: string | number): Promise<void> {
  await delay(300);
  throw new Error('API not connected');
}
