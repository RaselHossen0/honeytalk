/**
 * Role Management API service.
 * Replace demo data with actual api calls when backend is ready.
 */

import type { Role, RoleCreate, RoleUpdate, RoleFilters } from '@/types/role';
import { ROLES_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/system/roles';

export async function fetchRoles(
  filters?: RoleFilters,
  page = 1,
  perPage = 10
): Promise<{ data: Role[]; total: number }> {
  // TODO: return api.get<{ data: Role[]; total: number }>(`${ENDPOINT}?page=${page}&perPage=${perPage}&roleName=${filters?.roleName ?? ''}`, token)
  let data = [...ROLES_DEMO];
  if (filters?.roleName) {
    data = data.filter((r) =>
      r.roleName.toLowerCase().includes(filters.roleName!.toLowerCase())
    );
  }
  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}

export async function createRole(body: RoleCreate): Promise<Role> {
  // TODO: return api.post<Role>(ENDPOINT, body, token)
  const id = Math.max(...ROLES_DEMO.map((r) => r.id), 0) + 1;
  return {
    id,
    roleCode: body.roleCode,
    roleName: body.roleName,
    note: body.note ?? '',
    contacted: true,
    disconnected: true,
    status: body.status ?? 'Unban',
    canDelete: true,
    canEditPermissions: true,
  };
}

export async function updateRole(id: number, body: RoleUpdate): Promise<Role> {
  // TODO: return api.put<Role>(`${ENDPOINT}/${id}`, body, token)
  const existing = ROLES_DEMO.find((r) => r.id === id) ?? ROLES_DEMO[0];
  return { ...existing, ...body };
}

export async function deleteRole(id: number): Promise<void> {
  // TODO: await api.delete(`${ENDPOINT}/${id}`, token)
}
