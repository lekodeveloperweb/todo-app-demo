import styled from "@emotion/styled"
import { Link } from "react-router-dom"

export const CustomLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
`
