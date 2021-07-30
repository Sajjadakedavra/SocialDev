import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getPost } from '../../store/action/post';
import { Link } from 'react-router-dom';

const Post = ({ match }) => {

    const dispatch = useDispatch();
    const postData = useSelector( state => state.post );
    const { post, loading } = postData;
    
    useEffect(()=> {
        dispatch(getPost(match.params.id));
    }, [dispatch]);

    return(
        <div>
            {loading || post === null ? <Spinner /> : 
            <Fragment>
                <Link to='/posts' className='btn'>Back to posts</Link>
                {/*renders the post item that was brought in with post id and shows a comment form*/}
                <PostItem post={post} showActions={false} /> 
                <CommentForm postId={post._id} />
                <div className='comments'>
                    {post.comments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} postId={post._id} />
                    ))}
                </div>
                </Fragment>}
        </div>
    )
}


export default Post;