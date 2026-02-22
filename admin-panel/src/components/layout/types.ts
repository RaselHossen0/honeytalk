/**
 * Navigation structure types for the admin sidebar.
 */

import type { ReactNode } from 'react';

/** Leaf navigation item with a route path */
export interface NavLink {
  label: string;
  path: string;
  icon?: ReactNode;
}

/** Alias for leaf navigation items (used in rendering) */
export type NavChild = NavLink;

/** Group of navigation items (expandable section) */
export interface NavGroup {
  label: string;
  icon: ReactNode;
  children: (NavLink | NavGroup)[];
}

/** Top-level navigation section */
export interface NavSection {
  label: string;
  icon: ReactNode;
  children: (NavLink | NavGroup)[];
}

/** Root navigation item - can be a direct link or a section with children */
export type NavItem =
  | { label: string; path: string; icon: ReactNode }
  | { label: string; icon: ReactNode; children: (NavSection | NavLink)[] };

/** Type guard: item has path (is a link) */
export function isNavLink(item: NavLink | NavGroup | NavSection): item is NavLink {
  return 'path' in item && typeof (item as NavLink).path === 'string';
}

/** Type guard: item has children (is a group/section) */
export function hasNavChildren(item: NavLink | NavGroup | NavSection): item is NavGroup | NavSection {
  return 'children' in item && Array.isArray((item as NavGroup).children);
}
