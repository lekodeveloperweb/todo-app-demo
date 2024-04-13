import { FetchApiImpl, UserService } from "@eleos/core"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CircularProgress from "@mui/material/CircularProgress"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import React from "react"
import { useParams } from "react-router-dom"
import Breadcrumb from "../../components/Breadcrumb"
import { useAppContext } from "../../hooks"

const UserDetails: React.FC = () => {
  const {
    selectedUser,
    setSelectedUser,
    error,
    loading,
    setLoading,
    setError,
  } = useAppContext()
  const { id } = useParams<{ id: string }>()
  React.useEffect(() => {
    if (selectedUser) return
    setLoading(true)
    const fetchUsers = async () => {
      try {
        const user = await new UserService(new FetchApiImpl()).getUser(+id!)
        if (!user) throw new Error("User not found")
        setSelectedUser(user)
      } catch (error) {
        const err = error as Error
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [selectedUser, setSelectedUser, id, setLoading, setError])
  if (loading) return <CircularProgress data-testid="loading" />
  if (error) return <div>Error: {error}</div>
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="start"
      flexDirection="column"
      margin="0 auto"
      sx={{
        width: {
          xs: "100%",
          md: "fit-content",
        },
      }}
    >
      <Breadcrumb
        items={[
          { text: "To Do App", path: "/" },
          { text: "Users", path: "/users" },
          { text: `${selectedUser?.firstName} ${selectedUser?.lastName}` },
        ]}
      />
      <Card
        sx={{
          maxWidth: {
            xs: "100%",
            lg: "fit-content",
          },
          marginTop: "2rem",
        }}
      >
        <CardHeader
          avatar={
            <Avatar alt={selectedUser?.username} src={selectedUser?.image} />
          }
          title={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
          subheader={`Birthday: ${selectedUser?.birthDate}`}
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            <b>Address:</b> {selectedUser?.address.address},{" "}
            {selectedUser?.address.city} - {selectedUser?.address.postalCode},{" "}
            {selectedUser?.address.state} <br />
            <b>Phone:</b>{" "}
            <a href={`tel:selectedUser?.phone`}>{selectedUser?.phone}</a>
            <br />
            <b>Email:</b>{" "}
            <a href={`mailto: ${selectedUser?.email}`}>{selectedUser?.email}</a>{" "}
            <br />
            <b>Gender:</b> {selectedUser?.gender} <br />
            <b>Company:</b> {selectedUser?.company.name} <br />
            <b>Job title:</b> {selectedUser?.company.title} <br />
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserDetails
