import type { User } from "@eleos/core"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { v4 as uuid } from "uuid"
import AppProvider from "../../hooks/AppContext"
import {
  UserServiceMock,
  generateUsers,
  mockGetUser,
} from "../../utils/tests/mocks"
import UserDetails from "./Details"

jest.mock("@eleos/core", () => {
  return {
    FetchApiImpl: jest.fn(),
    UserService: jest.fn(() => new UserServiceMock()),
    uuid,
  }
})

describe("<UserDetails />", () => {
  const loading = () => screen.queryByTestId("loading")

  const renderComponent = () =>
    render(
      <AppProvider>
        <MemoryRouter initialEntries={["/users/0"]}>
          <Routes>
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/users" element={<div>Users</div>} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    )

  it("should render the component correctly", async () => {
    const user = generateUsers(1)[0]
    mockGetUser.mockResolvedValueOnce(user)
    renderComponent()
    await waitFor(() => expect(loading()).not.toBeInTheDocument())
    expect(
      screen.getAllByText(`${user.firstName} ${user.lastName}`)
    ).toHaveLength(2)
  })

  it("should show an error on try to fetch user", async () => {
    mockGetUser.mockRejectedValueOnce(new Error("loading users"))
    renderComponent()
    await waitFor(() => expect(loading()).not.toBeInTheDocument())
    expect(screen.getByText("Error: loading users"))
  })

  it("should show an error on try to get inexistent user", async () => {
    mockGetUser.mockResolvedValueOnce(null as unknown as User)
    renderComponent()
    await waitFor(() => expect(loading()).not.toBeInTheDocument())
    expect(screen.getByText("Error: User not found"))
  })
})
