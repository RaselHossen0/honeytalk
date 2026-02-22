/**
 * Encryption Key Configuration API service.
 * Replace demo data with actual api calls when backend is ready.
 */

// import { api } from '@/lib/api';
// import { useAuthStore } from '@/store/auth';
import type {
  EncryptionKeyConfig,
  EncryptionKeyConfigCreate,
  EncryptionKeyConfigUpdate,
} from '@/types/encryption-key';
import { ENCRYPTION_KEYS_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/system/encryption-keys';

/** Use demo data. Replace with: api.get<{ data: EncryptionKeyConfig[]; total: number }>(...) */
export async function fetchEncryptionKeys(page = 1, perPage = 10): Promise<{
  data: EncryptionKeyConfig[];
  total: number;
}> {
  // const token = useAuthStore.getState().token;
  // TODO: api.get<{ data: EncryptionKeyConfig[]; total: number }>(`${ENDPOINT}?page=${page}&perPage=${perPage}`, token)
  const data = [...ENCRYPTION_KEYS_DEMO];
  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}

/** Use demo data. Replace with: api.post(ENDPOINT, body, token) */
export async function createEncryptionKey(body: EncryptionKeyConfigCreate): Promise<EncryptionKeyConfig> {
  // const token = useAuthStore.getState().token;
  // TODO: return api.post<EncryptionKeyConfig>(ENDPOINT, body, token)
  const id = Math.max(...ENCRYPTION_KEYS_DEMO.map((r) => r.id), 0) + 1;
  const number = Math.max(...ENCRYPTION_KEYS_DEMO.map((r) => r.number), 0) + 1;
  return {
    id,
    number,
    key: body.key,
    packingAndFilling: body.packingAndFilling,
    valid: body.valid,
  };
}

/** Use demo data. Replace with: api.put(`${ENDPOINT}/${id}`, body, token) */
export async function updateEncryptionKey(id: number, body: EncryptionKeyConfigUpdate): Promise<EncryptionKeyConfig> {
  // const token = useAuthStore.getState().token;
  // TODO: return api.put<EncryptionKeyConfig>(`${ENDPOINT}/${id}`, body, token)
  const existing = ENCRYPTION_KEYS_DEMO.find((r) => r.id === id) ?? ENCRYPTION_KEYS_DEMO[0];
  return { ...existing, ...body };
}

/** Use demo data. Replace with: api.delete(`${ENDPOINT}/${id}`, token) */
export async function deleteEncryptionKey(id: number): Promise<void> {
  // const token = useAuthStore.getState().token;
  // TODO: await api.delete(`${ENDPOINT}/${id}`, token)
}
