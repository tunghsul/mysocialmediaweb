import { useState, useEffect } from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import {
  Button,
  IconButton,
  styled,
  Divider,
  Box,
  Typography,
  Avatar,
  InputBase,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DialogTitle from '@mui/material/DialogTitle'
import { Post } from '../models/post'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '../store'
import { PhotoCamera } from '@mui/icons-material'

export interface CreatePostDialogProps extends Omit<DialogProps, 'children'> {
  children?: never
  user?: any // TODO: set to user type
  onCanceled?: () => void
  onSubmitted?: () => void
}

const Input = styled('input')({
  display: 'none',
})

export const CreatePostDialog = ({
  open,
  onCanceled,
  onSubmitted,
  ...rest
}: CreatePostDialogProps): JSX.Element => {
  const user = useSelector((state: RootState) => state.post.currentUser)
  const [fileName, setFileName] = useState<String>('')
  const [creating, setCreating] = useState<boolean>(true)
  const [post, setPost] = useState<Post>({
    id: '',
    title: '',
    username: '',
    content: '',
    userAvatar: '',
    createdAt: 0,
    images: [],
  })

  const dispatch = useDispatch<Dispatch>()

  useEffect(() => {
    if (open) {
      setPost({
        id: '',
        title: '',
        username: '',
        content: '',
        userAvatar: '',
        createdAt: 0,
        images: [],
      })
      setFileName('')
    }
  }, [open])

  return (
    <Dialog
      open={open}
      {...rest}
      sx={{ minWidth: 500 }}
      onClose={() => {
        if (onCanceled) {
          onCanceled()
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', padding: '5px' }}>
        Create new post
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '0px',
          }}
        >
          <Box
            sx={{
              marginRight: 1,
            }}
          >
            {user.avatar === '' ? (
              <AccountCircleIcon fontSize="large" />
            ) : (
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{ width: 35, height: 35 }}
              />
            )}
          </Box>
          <Typography
            sx={{ display: 'block', fontWeight: '600' }}
            component="span"
            variant="body2"
          >
            @{user.name}
          </Typography>
        </Box>
        <InputBase
          required
          id="post-title"
          placeholder="Title"
          sx={{ marginTop: 1, marginLeft: 1, width: '100%' }}
          value={post.title}
          onChange={(e) => {
            if (e.target.value === '' || post.content === '') {
              setCreating(true)
            } else {
              setCreating(false)
            }
            setPost({
              ...post,
              title: e.target.value as string,
            })
          }}
        />
        <InputBase
          required
          id="post-content"
          multiline
          placeholder="What is on your mind?"
          rows={8}
          value={post.content}
          onChange={(e) => {
            if (post.title === '' || e.target.value === '') {
              setCreating(true)
            } else {
              setCreating(false)
            }
            setPost({
              ...post,
              content: e.target.value as string,
            })
          }}
          sx={{ marginTop: 1, marginLeft: 1, width: '100%' }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          color: 'rgba(0, 0, 0, 0.6)',
          flexDirection: 'column',
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Divider sx={{ width: '100%' }} />
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
        >
          <label htmlFor="icon-button-file">
            {fileName}
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={(e) => {
                if (e.target.files?.length === 0) {
                  return
                }
                const file = e.target.files![0]
                const reader = new FileReader()
                reader.readAsDataURL(file)

                reader.onload = function () {
                  //me.modelvalue = reader.result;
                  setPost({
                    ...post,
                    images: [reader.result as string],
                  })
                  setFileName(file.name)
                  console.log(reader.result)
                }
                reader.onerror = function (error) {
                  console.log('Error: ', error)
                }
              }}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={async () => {}}
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>
        <Divider sx={{ width: '100%' }} />
        <Button
          sx={{ width: '100%' }}
          size="large"
          disabled={creating}
          onClick={async () => {
            setCreating(true)
            // if (post.image !== '') {
            //   await dispatch.post.uploadImage(post.image)
            // }

            await dispatch.post.newPost({
              ...post,
              username: user.name,
              userAvatar: user.avatar,
              createdAt: Date.now(),
            })

            setCreating(false)
            if (onSubmitted) {
              onSubmitted()
            }
          }}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}
