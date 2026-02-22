import { create } from 'zustand';

const MAX_TABS = 15;

export interface Tab {
  id: string;
  label: string;
  path: string;
  breadcrumbs: string[];
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActive: (id: string) => void;
  getActive: () => Tab | null;
}

export const useTabsStore = create<TabsState>((set, get) => ({
  tabs: [{ id: 'home', label: 'Dashboard', path: '/dashboard', breadcrumbs: ['Home'] }],
  activeTabId: 'home',

  addTab: (tab) => {
    set((state) => {
      const byPath = state.tabs.findIndex((t) => t.path === tab.path);
      const byId = state.tabs.findIndex((t) => t.id === tab.id);

      if (byPath !== -1 || byId !== -1) {
        const existingIdx = byPath !== -1 ? byPath : byId;
        const existing = state.tabs[existingIdx];
        const mergedTab: Tab = {
          ...existing,
          ...tab,
          id: existing.id,
          path: existing.path,
        };
        const withoutExisting = state.tabs.filter((_, i) => i !== existingIdx);
        const newTabs = [...withoutExisting, mergedTab];
        return {
          tabs: newTabs,
          activeTabId: mergedTab.id,
        };
      }

      const newTabs = [...state.tabs, tab];
      const trimmed = newTabs.length > MAX_TABS ? newTabs.slice(-MAX_TABS) : newTabs;
      return {
        tabs: trimmed,
        activeTabId: tab.id,
      };
    });
  },

  closeTab: (id) => {
    const { tabs, activeTabId } = get();
    const idx = tabs.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const newTabs = tabs.filter((t) => t.id !== id);
    let newActive = activeTabId;
    if (activeTabId === id) {
      const nextTab = newTabs[idx] ?? newTabs[Math.max(0, idx - 1)] ?? newTabs[0];
      newActive = nextTab?.id ?? null;
    }
    set({ tabs: newTabs, activeTabId: newActive });
  },

  setActive: (id) => set({ activeTabId: id }),
  getActive: () => {
    const { tabs, activeTabId } = get();
    return tabs.find((t) => t.id === activeTabId) ?? null;
  },
}));
