import { User } from "@eleos/core"
import ArrowForward from "@mui/icons-material/NavigateNext"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import React from "react"

const UserListItem: React.FC<{ user: User; onClick: (id: number) => void }> = ({
  user,
  onClick,
}) => {
  return (
    <ListItem
      data-testid={`user-item-${user.id}`}
      alignItems="flex-start"
      onClick={() => onClick(user.id)}
      secondaryAction={
        <IconButton edge="end" aria-label="view">
          <ArrowForward />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar alt={user.username} src={user.image} />
      </ListItemAvatar>
      <ListItemText
        primary={`${user.firstName} ${user.lastName}`}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
              data-testid="user-birthday"
            >
              Birthday: {user.birthDate}
            </Typography>
            {"- "}Age: {user.age}, Email: {user.email}, Phone: {user.phone}
          </React.Fragment>
        }
      />
    </ListItem>
  )
}

export default UserListItem
