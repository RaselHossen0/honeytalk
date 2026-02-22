/**
 * Admin panel layout components and utilities.
 *
 * Structure:
 * - Sidebar: Main navigation sidebar
 * - Header / DashboardHeader: Top app bar with tabs and user menu
 * - constants: Shared layout dimensions and z-indices
 * - nav-config: Navigation configuration
 * - nav-utils: Path/tab mapping utilities
 * - types: Navigation type definitions
 */

export { Sidebar } from './Sidebar';
export { Header } from './Header';
export { Header as DashboardHeader } from './Header';
export { LAYOUT, Z_INDEX } from './constants';
export { navConfig } from './nav-config';
export { buildPathTabMap } from './nav-utils';
export type { NavItem, NavLink, NavGroup, NavSection, NavChild } from './types';
export type { PathTabInfo } from './nav-utils';
