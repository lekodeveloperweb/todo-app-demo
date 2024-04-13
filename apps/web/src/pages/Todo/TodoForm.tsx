import { Task } from "@eleos/core"
import CloseIcon from "@mui/icons-material/Close"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"

export type TodoFormProps = {
  onCancel: (data: object, reason: string) => void
  task: Task | null
}

type Inputs = { [key: string]: string }

const TodoForm: React.FC<TodoFormProps> = ({ onCancel, task }) => {
  const initialValues = task
    ? Object.keys(task).reduce(
        (prev, key) => ({
          [key]: (task as unknown as Record<string, string>)[key],
          ...prev,
        }),
        {} as Record<string, string>
      )
    : {}
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({
    values: initialValues,
  })
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    reset()
    onCancel(data, "submit")
  }
  return (
    <Box
      data-testid="todo-form"
      display="flex"
      flexDirection="column"
      sx={{
        minWidth: {
          xs: "100%",
          md: "30rem",
        },
      }}
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h5">Add Task</Typography>
        <IconButton
          data-testid="todo-close-form"
          onClick={() => onCancel({}, "cancel")}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          padding={2}
          marginTop="1rem"
        >
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            size="small"
            error={!!errors.title}
            helperText={errors.title && "Title is required"}
            {...register("title", { required: true })}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            size="small"
            multiline
            rows={4}
            {...register("description")}
          />
          <Button type="submit" variant="contained" fullWidth>
            Save
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default TodoForm
