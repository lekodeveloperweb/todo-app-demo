import { FetchApiImpl, UserService } from "@eleos/core"
import Box from "@mui/material/Box"
import Pagination from "@mui/material/Pagination"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import React from "react"
import { useNavigate } from "react-router-dom"
import Breadcrumb from "../../components/Breadcrumb"
import UserList from "../../components/UserList/List"
import ListSkeleton from "../../components/UserList/ListSkeleton"
import { useAppContext } from "../../hooks"

const Users: React.FC = () => {
  const theme = useTheme()
  const showNextAndPrevButton = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const {
    setSelectedUser,
    error,
    setPaginatedUsers,
    loading,
    paginatedUsers,
    setLoading,
    setError,
  } = useAppContext()

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPaginatedUsers({
      ...paginatedUsers,
      page: value,
      skip: (value - 1) * paginatedUsers.limit,
    })
  }

  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const service = new UserService(new FetchApiImpl())
        const { users, total, limit } = await service.getUsers({
          limit: paginatedUsers.limit,
          skip: paginatedUsers.skip,
        })
        setPaginatedUsers({
          ...paginatedUsers,
          users,
          page: Math.floor(paginatedUsers.skip / paginatedUsers.limit) + 1,
          limit,
          total,
        })
      } catch (error) {
        const err = error as Error
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when the pagination changes
  }, [
    setError,
    setLoading,
    setPaginatedUsers,
    paginatedUsers.limit,
    paginatedUsers.page,
  ])

  return loading ? (
    <ListSkeleton />
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
      flexDirection="column"
      margin="0 auto"
      sx={{
        width: {
          xs: "100%",
          md: "60%",
        },
      }}
    >
      <Breadcrumb
        items={[{ text: "To Do App", path: "/" }, { text: "Users" }]}
      />
      {error && (
        <Typography variant="body2" color="text.danger">
          {error}
        </Typography>
      )}
      <UserList
        users={paginatedUsers.users}
        onClick={(id) => {
          setSelectedUser(paginatedUsers.users.find((user) => user.id === id)!)
          navigate(`/users/${id}`)
        }}
      />
      {paginatedUsers.total >= 20 && (
        <Pagination
          data-testid="pagination"
          count={paginatedUsers.total / paginatedUsers.limit}
          page={paginatedUsers.page}
          onChange={handleChange}
          showFirstButton={showNextAndPrevButton}
          showLastButton={showNextAndPrevButton}
          sx={{ alignSelf: "center", mt: 2 }}
        />
      )}
    </Box>
  )
}

export default Users
