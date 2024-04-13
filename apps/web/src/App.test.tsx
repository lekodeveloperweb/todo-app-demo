import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { v4 as uuid } from "uuid"
import App from "./App"
import { UserServiceMock } from "./utils/tests/mocks"

jest.mock("@eleos/core", () => {
  return {
    FetchApiImpl: jest.fn(),
    UserService: jest.fn(() => new UserServiceMock()),
    uuid,
  }
})

describe("<App />", () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<div>App</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
  }

  it("should render", () => {
    renderComponent()
    expect(screen.getByText("App")).toBeInTheDocument()
  })

  it("should open the drawer menu", async () => {
    renderComponent()
    const user = userEvent.setup()
    const button = screen.getByLabelText("open drawer")
    expect(button).toBeInTheDocument()
    await user.click(button)
    expect(screen.getByRole("presentation")).toBeVisible()
  })
})
