import { IPagination, Task, User } from "@eleos/core"
import React from "react"

export interface Pagination extends IPagination<User> {
  page: number
}

export interface IAppContext {
  selectedUser: User | null
  paginatedUsers: Pagination
  selectedTask: Task | null
  tasks: Task[]
  loading: boolean
  error: string
  setSelectedUser: (user: User | null) => void
  setSelectedTask: (task: Task | null) => void
  setTasks: (tasks: Task[]) => void
  setPaginatedUsers: (users: Pagination) => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
}

export const AppContext = React.createContext<IAppContext | null>(null)

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [paginatedUsers, setPaginatedUsers] = React.useState<Pagination>({
    limit: 10,
    skip: 0,
    total: 0,
    users: [],
    page: 1,
  })
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>("")

  const context = {
    selectedUser,
    paginatedUsers,
    selectedTask,
    tasks,
    setSelectedUser,
    setSelectedTask,
    setTasks,
    setPaginatedUsers,
    loading,
    setLoading,
    error,
    setError,
  }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export default AppProvider
