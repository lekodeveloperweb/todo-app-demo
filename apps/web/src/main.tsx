import CssBaseline from "@mui/material/CssBaseline"
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
import AppProvider from "./hooks/AppContext.tsx"
import "./index.css"
import Todo from "./pages/Todo/index.tsx"
import UserDetails from "./pages/Users/Details.tsx"
import Users from "./pages/Users/index.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Todo />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/:id",
        element: <UserDetails />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
)
