import { post } from 'request';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from '../constants/actionTypes';

const INIT_STATE = {
    posts: [],
    post: null,
    loading: true,
    error: {}
}

export default ( state = INIT_STATE, action ) => {

    switch(action.type){
        
        case GET_POSTS:
            return { ...state, loading: false, posts: action.payload };

        case GET_POST:
            return { ...state, loading: false, post: action.payload };

        case ADD_POST:
            return { ...state, loading: false, posts: [action.payload, ...state.posts ] };  //assign to posts all current posts in reducer plus the additional newly created post coming as payload

        case DELETE_POST:
            return { ...state, loading: false, 
                    posts: state.posts.filter(post => post._id !== action.payload) } //return all posts except for the one that got deleted

        case UPDATE_LIKES:
            return {  ...state, loading: false, 
                    posts: state.posts.map(post => post._id === action.payload.postId ? {...post, likes: action.payload.likes} : post ) }

        case ADD_COMMENT:
            return { ...state, loading: false, post: { ...state.post, comments: action.payload } }

        case REMOVE_COMMENT:
            return {  ...state, loading: false, post: { ...state.post, comments: state.post.comments.filter(comment => comment._id !== action.payload) } }

        case POST_ERROR:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;

    }   
}