import React, {useState, Fragment} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../store/action/post';


const PostForm = () => {

    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const [privatePost, setPrivatePost] = useState(false);

    return(
        <div class="post-form">
            <div class="bg-primary p">
                <h3>Say Something...</h3>
            </div>
            <form class="form my-1" onSubmit={e => {
                e.preventDefault();
                dispatch(addPost({text, privatePost}));
                setText('');
            }}>
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    placeholder="Create a post"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    required
                ></textarea>
                <input type="submit" class="btn btn-dark my-1" value="Submit" />
                Make this post private? <input type="checkbox" checked={privatePost} value={privatePost} onChange={e => setPrivatePost(!privatePost)} />
            </form>
      </div>
    )
}


export default PostForm;