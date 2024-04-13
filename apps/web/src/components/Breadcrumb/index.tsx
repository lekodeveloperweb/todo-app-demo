import { uuid } from "@eleos/core"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Typography from "@mui/material/Typography"
import React from "react"
import { CustomLink } from "./styles"

export type BreadcrumbProps = {
  items: { text: string; path?: string }[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map(({ text, path }) =>
        path ? (
          <CustomLink key={uuid()} to={path}>
            {text}
          </CustomLink>
        ) : (
          <Typography key={uuid()} color="text.primary">
            {text}
          </Typography>
        )
      )}
    </Breadcrumbs>
  )
}

export default Breadcrumb
