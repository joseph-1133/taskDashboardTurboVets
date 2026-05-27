import { TaskStatus } from "./taskStatus";

export interface Task {
  id: number|string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: TaskStatus;
  category: string;
}