import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner'; 
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../store/action/post';

const Posts = () => {

    const dispatch = useDispatch();
    const posts = useSelector( state => state.post.posts );

    useEffect( () => {
        dispatch(getPosts());
    }, [dispatch] )

    return(
        <div>
            { posts.loading ? <Spinner /> : 
            (
                <Fragment>
                    <h1 className='large text-primart'>Posts</h1>
                    <p className='lead'><i className='fas fa-user'></i>Welcome to the community</p>
                    <PostForm />
                    <div className='posts'>
                        { posts.map( post => (
                            <PostItem key={post._id} post={post} />
                        ) ) }
                    </div>
                </Fragment>
            ) }
        </div>
    )
}


export default Posts;