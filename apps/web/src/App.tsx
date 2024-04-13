import { Outlet } from "react-router-dom"

import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import * as React from "react"
import { Navbar } from "./components"

interface Props {
  window?: () => Window
}

function App(props: Props) {
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState)
  }

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Navbar
        navItems={[
          { text: "Home", path: "/" },
          { text: "Users", path: "/users" },
        ]}
        mobileOpen={mobileOpen}
        container={container}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box component="main" sx={{ p: 3, width: "100%" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default App
