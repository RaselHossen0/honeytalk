/** API-ready types for Task Management */

export type TaskType =
  | 'Share anchor tasks'
  | 'Online tasks'
  | 'Follow streamer tasks'
  | 'Rewarding Anchor Task'
  | 'Game task';

export interface Task {
  id: number;
  number: number;
  title: string;
  description?: string;
  type: TaskType;
  targetQuantity: number;
  rewardAmount: number;
  taskTimes: number;
  timeInterval: number;
  status: 'Valid' | 'Invalid';
}

export interface TaskCreate {
  title: string;
  description?: string;
  type: TaskType;
  targetQuantity: number;
  rewardAmount: number;
  taskTimes: number;
  timeInterval: number;
  status?: 'Valid' | 'Invalid';
}

export interface TaskUpdate extends Partial<TaskCreate> {}
