import { getDocs, collection } from 'firebase/firestore';
import db from '../api/db';
import createDataContext from './createDataContext';

const getBlogPosts = (dispatch) => {
  return async () => {
    const blogPosts = await getDocs(collection(db, 'blogPosts'));

    const newData = blogPosts.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id ? doc.id : Math.floor(Math.random() * 9999),
      };
    });

    dispatch({ type: 'get_blogPosts', payload: newData });
  };
};

const blogReducer = (state, action) => {
  switch (action.type) {
    case 'add_blogPost':
      return [
        ...state,
        {
          id: Math.floor(Math.random() * 9999),
          title: action.payload.title,
          content: action.payload.content,
        },
      ];
    case 'delete_blogPost':
      return state.filter((blogPost) => blogPost.id !== action.payload);
    case 'edit_blogPost':
      return state.map((blogPost) => {
        return blogPost.id === action.payload.id ? action.payload : blogPost;
      });
    case 'get_blogPosts':
      return action.payload;
    default:
      return state;
  }
};

const addBlogPost = (dispatch) => {
  return (title, content, callback) => {
    dispatch({
      type: 'add_blogPost',
      payload: {
        title,
        content,
      },
    });
    if (callback) {
      callback();
    }
  };
};

const deleteBlogPost = (dispatch) => {
  return (id) => {
    dispatch({ type: 'delete_blogPost', payload: id });
  };
};

const editBlogPost = (dispatch) => {
  return (id, title, content, callback) => {
    dispatch({ type: 'edit_blogPost', payload: { id, title, content } });
    if (callback) {
      callback();
    }
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  [
    {
      id: 1,
      title: 'Test Blog Post 1',
      content: 'Test Blog Post 1 content',
    },
  ]
);
