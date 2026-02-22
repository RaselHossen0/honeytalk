/**
 * Task Management API service.
 * Replace demo data with actual api calls when backend is ready.
 */

import type { Task, TaskCreate, TaskUpdate } from '@/types/task';
import { TASKS_DEMO } from '@/lib/demo-data';

const ENDPOINT = '/tasks';

export async function fetchTasks(
  page = 1,
  perPage = 10
): Promise<{ data: Task[]; total: number }> {
  // TODO: return api.get<{ data: Task[]; total: number }>(...)
  const data = [...TASKS_DEMO];
  const total = data.length;
  const start = (page - 1) * perPage;
  return { data: data.slice(start, start + perPage), total };
}

export async function createTask(body: TaskCreate): Promise<Task> {
  // TODO: return api.post<Task>(ENDPOINT, body, token)
  const numbers = TASKS_DEMO.map((r) => r.number);
  const number = Math.max(...numbers, 0) + 1;
  const id = Math.max(...TASKS_DEMO.map((r) => r.id), 0) + 1;
  return {
    id,
    number,
    title: body.title,
    description: body.description,
    type: body.type,
    targetQuantity: body.targetQuantity,
    rewardAmount: body.rewardAmount,
    taskTimes: body.taskTimes,
    timeInterval: body.timeInterval,
    status: body.status ?? 'Valid',
  };
}

export async function updateTask(id: number, body: TaskUpdate): Promise<Task> {
  // TODO: return api.put<Task>(`${ENDPOINT}/${id}`, body, token)
  const existing = TASKS_DEMO.find((r) => r.id === id) ?? TASKS_DEMO[0];
  return { ...existing, ...body };
}

export async function deleteTask(id: number): Promise<void> {
  // TODO: await api.delete(`${ENDPOINT}/${id}`, token)
}
