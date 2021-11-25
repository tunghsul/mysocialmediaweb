import { useDispatch } from 'react-redux'
import { Dispatch } from './store'
import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
// import PersonIcon from '@mui/icons-material/Person'
// import { Box } from '@mui/system'
// import { Drawer } from './components/drawer'
import { Posts } from './components/posts'
import { CreatePost } from './components/create-post'
import { CreateUserInfoDialog } from './components/create-user-info'

const App = (): JSX.Element => {
  // const [openDrawer, setOpenDrawer] = useState(false)
  const dispatch = useDispatch<Dispatch>()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (localStorage.length === 0) {
      setOpen(true)
      return
    }

    dispatch.post.loadUser()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ padding: 4 }}>
      {/* <Drawer variant="permanent" open={openDrawer}>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="user profile" />
          </ListItem>
        </List>
        <Divider />
      </Drawer> */}
      {/* <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
        onClick={() => {
          setOpenDrawer(!openDrawer)
        }}
      > */}
      <CreateUserInfoDialog
        edit={false}
        open={open}
        onCanceled={() => {
          setOpen(false)
        }}
        onSubmitted={() => {
          setOpen(false)
        }}
      />
      <CreatePost />
      <Posts />
      {/* </Box> */}
    </Container>
  )
}

export default App
