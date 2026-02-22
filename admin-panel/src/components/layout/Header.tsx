'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Select,
  FormControl,
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Fullscreen,
  FullscreenExit,
  LightMode,
  DarkMode,
  Person,
  Logout,
  Close,
  ChevronRight,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/auth';
import { useTabsStore } from '@/store/tabs';
import { useRouter, usePathname } from 'next/navigation';
import { LAYOUT, Z_INDEX } from './constants';
import { navConfig } from './nav-config';
import { isNavLink, hasNavChildren } from './types';

const APP_VERSION = '2.2.0';

/** Flatten nav config into searchable routes with breadcrumb context */
function flattenRoutes(
  items: typeof navConfig,
  parents: string[] = []
): { label: string; path: string; breadcrumb: string; icon?: React.ReactNode }[] {
  const result: { label: string; path: string; breadcrumb: string; icon?: React.ReactNode }[] = [];
  for (const item of items) {
    if (isNavLink(item)) {
      result.push({
        label: item.label,
        path: item.path,
        breadcrumb: [...parents, item.label].join(' > '),
        icon: item.icon,
      });
    } else if (hasNavChildren(item)) {
      result.push(
        ...flattenRoutes(item.children as typeof navConfig, [...parents, item.label])
      );
    }
  }
  return result;
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { tabs, activeTabId, closeTab, setActive, getActive, addTab } = useTabsStore();
  const [language, setLanguage] = useState('en');
  const [fullscreen, setFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTab = getActive();
  const allRoutes = useMemo(() => flattenRoutes(navConfig), []);
  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return allRoutes.slice(0, 12);
    const q = searchQuery.trim().toLowerCase();
    return allRoutes
      .filter((r) => r.label.toLowerCase().includes(q) || r.path.toLowerCase().includes(q) || r.breadcrumb.toLowerCase().includes(q))
      .slice(0, 12);
  }, [allRoutes, searchQuery]);

  useEffect(() => {
    const match = tabs.find((t) => t.path === pathname);
    if (match) setActive(match.id);
  }, [pathname, tabs, setActive]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
    router.refresh();
    setAnchorEl(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleTabClick = (tab: { id: string; path: string }) => {
    setActive(tab.id);
    router.push(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent, tab: { id: string; path: string }) => {
    e.stopPropagation();
    const idx = tabs.findIndex((t) => t.id === tab.id);
    const remaining = tabs.filter((t) => t.id !== tab.id);
    const next = remaining[Math.max(0, idx - 1)] ?? remaining[0];
    closeTab(tab.id);
    if (activeTabId === tab.id && next) router.push(next.path);
  };

  const handleSearchSelect = (path: string, label: string, breadcrumb: string) => {
    const breadcrumbs = ['Home', ...breadcrumb.split(' > ')];
    addTab({ id: path, label, path, breadcrumbs });
    router.push(path);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: Z_INDEX.HEADER,
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          minHeight: { xs: 56, sm: 60, md: 64 },
          px: { xs: 1.5, sm: 2, md: 2.5 },
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Left: Menu + Breadcrumbs */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flex: { xs: '1 1 100%', sm: '0 1 auto' },
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          {onMenuClick && (
            <IconButton
              onClick={onMenuClick}
              edge="start"
              size="medium"
              aria-label="Toggle menu"
              sx={{
                display: { xs: 'inline-flex', lg: 'none' },
                flexShrink: 0,
                color: 'text.secondary',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Breadcrumbs
            separator={<ChevronRight sx={{ fontSize: 16, color: 'action.disabled' }} />}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              fontSize: 13,
              '& .MuiBreadcrumbs-separator': { mx: 0.5 },
            }}
          >
            {activeTab?.breadcrumbs.map((b, i) => (
              <Typography
                key={`${b}-${i}`}
                variant="body2"
                color={i === activeTab.breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: i === activeTab.breadcrumbs.length - 1 ? 600 : 400,
                  fontSize: 13,
                }}
              >
                {b}
              </Typography>
            ))}
          </Breadcrumbs>
        </Box>

        {/* Center: Tab bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            flex: { xs: '1 1 100%', sm: '1 1 auto' },
            minWidth: 0,
            maxWidth: { sm: 400, md: 480 },
            overflowX: 'auto',
            overflowY: 'hidden',
            py: 0.75,
            order: { xs: 3, sm: 2 },
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-track': { bgcolor: 'action.hover' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'action.disabled', borderRadius: 2 },
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <Chip
                key={tab.id}
                label={tab.label}
                size="small"
                onClick={() => handleTabClick(tab)}
                onDelete={tabs.length > 1 ? (e) => handleCloseTab(e, tab) : undefined}
                deleteIcon={<Close sx={{ fontSize: 14 }} />}
                sx={{
                  height: { xs: 28, sm: 32 },
                  fontSize: { xs: 12, sm: 13 },
                  fontWeight: isActive ? 600 : 500,
                  bgcolor: isActive ? 'primary.main' : 'action.hover',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.selected',
                  },
                  '& .MuiChip-deleteIcon': {
                    color: isActive ? 'rgba(255,255,255,0.8)' : 'inherit',
                    '&:hover': { color: 'inherit' },
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Right: Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setSearchOpen(true)}
            aria-label="Search menus and routes"
            sx={{ color: 'text.secondary' }}
          >
            <SearchIcon />
          </IconButton>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ display: { xs: 'none', md: 'block' }, fontSize: 11 }}
          >
            v{APP_VERSION}
          </Typography>
          <FormControl size="small" sx={{ minWidth: { xs: 72, sm: 88 } }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              variant="outlined"
              sx={{
                height: { xs: 32, sm: 36 },
                fontSize: { xs: 12, sm: 13 },
                '& .MuiSelect-select': { py: 0.75 },
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="zh">Chinese</MenuItem>
              <MenuItem value="es">ES</MenuItem>
              <MenuItem value="ar">AR</MenuItem>
            </Select>
          </FormControl>
          <IconButton size="small" onClick={toggleFullscreen} aria-label="Fullscreen" sx={{ color: 'text.secondary' }}>
            {fullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton size="small" onClick={() => setDarkMode(!darkMode)} aria-label="Theme" sx={{ color: 'text.secondary' }}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
          <Box
            component="button"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              px: 1.25,
              py: 0.75,
              borderRadius: 1.5,
              ml: 0.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 13, fontWeight: 500 }}
            >
              Administrator
            </Typography>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              HT
            </Box>
          </Box>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            router.push('/dashboard/profile');
          }}
          sx={{ py: 1.25 }}
        >
          <Person sx={{ mr: 1.5, fontSize: 20, color: 'action.active' }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: 'error.main' }}>
          <Logout sx={{ mr: 1.5, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Search menus / routes */}
      <Dialog
        open={searchOpen}
        onClose={() => { setSearchOpen(false); setSearchQuery(''); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            mt: { xs: 0, sm: '10vh' },
            maxHeight: { xs: '100%', sm: '80vh' },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <TextField
            fullWidth
            placeholder="Search menus and routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'action.hover' } }}
          />
        </DialogTitle>
        <DialogContent sx={{ pt: 1, px: 0 }}>
          <List dense disablePadding>
            {filteredRoutes.map((r) => (
              <ListItemButton
                key={r.path}
                onClick={() => handleSearchSelect(r.path, r.label, r.breadcrumb)}
                sx={{ py: 1, px: 2 }}
              >
                {r.icon && <ListItemIcon sx={{ minWidth: 40 }}>{r.icon}</ListItemIcon>}
                <ListItemText
                  primary={r.label}
                  secondary={r.breadcrumb}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                  secondaryTypographyProps={{ fontSize: 12, color: 'text.secondary' }}
                />
              </ListItemButton>
            ))}
          </List>
          {filteredRoutes.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              {searchQuery.trim() ? 'No matching routes found' : 'Type to search menus...'}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}
