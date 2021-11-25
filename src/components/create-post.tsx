import { useState } from 'react'
import { Box, Avatar, Typography } from '@mui/material'
import { CreatePostDialog } from './create-post-modal'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { CreateUserInfoDialog } from './create-user-info'

export const CreatePost = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [openUserDialog, setOpenUserDialog] = useState(false)
  const user = useSelector((state: RootState) => state.post.currentUser)
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Box onClick={() => setOpenUserDialog(true)}>
        {user.avatar === '' ? (
          <AccountCircleIcon fontSize="large" />
        ) : (
          <Avatar alt={user.name} src={user.avatar} />
        )}
      </Box>

      <Box
        sx={{
          marginLeft: 2,
          border: '1px solid #61616185',
          borderRadius: 8,
          padding: '8px 16px',
          color: '#616161',
          width: '100%',
        }}
        onClick={() => setOpen(true)}
      >
        <Typography variant="body2">What is on your mind?</Typography>
      </Box>

      <CreatePostDialog
        open={open}
        onCanceled={() => {
          setOpen(false)
        }}
        onSubmitted={() => {
          setOpen(false)
        }}
      />

      <CreateUserInfoDialog
        edit={true}
        open={openUserDialog}
        onCanceled={() => {
          setOpenUserDialog(false)
        }}
        onSubmitted={() => {
          setOpenUserDialog(false)
        }}
      />
    </Box>
  )
}
