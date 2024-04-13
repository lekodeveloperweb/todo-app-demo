import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AppProvider from "../../hooks/AppContext"
import Todo from "./index"

const TaskServiceMock = {
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  getTask: jest.fn(),
  getTasks: jest.fn(),
  updateTask: jest.fn(),
  deleteAll: jest.fn(),
}

const defaultTasks = {
  id: "1",
  title: "Task 1",
  description: "Description 1",
}

jest.mock("@eleos/core", () => ({
  getTaskService: () => TaskServiceMock,
}))

describe("<Todo />", () => {
  const addNewTaskButton = () => screen.getByTestId("todo-add")
  const editTaskButton = () => screen.queryByTestId("todo-edit")
  const removeTaskButton = () => screen.queryByTestId("todo-remove")
  const closeDialogButton = () => screen.getByTestId("todo-close-form")
  const taskList = () => screen.queryByTestId("todo-list")
  const emptyListItem = () => screen.queryByText("No tasks found")
  const todoItem = (id: string) => screen.queryByTestId(`todo-item-${id}`)
  const todoForm = () => screen.queryByTestId("todo-form")
  const divider = (id: string) => screen.queryByTestId(`todo-divider-${id}`)
  const renderComponent = () =>
    render(
      <AppProvider>
        <Todo />
      </AppProvider>
    )

  it("should render the component correctly", () => {
    renderComponent()
    expect(addNewTaskButton()).toBeInTheDocument()
    expect(taskList()).toBeInTheDocument()
    expect(emptyListItem()).toBeInTheDocument()
    expect(todoForm()).not.toBeInTheDocument()
    expect(editTaskButton()).not.toBeInTheDocument()
    expect(removeTaskButton()).not.toBeInTheDocument()
    expect(todoItem("")).not.toBeInTheDocument()
  })
  it("should open the form when clicking on the add button", async () => {
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(todoForm()).toBeInTheDocument()
  })
  it("should close the form when clicking on the close button", async () => {
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    await user.click(closeDialogButton())
    expect(screen.getByRole("dialog")).not.toBeVisible()
  })
  it("should do not close the form when clicking on the backdrop", async () => {
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const presentations = screen.getAllByRole("presentation")
    await user.click(presentations[1])
    expect(screen.getByRole("dialog")).toBeVisible()
  })
  it("should create a new task when submitting the form", async () => {
    TaskServiceMock.createTask.mockResolvedValueOnce(defaultTasks)
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const title = screen.getByLabelText("Title")
    const description = screen.getByLabelText("Description")
    const submit = screen.getByRole("button", { name: "Save" })
    await user.type(title, defaultTasks.title)
    await user.type(description, defaultTasks.description)
    await user.click(submit)
    expect(TaskServiceMock.createTask).toHaveBeenCalledWith({
      title: defaultTasks.title,
      description: defaultTasks.description,
    })
    expect(emptyListItem()).not.toBeInTheDocument()
    expect(todoItem(defaultTasks.id)).toBeInTheDocument()
  })
  it("should edit a task when clicking on the edit button", async () => {
    const updatedTask = { ...defaultTasks, title: "Task updated" }
    TaskServiceMock.createTask.mockResolvedValueOnce(defaultTasks)
    TaskServiceMock.updateTask.mockResolvedValueOnce(updatedTask)
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const title = screen.getByLabelText("Title")
    const description = screen.getByLabelText("Description")
    const submit = screen.getByRole("button", { name: "Save" })
    await user.type(title, defaultTasks.title)
    await user.type(description, defaultTasks.description)
    await user.click(submit)
    const edit = editTaskButton()
    expect(edit).toBeInTheDocument()
    await user.click(edit!)
    expect(todoForm()).toBeInTheDocument()
    expect(screen.getByDisplayValue(defaultTasks.title)).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(defaultTasks.description)
    ).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    const input = title as HTMLInputElement
    expect(input.value).toBe(defaultTasks.title)
    await user.clear(title)
    expect(input.value).toBe("")
    await user.type(title, updatedTask.title)
    expect(input.value).toBe(updatedTask.title)
    await user.click(submit)
    expect(TaskServiceMock.updateTask).toHaveBeenCalled()
    expect(screen.getByText(updatedTask.title)).toBeInTheDocument()
  })
  it("should delete a task when clicking on the remove button", async () => {
    TaskServiceMock.createTask.mockResolvedValueOnce(defaultTasks)
    TaskServiceMock.deleteTask.mockResolvedValueOnce([])
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const title = screen.getByLabelText("Title")
    const description = screen.getByLabelText("Description")
    const submit = screen.getByRole("button", { name: "Save" })
    await user.type(title, defaultTasks.title)
    await user.type(description, defaultTasks.description)
    await user.click(submit)
    const remove = removeTaskButton()
    expect(remove).toBeInTheDocument()
    await user.click(remove!)
    expect(TaskServiceMock.deleteTask).toHaveBeenCalledWith(defaultTasks.id)
    expect(emptyListItem()).toBeInTheDocument()
  })

  it("should show validation errors when submitting the form with empty fields", async () => {
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const submit = screen.getByRole("button", { name: "Save" })
    await user.click(submit)
    expect(screen.getByText("Title is required")).toBeInTheDocument()
  })

  it("should show an error on try to delete a task", async () => {
    TaskServiceMock.createTask.mockResolvedValueOnce(defaultTasks)
    TaskServiceMock.deleteTask.mockRejectedValueOnce(new Error("Error"))
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const title = screen.getByLabelText("Title")
    const description = screen.getByLabelText("Description")
    const submit = screen.getByRole("button", { name: "Save" })
    await user.type(title, defaultTasks.title)
    await user.type(description, defaultTasks.description)
    await user.click(submit)
    const remove = removeTaskButton()
    expect(remove).toBeInTheDocument()
    await user.click(remove!)
    expect(TaskServiceMock.deleteTask).toHaveBeenCalledWith(defaultTasks.id)
    expect(screen.getByText("Error")).toBeInTheDocument()
  })

  it("should show an error on try to create a task", async () => {
    TaskServiceMock.createTask.mockRejectedValueOnce(new Error("Error"))
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const title = screen.getByLabelText("Title")
    const description = screen.getByLabelText("Description")
    const submit = screen.getByRole("button", { name: "Save" })
    await user.type(title, defaultTasks.title)
    await user.type(description, defaultTasks.description)
    await user.click(submit)
    expect(TaskServiceMock.createTask).toHaveBeenCalledWith({
      title: defaultTasks.title,
      description: defaultTasks.description,
    })
    expect(screen.getByText("Error")).toBeInTheDocument()
  })
  it("should show an error on try to update a task", async () => {
    const updatedTask = { ...defaultTasks, title: "Task updated" }
    TaskServiceMock.createTask.mockResolvedValueOnce(defaultTasks)
    TaskServiceMock.updateTask.mockRejectedValueOnce(new Error("Error"))
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const title = screen.getByLabelText("Title")
    const description = screen.getByLabelText("Description")
    const submit = screen.getByRole("button", { name: "Save" })
    await user.type(title, defaultTasks.title)
    await user.type(description, defaultTasks.description)
    await user.click(submit)
    const edit = editTaskButton()
    expect(edit).toBeInTheDocument()
    await user.click(edit!)
    expect(todoForm()).toBeInTheDocument()
    expect(screen.getByDisplayValue(defaultTasks.title)).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(defaultTasks.description)
    ).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    const input = title as HTMLInputElement
    expect(input.value).toBe(defaultTasks.title)
    await user.clear(title)
    expect(input.value).toBe("")
    await user.type(title, updatedTask.title)
    expect(input.value).toBe(updatedTask.title)
    await user.click(submit)
    expect(TaskServiceMock.updateTask).toHaveBeenCalled()
    expect(screen.getByText("Error")).toBeInTheDocument()
  })

  it("should show the divider component between task items", async () => {
    const task2 = {
      id: "2",
      title: "Task 2",
      description: "Description 2",
    }
    TaskServiceMock.createTask.mockResolvedValueOnce(defaultTasks)
    TaskServiceMock.createTask.mockResolvedValueOnce(task2)
    renderComponent()
    const user = userEvent.setup()
    await user.click(addNewTaskButton())
    const title = screen.getByLabelText("Title")
    const description = screen.getByLabelText("Description")
    const submit = screen.getByRole("button", { name: "Save" })
    await user.type(title, defaultTasks.title)
    await user.type(description, defaultTasks.description)
    await user.click(submit)
    await user.click(addNewTaskButton())
    await user.type(title, task2.title)
    await user.type(description, task2.description)
    await user.click(submit)
    expect(todoItem(task2.id)).toBeInTheDocument()
    expect(divider(defaultTasks.id)).toBeInTheDocument()
  })
})
