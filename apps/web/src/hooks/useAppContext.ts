import React from "react"
import { AppContext } from "./AppContext"

export function useAppContext() {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
