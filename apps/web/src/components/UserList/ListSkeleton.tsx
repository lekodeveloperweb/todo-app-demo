import { uuid } from "@eleos/core"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemText from "@mui/material/ListItemText"
import Skeleton from "@mui/material/Skeleton"
import React from "react"

const ListSkeleton: React.FC<{ itemsCount?: number }> = ({
  itemsCount = 10,
}) => {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {Array.from(new Array(itemsCount)).map(() => (
        <React.Fragment key={uuid()}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton variant="text" width={100} />}
              secondary={<Skeleton variant="text" width={200} />}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  )
}

export default ListSkeleton
