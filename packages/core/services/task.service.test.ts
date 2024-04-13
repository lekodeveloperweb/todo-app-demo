import { v4 as uuid } from "uuid"
import { ITaskService } from "../interfaces"
import { Task } from "../models/task.model"
import { getTaskService } from "./task.service"

describe("Task service", () => {
  let taskService: ITaskService = getTaskService()
  const mockData = { title: "test", description: "test" }
  beforeEach(async () => {
    await taskService.deleteAll()
  })

  it("should create a singleton service instance", () => {
    expect(taskService).toBeDefined()
    const newInstance = getTaskService()
    expect(taskService).toBe(newInstance)
  })
  it("should create a task", async () => {
    const response = await taskService.createTask(mockData)
    expect(response).toBeDefined()
    expect(response.id).toBeDefined()
    expect(response.title).toBe(mockData.title)
    expect(response.description).toBe(mockData.description)
  })
  it("should get a task", async () => {
    const task = await taskService.createTask(mockData)
    const response = await taskService.getTask(task.id)
    expect(response).toBeDefined()
    expect(response!.id).toBe(task.id)
    expect(response!.title).toBe(mockData.title)
    expect(response!.description).toBe(mockData.description)
  })
  it("should get all tasks", async () => {
    const response = await taskService.getTasks()
    expect(response).toBeDefined()
    expect(response.length).toBe(0)
    taskService.createTask(mockData)
    const response2 = await taskService.getTasks()
    expect(response2.length).toBe(1)
  })
  it("should update a task", async () => {
    const task = await taskService.createTask(mockData)
    const response = await taskService.updateTask(task.id, {
      title: "test2",
      description: mockData.description,
    })
    expect(response).toBeDefined()
    expect(response.id).toBe(task.id)
    expect(response.title).toBe("test2")
    expect(response.description).toBe(mockData.description)
  })
  it("should delete a task", async () => {
    const task = await taskService.createTask(mockData)
    const response = await taskService.deleteTask(task.id)
    expect(response).toBeDefined()
    expect(response.length).toBe(0)
  })
  it("should delete all tasks", async () => {
    await taskService.createTask(mockData)
    await taskService.deleteAll()
    const tasks = await taskService.getTasks()
    expect(tasks).toHaveLength(0)
  })
  it("should throw an error when id is invalid", async () => {
    const expectedError = new Error("Invalid ID")
    await expect(taskService.getTask("invalid")).rejects.toEqual(expectedError)
    await expect(taskService.updateTask("invalid", mockData)).rejects.toEqual(
      expectedError
    )
    await expect(taskService.deleteTask("invalid")).rejects.toEqual(
      expectedError
    )
  })
  it("should throw an error when task already exists", async () => {
    await taskService.createTask(mockData)
    expect(taskService.createTask(mockData)).rejects.toEqual(
      new Error("Task already exists")
    )
  })
  it("should throw an error when task not found", async () => {
    const notFoundError = new Error("Task not found")
    expect(await taskService.getTask(uuid())).not.toBeDefined()
    expect(taskService.updateTask(uuid(), mockData)).rejects.toEqual(
      notFoundError
    )
    expect(taskService.deleteTask(uuid())).rejects.toEqual(notFoundError)
  })
  it("should throw an error when id is not provided", () => {
    const idIsRequiredError = new Error("Id is required")
    expect(taskService.getTask("")).rejects.toEqual(idIsRequiredError)
    expect(taskService.updateTask("", {} as Task)).rejects.toEqual(
      idIsRequiredError
    )
    expect(taskService.deleteTask("")).rejects.toEqual(idIsRequiredError)
  })
  it("should throw an error when try to create an empty task", () => {
    const titleIsRequiredError = new Error("Title is required")
    expect(() =>
      taskService.createTask({ title: "", description: "" })
    ).toThrow(titleIsRequiredError)
    expect(() =>
      taskService.createTask({
        title: "",
        description: mockData.description,
      })
    ).toThrow(titleIsRequiredError)
  })
})
