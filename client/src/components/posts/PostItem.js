import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../store/action/post';


const PostItem = ({ post, showActions=true }) => {

    const dispatch = useDispatch();
    const auth = useSelector( state => state.auth );
    const { _id, name, text, avatar, user, likes, comments, date } = post;


    return(
        <div class="post bg-white p-1 my-1">

          <div>
            <Link to={`/profile/${user}`}>
              <img class="round-img" src={avatar} alt="" />
              <h4>{name}</h4>
            </Link>
          </div>

          <div>
            <p class="my-1">{text}</p>

            <p class="post-date">Posted on {<Moment format='YYYY/MM/DD'>{date}</Moment>}</p>

            {showActions && (
            <Fragment>
              <button onClick={(e) => dispatch(addLike(_id))} type="button" class="btn btn-light">
                <i class="fas fa-thumbs-up"></i>{' '}
                <span>{likes.length > 0 && (<span>{likes.length}</span>)}</span>
              </button>

              <button onClick={(e) => dispatch(removeLike(_id))} type="button" class="btn btn-light">
                <i class="fas fa-thumbs-down"></i>
              </button>

              <Link to={`/posts/${_id}`} class="btn btn-primary">
                Discussion {comments.length > 0 && (<span class='comment-count'>{comments.length}</span>)}
              </Link>

              { !auth.loading && user === auth.user._id && (
              <button onClick={e => dispatch(deletePost(_id))} type="button" class="btn btn-danger">
                  <i class="fas fa-times"></i>
              </button>
              ) }
            </Fragment>)}

          </div>

        </div>
    )
}


export default PostItem;