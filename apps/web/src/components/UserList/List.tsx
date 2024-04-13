import { User } from "@eleos/core"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import React from "react"
import UserListItem from "./ListItem"

const UserList: React.FC<{ users: User[]; onClick: (id: number) => void }> = ({
  users,
  onClick,
}) => {
  return (
    <List
      data-testid="users-list"
      sx={{ width: "100%", bgcolor: "background.paper" }}
    >
      {users.map((user, index) => (
        <React.Fragment key={user.id}>
          <UserListItem user={user} onClick={onClick} />
          {index < users.length - 1 && (
            <Divider
              data-testid={`users-list-item-${user.id}-divider`}
              variant="inset"
              component="li"
            />
          )}
        </React.Fragment>
      ))}
    </List>
  )
}

export default UserList
