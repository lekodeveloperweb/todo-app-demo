import { Task, getTaskService } from "@eleos/core"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import TaskIcon from "@mui/icons-material/Task"
import Alert from "@mui/material/Alert"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemText from "@mui/material/ListItemText"
import Snackbar from "@mui/material/Snackbar"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import React from "react"
import { useAppContext } from "../../hooks"
import TodoForm from "./TodoForm"

const Todo: React.FC = () => {
  const {
    tasks,
    error,
    setTasks,
    setSelectedTask,
    selectedTask,
    setLoading,
    setError,
  } = useAppContext()
  const [open, setOpen] = React.useState(false)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))
  const taskService = getTaskService()

  const handleCloseModal = async (data: Task | object, reason: string) => {
    if (reason === "backdropClick") {
      return
    }
    setOpen(false)
    if (reason === "submit") {
      try {
        const task = data as Task
        const index = tasks.findIndex((t) => t.id === task.id)
        if (index === -1) {
          const newTask = await taskService.createTask(data as Task)
          setTasks([...tasks.filter((x) => x.id !== newTask.id), newTask])
        } else {
          const updatedTask = await taskService.updateTask(task.id, {
            title: task.title,
            description: task.description,
          })
          setTasks([
            ...tasks.slice(0, index),
            updatedTask,
            ...tasks.slice(index + 1),
          ])
        }
      } catch (error) {
        const err = error as Error
        console.log(err)
        setError(err.message)
        setSnackbarOpen(true)
      }
    }
  }

  const onEdit = async (task: Task) => {
    setSelectedTask(task)
    setOpen(true)
  }

  const onDelete = async (id: string) => {
    try {
      setLoading(true)
      const newTasks = await taskService.deleteTask(id)
      setTasks(newTasks)
      setSelectedTask(null)
    } catch (error) {
      const err = error as Error
      setError(err.message)
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        color="danger"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            minWidth: {
              xs: "100%",
              md: "50%",
            },
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="h4">Tasks</Typography>
            <Button
              data-testid="todo-add"
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Add Task
            </Button>
          </Box>
          <List
            data-testid="todo-list"
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              marginTop: "2rem",
            }}
          >
            {tasks.length === 0 && (
              <ListItem>
                <ListItemText primary="No tasks found" />
              </ListItem>
            )}
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <ListItem
                  data-testid={`todo-item-${task.id}`}
                  secondaryAction={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="5.5rem"
                    >
                      <IconButton
                        data-testid="todo-edit"
                        onClick={() => onEdit(task)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        data-testid="todo-remove"
                        onClick={() => onDelete(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <TaskIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={task.title}
                    secondary={task.description || "No Description"}
                  />
                </ListItem>
                {index < tasks.length - 1 && (
                  <Divider
                    data-testid={`todo-divider-${task.id}`}
                    variant="inset"
                    component="li"
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
      <Dialog
        fullScreen={fullScreen}
        disableEscapeKeyDown
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <TodoForm onCancel={handleCloseModal} task={selectedTask} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Todo
