import { Task } from "../models/task.model"

export interface ITaskService {
  createTask(task: Omit<Task, "id">): Promise<Task>
  deleteTask(id: string): Promise<Task[]>
  deleteAll(): Promise<void>
  getTask(id: string): Promise<Task | undefined>
  getTasks(): Promise<Task[]>
  updateTask(id: string, task: Omit<Task, "id">): Promise<Task>
}
