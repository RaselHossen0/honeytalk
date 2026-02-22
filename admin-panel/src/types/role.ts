/** API-ready types for Role Management */

export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  note: string;
  contacted: boolean;
  disconnected: boolean;
  status: 'Ban' | 'Unban';
  canDelete?: boolean;
  canEditPermissions?: boolean;
}

export interface RoleCreate {
  roleCode: string;
  roleName: string;
  note?: string;
  status?: 'Ban' | 'Unban';
}

export interface RoleUpdate extends Partial<RoleCreate> {}

export interface RoleFilters {
  roleName?: string;
}
