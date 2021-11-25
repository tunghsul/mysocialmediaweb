import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from '../store'
import {
  Box,
  ListItemAvatar,
  ListItem,
  Card,
  ListItemText,
  Typography,
  Avatar,
  ImageList,
  ImageListItem,
  Button,
  TextField,
  Divider,
  Grid,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { SxProps, styled } from '@mui/system'
import { Post as IPost, Comment as IComment } from '../models/post'
import { PostSkeleton } from './post-skeleton'
import { useState, useEffect } from 'react'

const Image = styled('img')({
  objectFit: 'contain',
  width: '100%',
  height: '450px',
  flexGrow: 1,
})

const PostCard = styled(Card)({
  boxShadow: 'initial',
  border: '1px solid #d8d8d8',
})

const Post = ({ post, sx }: { post: IPost; sx: SxProps }): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const { currentUser: user } = useSelector((state: RootState) => state.post)
  const dispatch = useDispatch<Dispatch>()

  const [comment, setComment] = useState<IComment>({
    postId: post.id,
    username: user.name,
    content: '',
    userAvatar: user.avatar,
    createdAt: 0,
  })

  return (
    <PostCard sx={sx}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          {post.userAvatar === '' ? (
            <AccountCircleIcon fontSize="large" />
          ) : (
            <Avatar alt={post.username} src={post.userAvatar} />
          )}
        </ListItemAvatar>
        <ListItemText
          sx={{
            '& .MuiListItemText-primary': { fontWeight: 'bold' },
          }}
          primary={post.title}
          secondary={
            <>
              <Typography
                sx={{ display: 'block' }}
                component="span"
                variant="body2"
              >
                @{post.username}．{new Date(post.createdAt).toLocaleString()}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider />
      <Box sx={{ padding: '8px 16px 8px 16px' }}>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ whiteSpace: 'pre' }}
        >
          {post.content}
        </Typography>
      </Box>

      {post.images.length > 0 && (
        <ImageList
          sx={{ width: '100%', height: 410, background: '#000000' }}
          cols={post.images.length > 3 ? 3 : post.images.length}
          rowHeight={164}
        >
          {post.images.map((item) => (
            <ImageListItem key={item}>
              <Image src={item} alt="" />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {(post.comments?.length ?? 0) > 0 && (
        <>
          <Divider />
          <Button
            sx={{ width: '100%' }}
            size="small"
            variant="text"
            onClick={(e) => {
              setOpen(!open)
            }}
          >
            {post.comments?.length}Comments
          </Button>
        </>
      )}
      <Divider />
      <Box sx={{ marginTop: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: 2,
            padding: '8px 16px 8px 16px',
          }}
        >
          <Box>
            {user.avatar === '' ? (
              <AccountCircleIcon fontSize="large" />
            ) : (
              <Avatar
                sx={{ width: 35, height: 35 }}
                alt={user.name}
                src={user.avatar}
              />
            )}
          </Box>

          <TextField
            size="small"
            sx={{
              marginLeft: 2,
              width: '90%',
              '& .MuiOutlinedInput-notchedOutline': { borderRadius: 8 },
            }}
            placeholder="Write a comment..."
            variant="outlined"
            value={comment.content}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                dispatch.post.newComment({
                  ...comment,
                  createdAt: Date.now(),
                  postId: post.id,
                  username: user.name,
                  userAvatar: user.avatar,
                })
                setComment({
                  postId: '',
                  username: '',
                  content: '',
                  userAvatar: '',
                  createdAt: 0,
                })
                setOpen(true)
              }
            }}
            onChange={(e) => {
              setComment({
                ...comment,
                content: e.target.value as string,
              })
            }}
          />
        </Box>
        {open && (
          <Box sx={{ padding: '8px 16px 8px 16px' }}>
            {post.comments?.map((comment, index) => (
              <Comment key={index} comment={comment} sx={{ marginBottom: 3 }} />
            ))}
          </Box>
        )}
      </Box>
    </PostCard>
  )
}
const Comment = ({
  comment,
  sx,
}: {
  comment: IComment
  sx: SxProps
}): JSX.Element => {
  return (
    <Box sx={sx}>
      <Grid container>
        <Grid item sx={{ width: '48px' }}>
          <>
            {comment.userAvatar === '' ? (
              <AccountCircleIcon fontSize="large" />
            ) : (
              <Avatar
                sx={{ width: 35, height: 35 }}
                alt={comment.username}
                src={comment.userAvatar}
              />
            )}
          </>
        </Grid>
        <Grid
          item
          sx={{
            maxWidth: `calc(100% - 48px)`,
            background: '#f0f0f0',
            borderRadius: 2,
            padding: '8px !important',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {comment.username}．
            <Typography variant="body2" component="span" sx={{ fontSize: 12 }}>
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ overflowWrap: 'break-word' }}>
            {comment.content}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
export const Posts = (): JSX.Element => {
  const { posts } = useSelector((state: RootState) => state.post)

  const dispatch = useDispatch<Dispatch>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const asyncMount = async () => {
      setLoading(true)
      await dispatch.post.getPosts()
      setLoading(false)
    }

    asyncMount()
  }, [dispatch])

  return (
    <Box sx={{ marginTop: 3 }}>
      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        posts.map((post, index) => (
          <Post key={index} post={post} sx={{ marginBottom: 3 }} />
        ))
      )}
    </Box>
  )
}
