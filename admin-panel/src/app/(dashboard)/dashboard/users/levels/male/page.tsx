'use client';

import { useTabsStore } from '@/store/tabs';
import { LevelListContent } from '../LevelListContent';

export default function MaleLevelsPage() {
  const addTab = useTabsStore((s) => s.addTab);

  return (
    <LevelListContent
      gender="male"
      tabLabel="Male Levels"
      tabPath="/dashboard/users/levels/male"
      breadcrumbs={['Home', 'User Management', 'Level Management', 'Male']}
      onAddTab={addTab}
    />
  );
}
