import { createModel } from '@rematch/core'
import axios from 'axios'
import { RootModel } from '.'

export interface Post {
  id: string
  title: string
  username: string
  content: string
  userAvatar?: string
  createdAt: number
  images: string[]
  comments?: Comment[]
}

export interface User {
  name: string
  avatar: string
}

export interface Comment {
  postId: string
  username: string
  content: string
  userAvatar?: string
  createdAt: number
}

interface PostState {
  posts: Post[]
  currentUser: User
}

interface GetPostsResponse {
  posts: Post[]
}

interface GetCommentsResponse {
  comments: Comment[]
}

export const post = createModel<RootModel>()({
  state: {
    currentUser: {
      name: '',
      avatar: '',
    },
    posts: [],
  } as PostState,
  reducers: {
    onGetPostsSuccess(
      state,
      { posts, comments }: { posts: Post[]; comments: Comment[] }
    ) {
      posts.sort((a, b) => b.createdAt - a.createdAt)
      comments.sort((a, b) => b.createdAt - a.createdAt)

      const displayPosts = posts.map((post) => ({
        ...post,
        comments: comments.filter((comment) => comment.postId === post.id),
      }))
      return {
        ...state,
        posts: displayPosts,
      }
    },
    onGetPostsFailed(state, error: Error | any) {
      return {
        ...state,
      }
    },
    onNewPostSuccess(state, post: Post) {
      return {
        ...state,
        posts: [post, ...state.posts],
      }
    },
    onNewPostsFailed(state, error: Error | any) {
      return {
        ...state,
      }
    },
    onUserLoaded(state, user: User) {
      return {
        ...state,
        currentUser: user,
      }
    },
    onNewCommentSuccess(state, comment: Comment) {
      const newPosts = [...state.posts]
      const found = newPosts.find((p) => p.id === comment.postId)
      if (found) {
        found.comments = [comment, ...(found.comments ?? [])]
      }

      return {
        ...state,
        posts: newPosts,
      }
    },
    onNewCommentFailed(state, error: Error | any) {
      return {
        ...state,
      }
    },
  },
  effects: (dispatch) => ({
    loadUser() {
      const user = {
        name: localStorage.getItem('USER') as string,
        avatar: localStorage.getItem('AVATAR') as string,
      }

      dispatch.post.onUserLoaded(user)
    },
    storeUser(user: User) {
      localStorage.setItem('USER', user.name)
      localStorage.setItem('AVATAR', user.avatar)
      dispatch.post.onUserLoaded(user)
    },
    async getPosts() {
      try {
        const getPosts = async () => {
          const { data = { posts: [] } } = await axios.get<GetPostsResponse>(
            'https://production.mysocialmedia.tunghsul.workers.dev/api/posts'
          )

          const { posts } = data
          return posts
        }

        const getComments = async () => {
          const { data = { comments: [] } } =
            await axios.get<GetCommentsResponse>(
              'https://production.mysocialmedia.tunghsul.workers.dev/api/comments'
            )

          const { comments } = data
          return comments
        }

        const posts = await getPosts()
        const comments = await getComments()

        dispatch.post.onGetPostsSuccess({ posts, comments })
      } catch (err) {
        dispatch.post.onGetPostsFailed(err)
      }
    },
    async newPost(post: Post) {
      try {
        const { data = {} } = await axios.post(
          'https://production.mysocialmedia.tunghsul.workers.dev/api/posts',
          post,
          { headers: { 'Content-type': 'application/json' } }
        )

        const { id } = data

        dispatch.post.onNewPostSuccess({
          ...post,
          id,
        })
      } catch (err) {
        dispatch.post.onNewPostsFailed(err)
      }
    },
    async newComment(comment: Comment) {
      try {
        await axios.post(
          'https://production.mysocialmedia.tunghsul.workers.dev/api/comments',
          comment,
          { headers: { 'Content-type': 'application/json' } }
        )
        dispatch.post.onNewCommentSuccess(comment)
      } catch (err) {
        dispatch.post.onNewCommentFailed(err)
      }
    },
    // async uploadImage(img: string) {
    //   try {
    //     const formData = new FormData()
    //     formData.append('image', img)

    //     const { data = {} } = await axios.post(
    //       'https://api.imgur.com/3/upload',
    //       formData,
    //       { headers: { Authorization: 'Client-ID e358ddadc145da6' } }
    //     )

    //     // dispatch.post.onUploadImgSuccess()
    //   } catch (err) {
    //     // dispatch.post.onUploadImgFailed(err)
    //   }
    // },
  }),
})
