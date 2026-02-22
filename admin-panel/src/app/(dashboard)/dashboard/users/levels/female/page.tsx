'use client';

import { useTabsStore } from '@/store/tabs';
import { LevelListContent } from '../LevelListContent';

export default function FemaleLevelsPage() {
  const addTab = useTabsStore((s) => s.addTab);

  return (
    <LevelListContent
      gender="female"
      tabLabel="Female Levels"
      tabPath="/dashboard/users/levels/female"
      breadcrumbs={['Home', 'User Management', 'Level Management', 'Female']}
      onAddTab={addTab}
    />
  );
}
