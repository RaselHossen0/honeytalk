import { navConfig } from './nav-config';
import type { NavGroup, NavSection } from './types';

export interface PathTabInfo {
  label: string;
  breadcrumbs: string[];
}

/** Build a flat map of path -> tab info for syncing tabs when pathname changes */
export function buildPathTabMap(): Map<string, PathTabInfo> {
  const map = new Map<string, PathTabInfo>();

  function walk(items: (NavSection | { path: string; label: string })[], parentCrumbs: string[]): void {
    for (const item of items) {
      if ('path' in item) {
        map.set(item.path, { label: item.label, breadcrumbs: [...parentCrumbs, item.label] });
      } else if ('children' in item) {
        const crumbs = [...parentCrumbs, item.label];
        walk((item as NavGroup).children as (NavSection | { path: string; label: string })[], crumbs);
      }
    }
  }

  navConfig.forEach((item) => {
    if ('path' in item) {
      map.set(item.path, { label: item.label, breadcrumbs: ['Home'] });
    } else if ('children' in item) {
      walk(item.children, ['Home', item.label]);
    }
  });

  return map;
}
