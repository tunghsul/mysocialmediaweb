import { useState, useEffect } from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import {
  Tooltip,
  Button,
  Grid,
  styled,
  TextField,
  Typography,
  Avatar,
  Snackbar,
  Divider,
} from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '../store'

export interface CreateUserInfoDialogProps
  extends Omit<DialogProps, 'children'> {
  children?: never
  edit: boolean
  onCanceled?: () => void
  onSubmitted?: () => void
}

const Input = styled('input')({
  display: 'none',
})

export const CreateUserInfoDialog = ({
  open,
  edit,
  onCanceled,
  onSubmitted,
  ...rest
}: CreateUserInfoDialogProps): JSX.Element => {
  const [username, setUserName] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('')
  const [userNameInvalid, setUserNameInvalid] = useState<boolean>(false)
  const [creating, setCreating] = useState<boolean>(false)
  const dispatch = useDispatch<Dispatch>()
  const [openErr, setOpenErr] = useState<boolean>(false)
  const user = useSelector((state: RootState) => state.post.currentUser)

  useEffect(() => {
    if (open) {
      setUserName(user.name)
      setUserNameInvalid(false)
      setAvatar(user.avatar)
    }
  }, [open, user])

  return (
    <Dialog
      open={open}
      {...rest}
      sx={{ minWidth: 500 }}
      onClose={() => {
        if (edit && onCanceled) {
          onCanceled()
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', padding: '5px' }}>
        User Info
      </DialogTitle>
      <Divider />
      <DialogContent>
        {edit ? (
          <>
            <Typography>You can edit your personal infomation below</Typography>
          </>
        ) : (
          <>
            <Typography>
              Hey! This is your first time visit this website!
            </Typography>
            <Typography>
              Please sign up the user name(required) and upload photo.
            </Typography>
          </>
        )}
        <Grid container alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <Grid item>
            <label htmlFor="icon-button-file">
              <Tooltip title="Click to upload image" placement="bottom">
                {avatar === '' ? (
                  <AccountCircleIcon fontSize="large" />
                ) : (
                  <Avatar alt={username} src={avatar} />
                )}
              </Tooltip>{' '}
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={(e) => {
                  if (e.target.files?.length === 0) {
                    return
                  }
                  const file = e.target.files![0]
                  if (file.size > 2000000) {
                    setOpenErr(true)
                    return
                  }

                  setOpenErr(false)
                  const reader = new FileReader()
                  reader.readAsDataURL(file)

                  reader.onload = function () {
                    setAvatar(reader.result as string)
                  }
                  reader.onerror = function (error) {
                    console.log('Error: ', error)
                  }
                }}
              />
            </label>
            <Snackbar
              open={openErr}
              autoHideDuration={6000}
              message="File exceeds 2MB"
            />
          </Grid>
          <Grid item sx={{ flex: 1 }}>
            <TextField
              required
              id="post-title"
              placeholder="User Name"
              sx={{
                marginTop: 1,
                marginLeft: 1,
                width: '90%',
                '& .MuiOutlinedInput-notchedOutline': { borderRadius: 8 },
              }}
              error={userNameInvalid}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setCreating(true)
                  dispatch.post.storeUser({
                    name: username,
                    avatar: avatar,
                  })
                  setCreating(false)
                  if (onSubmitted) {
                    onSubmitted()
                  }
                }
              }}
              onChange={(e) => {
                if (e.target.value !== '') {
                  setUserNameInvalid(false)
                }
                setUserName(e.target.value)
              }}
              value={username}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
        <Button
          disabled={creating}
          onClick={async () => {
            if (username === '') {
              setUserNameInvalid(true)
              return
            }
            setCreating(true)

            dispatch.post.storeUser({
              name: username,
              avatar: avatar,
            })

            setCreating(false)
            if (onSubmitted) {
              onSubmitted()
            }
          }}
        >
          {edit ? 'Submit' : 'Sign Up'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
