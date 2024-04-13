import { validate } from "uuid"
import type { ITaskService } from "../interfaces/task.service"
import { Task } from "../models/task.model"

class TaskService implements ITaskService {
  private readonly tasks: Task[] = []
  createTask(entity: Omit<Task, "id">): Promise<Task> {
    const existingTask = this.tasks.find(
      (t) => t.title === entity.title && t.description === entity.description
    )
    if (existingTask) {
      return Promise.reject(new Error("Task already exists"))
    }
    const task = Task.create(entity)
    this.tasks.push(task)
    return Promise.resolve(task)
  }
  deleteTask(id: string): Promise<Task[]> {
    const errorMessage = this.commonValidation(id)
    if (errorMessage) return Promise.reject(new Error(errorMessage))
    const index = this.tasks.findIndex((t) => t.id === id)
    if (index < 0) {
      return Promise.reject(new Error("Task not found"))
    }
    this.tasks.splice(index, 1)
    return Promise.resolve(this.tasks)
  }
  getTask(id: string): Promise<Task | undefined> {
    const errorMessage = this.commonValidation(id)
    if (errorMessage) return Promise.reject(new Error(errorMessage))
    return Promise.resolve(this.tasks.find((t) => t.id === id))
  }
  getTasks(): Promise<Task[]> {
    return Promise.resolve(this.tasks)
  }
  updateTask(id: string, task: Omit<Partial<Task>, "id">): Promise<Task> {
    const errorMessage = this.commonValidation(id)
    if (errorMessage) return Promise.reject(new Error(errorMessage))
    const existingTask = this.tasks.find((t) => t.id === id)
    if (!existingTask) {
      return Promise.reject(new Error("Task not found"))
    }
    const updatedTask = { ...existingTask, ...task } as Task
    const index = this.tasks.findIndex((t) => t.id === id)
    this.tasks.splice(index, 1, updatedTask)
    return Promise.resolve(updatedTask)
  }

  public deleteAll(): Promise<void> {
    this.tasks.splice(0, this.tasks.length)
    return Promise.resolve()
  }

  private commonValidation(id: string): string {
    if (!id) return "Id is required"
    if (!validate(id)) return "Invalid ID"
    return ""
  }
}

let taskService: TaskService
export const getTaskService = (): TaskService => {
  if (!taskService) {
    taskService = new TaskService()
  }
  return taskService
}
