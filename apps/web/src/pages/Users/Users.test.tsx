import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { v4 as uuid } from "uuid"
import AppProvider from "../../hooks/AppContext"
import {
  UserServiceMock,
  generateUsers,
  mockGetUsers,
} from "../../utils/tests/mocks"
import Users from "./index"

jest.mock("@eleos/core", () => {
  return {
    FetchApiImpl: jest.fn(),
    UserService: jest.fn(() => new UserServiceMock()),
    uuid,
  }
})

describe("<Users />", () => {
  const userListItem = (id: number) => screen.queryByTestId("user-item-" + id)
  const userListItemDivider = () =>
    screen.queryByTestId("users-list-item-1-divider")
  const usersList = () => screen.queryByTestId("users-list")
  const pagination = () => screen.queryByTestId("pagination")
  const renderComponent = () =>
    render(
      <AppProvider>
        <MemoryRouter initialEntries={["/users"]}>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<div>User Details</div>} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    )

  it("should render the component correctly", async () => {
    const promise = Promise.resolve()
    const users = generateUsers(10)
    mockGetUsers.mockResolvedValueOnce({
      users,
      limit: 10,
      skip: 0,
      total: users.length,
    })
    renderComponent()
    expect(pagination()).not.toBeInTheDocument()
    await waitFor(() => expect(usersList()).toBeInTheDocument())
    expect(userListItem(0)).toBeInTheDocument()
    expect(userListItemDivider()).toBeInTheDocument()
    await act(() => {
      return promise
    })
  })
  it("should render the pagination component", async () => {
    const promise = Promise.resolve()
    const users = generateUsers(40)
    mockGetUsers.mockResolvedValueOnce({
      users: users.slice(0, 10),
      limit: 10,
      skip: 0,
      total: users.length,
    })
    renderComponent()
    await waitFor(() => expect(usersList()).toBeInTheDocument())
    await waitFor(() => expect(pagination()).toBeInTheDocument())
    expect(screen.getByLabelText("page 1")).toBeInTheDocument()
    expect(screen.getByLabelText("Go to page 4")).toBeInTheDocument()
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument()
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument()
    await act(() => {
      return promise
    })
  })
  it("should navigate view pagination component", async () => {
    const promise = Promise.resolve()
    const users = generateUsers(40)
    mockGetUsers.mockResolvedValueOnce({
      users: users.slice(0, 10),
      limit: 10,
      skip: 0,
      total: users.length,
    })
    mockGetUsers.mockResolvedValueOnce({
      users: users.slice(11, 21),
      limit: 10,
      skip: 10,
      total: users.length,
    })
    const user = userEvent.setup()
    renderComponent()
    await waitFor(() => expect(usersList()).toBeInTheDocument())
    await waitFor(() => expect(pagination()).toBeInTheDocument())
    const page2 = screen.getByLabelText("Go to page 2")
    expect(page2).toBeInTheDocument()
    await user.click(page2)
    expect(mockGetUsers).toHaveBeenCalledTimes(2)
    await act(() => {
      return promise
    })
  })
  it("should navigate to user details page", async () => {
    const promise = Promise.resolve()
    const users = generateUsers(10)
    mockGetUsers.mockResolvedValueOnce({
      users,
      limit: 10,
      skip: 0,
      total: users.length,
    })
    const user = userEvent.setup()
    renderComponent()
    await waitFor(() => expect(usersList()).toBeInTheDocument())
    const listItem = userListItem(users[0].id)
    expect(listItem).toBeInTheDocument()
    await user.click(listItem!)
    await screen.findByText("User Details")
    await act(() => {
      return promise
    })
  })
  it("Should show error on load users", async () => {
    const promise = Promise.resolve()
    mockGetUsers.mockRejectedValue(new Error("Error"))
    renderComponent()
    await waitFor(() => expect(usersList()).toBeInTheDocument())
    expect(screen.getByText("Error"))
    await act(() => {
      return promise
    })
  })
})
