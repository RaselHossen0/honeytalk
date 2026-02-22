'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTabsStore } from '@/store/tabs';
import { LAYOUT, Z_INDEX } from './constants';
import { navConfig } from './nav-config';
import { buildPathTabMap } from './nav-utils';
import type { NavChild, NavGroup, NavSection } from './types';
import { isNavLink, hasNavChildren } from './types';

const PATH_TAB_MAP = buildPathTabMap();

/** Sidebar color palette - professional slate theme */
const SIDEBAR_COLORS = {
  bg: '#0f172a',
  bgHover: 'rgba(148, 163, 184, 0.08)',
  bgActive: 'rgba(99, 102, 241, 0.15)',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  border: 'rgba(255, 255, 255, 0.06)',
  iconMuted: '#64748b',
  accent: '#6366f1',
} as const;

interface NavLinkButtonProps {
  item: NavChild;
  pathname: string;
  onNavigate: (path: string, label: string) => void;
  depth?: number;
}

function NavLinkButton({ item, pathname, onNavigate, depth = 0 }: NavLinkButtonProps) {
  const isActive = pathname === item.path;
  const pl = 2 + depth * 2;

  return (
    <ListItem disablePadding sx={{ py: 0.2 }}>
      <ListItemButton
        component="div"
        selected={isActive}
        onClick={() => onNavigate(item.path, item.label)}
        sx={{
          pl: `${pl * 8}px`,
          py: 1,
          mx: 1,
          borderRadius: 1.5,
          minHeight: 40,
          transition: 'background-color 0.15s ease',
          '&.Mui-selected': {
            bgcolor: SIDEBAR_COLORS.bgActive,
            borderLeft: '3px solid',
            borderColor: SIDEBAR_COLORS.accent,
            pl: `calc(${pl * 8}px - 3px)`,
            '& .MuiListItemIcon-root': { color: SIDEBAR_COLORS.accent },
            '& .MuiTypography-root': { color: SIDEBAR_COLORS.text, fontWeight: 500 },
          },
          '&:hover:not(.Mui-selected)': { bgcolor: SIDEBAR_COLORS.bgHover },
        }}
      >
        {item.icon && (
          <ListItemIcon sx={{ color: SIDEBAR_COLORS.iconMuted, minWidth: 36 }}>{item.icon}</ListItemIcon>
        )}
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontSize: 13,
            color: isActive ? SIDEBAR_COLORS.text : SIDEBAR_COLORS.textMuted,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

function hasActiveChild(
  items: (NavChild | NavGroup)[],
  pathname: string
): boolean {
  return items.some((c) => {
    if (isNavLink(c)) return pathname === c.path;
    return hasNavChildren(c) && hasActiveChild(c.children as (NavChild | NavGroup)[], pathname);
  });
}

interface SidebarProps {
  onNavigateClose?: () => void;
}

export function Sidebar({ onNavigateClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const addTab = useTabsStore((s) => s.addTab);
  const tabs = useTabsStore((s) => s.tabs);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = useCallback((label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const handleNavigate = useCallback(
    (path: string, label: string, breadcrumbs: string[]) => {
      addTab({
        id: path === '/dashboard' ? 'home' : path,
        label,
        path,
        breadcrumbs,
      });
      router.push(path);
      onNavigateClose?.();
    },
    [addTab, router, onNavigateClose]
  );

  // Sync tabs when pathname changes (direct URL, refresh, back/forward)
  useEffect(() => {
    if (!pathname || pathname === '/login') return;
    const info = PATH_TAB_MAP.get(pathname);
    if (info && !tabs.some((t) => t.path === pathname)) {
      addTab({
        id: pathname === '/dashboard' ? 'home' : pathname,
        label: info.label,
        path: pathname,
        breadcrumbs: info.breadcrumbs,
      });
    }
  }, [pathname, tabs, addTab]);

  const renderNav = (
    item: NavChild | NavGroup | NavSection,
    sectionLabel: string,
    depth = 0,
    expandKeyPrefix = ''
  ): React.ReactNode => {
    if (isNavLink(item)) {
      return (
        <NavLinkButton
          key={item.path}
          item={item}
          pathname={pathname}
          onNavigate={(path, label) =>
            handleNavigate(path, label, PATH_TAB_MAP.get(path)?.breadcrumbs ?? ['Home', sectionLabel, label])
          }
          depth={depth}
        />
      );
    }

    const expandKey = expandKeyPrefix ? `${expandKeyPrefix}|${item.label}` : item.label;
    const isOpen = expanded[expandKey] ?? false;
    const active = hasNavChildren(item) && hasActiveChild(item.children as (NavChild | NavGroup)[], pathname);
    const pl = 2 + depth * 2;

    const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
      if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      toggle(expandKey);
    };

    return (
      <ListItem
        key={expandKey}
        disablePadding
        sx={{ flexDirection: 'column', alignItems: 'stretch', py: 0.2 }}
      >
        <Box
          component="div"
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={handleToggle}
          sx={{
            display: 'flex',
            alignItems: 'center',
            pl: `${pl * 8}px`,
            py: 1,
            pr: 1,
            mx: 1,
            borderRadius: 1.5,
            minHeight: 40,
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background-color 0.15s ease',
            bgcolor: active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            '&:hover': { bgcolor: SIDEBAR_COLORS.bgHover },
          }}
        >
          <ListItemIcon sx={{ color: SIDEBAR_COLORS.iconMuted, minWidth: 36 }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{ fontSize: 13, color: SIDEBAR_COLORS.textMuted }}
          />
          {isOpen ? (
            <ExpandLess sx={{ fontSize: 18, ml: 'auto', color: SIDEBAR_COLORS.iconMuted }} />
          ) : (
            <ExpandMore sx={{ fontSize: 18, ml: 'auto', color: SIDEBAR_COLORS.iconMuted }} />
          )}
        </Box>
        <Collapse in={isOpen} timeout={LAYOUT.TRANSITION_DURATION} sx={{ width: '100%' }}>
          <List disablePadding>
            {item.children?.map((child) =>
              renderNav(child as NavChild | NavGroup, sectionLabel, depth + 1, expandKey)
            )}
          </List>
        </Collapse>
      </ListItem>
    );
  };

  return (
    <Box
      component="aside"
      role="navigation"
      aria-label="Admin sidebar"
      sx={{
        width: LAYOUT.SIDEBAR_WIDTH,
        minWidth: LAYOUT.SIDEBAR_WIDTH,
        flexShrink: 0,
        bgcolor: SIDEBAR_COLORS.bg,
        color: SIDEBAR_COLORS.text,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRight: '1px solid',
        borderColor: SIDEBAR_COLORS.border,
      }}
    >
      {/* Brand header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid',
          borderColor: SIDEBAR_COLORS.border,
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" fontWeight={700} color="white" sx={{ letterSpacing: '-0.02em' }}>
          HoneyTalk
        </Typography>
        <Typography variant="caption" color={SIDEBAR_COLORS.textMuted} sx={{ fontSize: 12, mt: 0.25 }}>
          Admin Panel
        </Typography>
      </Box>

      {/* Navigation list */}
      <List
        disablePadding
        component="ul"
        sx={{
          py: 2,
          px: 0.5,
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.2)' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
        }}
      >
        {navConfig.map((item) => {
          if (isNavLink(item)) {
            return (
              <ListItem key={item.label} disablePadding sx={{ my: 0.25 }}>
                <ListItemButton
                  component="div"
                  selected={pathname === item.path}
                  onClick={() => handleNavigate(item.path, item.label, ['Home'])}
                  sx={{
                    mx: 1,
                    borderRadius: 1.5,
                    py: 1.25,
                    minHeight: 44,
                    transition: 'all 0.15s ease',
                    '&.Mui-selected': {
                      bgcolor: SIDEBAR_COLORS.bgActive,
                      color: '#a5b4fc',
                      '& .MuiListItemIcon-root': { color: SIDEBAR_COLORS.accent },
                    },
                    '&:hover:not(.Mui-selected)': { bgcolor: SIDEBAR_COLORS.bgHover },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: pathname === item.path ? 600 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          }

          const isOpen = expanded[item.label] ?? false;
          const active = item.children?.some(
            (s) =>
              (isNavLink(s) && pathname === s.path) ||
              (hasNavChildren(s) && hasActiveChild(s.children as (NavChild | NavGroup)[], pathname))
          ) ?? false;

          const handleTopLevelToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
            if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            e.stopPropagation();
            toggle(item.label);
          };

          return (
            <ListItem key={item.label} disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch', my: 0.25 }}>
              <Box
                component="div"
                role="button"
                tabIndex={0}
                onClick={handleTopLevelToggle}
                onKeyDown={handleTopLevelToggle}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mx: 1,
                  borderRadius: 1.5,
                  py: 1.25,
                  px: 1.5,
                  minHeight: 44,
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease',
                  bgcolor: active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  '&:hover': { bgcolor: SIDEBAR_COLORS.bgHover },
                }}
              >
                <ListItemIcon sx={{ color: SIDEBAR_COLORS.iconMuted, minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: SIDEBAR_COLORS.textMuted }}
                />
                {isOpen ? (
                  <ExpandLess sx={{ ml: 'auto', color: SIDEBAR_COLORS.iconMuted }} />
                ) : (
                  <ExpandMore sx={{ ml: 'auto', color: SIDEBAR_COLORS.iconMuted }} />
                )}
              </Box>
              <Collapse in={isOpen} timeout={LAYOUT.TRANSITION_DURATION} sx={{ width: '100%' }}>
                <List disablePadding>
                  {item.children?.map((section) =>
                    hasNavChildren(section) ? (
                      renderNav(section as NavGroup, item.label, 1, item.label)
                    ) : (
                      <NavLinkButton
                        key={(section as NavChild).path}
                        item={section as NavChild}
                        pathname={pathname}
                        onNavigate={(path, label) =>
                          handleNavigate(path, label, ['Home', item.label, label])
                        }
                        depth={1}
                      />
                    )
                  )}
                </List>
              </Collapse>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
