const { request } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post'); 
const Profile = require('../../models/Profile'); 
const User = require('../../models/User'); 

//@route POST api/posts
//@desc Create a post
//@access Private
router.post('/', [ 
        auth, 
        [
        check('text', 'Text is required').not().isEmpty()
        ] 
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');   
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
                private: req.body.privatePost   //field added by me for extra feature to make posts private
            }); 

            const post = await newPost.save();

            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        
});



//@route GET api/posts
//@desc Get all posts that are public
//@access Private
router.get('/', auth, async (req, res) => {
    try {
        const reqUser = await Profile.findOne({ user: req.user.id });
        const user = req.user.id;
        // const post = []

        // if(reqUser.friends && reqUser.friends.length > 0){
        //     reqUser.friends.forEach(async friend => {
        //         post.push( await Post.find({ user: friend._id, private: true }) )
        //     });
        // }            

        const posts = await Post.find( { $or: [ { user: req.user.id }, { user: { $ne: req.user.id }, private: false } ] } ).sort( { date: -1 } );

        // post.map(p => posts.unshift(p));

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})




//@route GET api/posts/:id
//@desc Get post by id
//@access Private
router.get('/:id', auth, async (req, res) => {
    try {

        const reqUser = await Profile.findOne({ user: req.user.id });
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        
        if(req.user.id.toString() === post.user.toString()){
            //post is created by the same user that is requesting it
            return res.json(post);
        }
        else if(post.private === false || reqUser.friends.filter(friend => friend.id.toString() === post.user.toString()).length > 0 ){
            //post is public and created by different user than the one requesting it
            return res.json(post);
        }
        else{
            //post is private and created by different user than the one requesting it
            return res.status(404).json({ msg: 'Post not found' });
        }
        
        
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})



//@route DELETE api/posts/:id
//@desc Delete post by id
//@access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }

        if (post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }

        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
})




//@route PUT api/posts/like/:id
//@desc Like a post
//@access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const reqUser = await Profile.findOne({ user: req.user.id });
        
        if(post.private === true && req.user.id.toString() !== post.user.toString() ){
            if(reqUser.friends.length > 0){
                reqUser.friends.filter(function(friend){
                    if(friend._id.toString() !== post.user.toString()){
                        return res.json({ msg: 'Not authorized 1' });
                    }
                }) 
            } else {
                return res.json({ msg: 'Not authorized 2' });
            }
        }

        //Checking if post is already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ msg: 'Post already liked' })
        }

        if(!post){
            return res.json({ msg: 'Post not found' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})



//@route PUT api/posts/unlike/:id
//@desc Unlike a post
//@access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Checking if post is not liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({ msg: 'Post has not yet been liked' })
        }

        if(!post){
            return res.json({ msg: 'Post not found' });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})



//@route PUT api/posts/comment/:id
//@desc Comment on a post
//@access Private

router.post('/comment/:id', 
    [
        auth,
        [
            check('text', 'Text is required').not().isEmpty()
        ]
    ], async (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const reqUser = await Profile.findOne({ user: req.user.id });
        
        if(post.private === true && req.user.id.toString() !== post.user.toString() ){
            if(reqUser.friends.length > 0){
                reqUser.friends.filter(function(friend){
                    if(friend._id.toString() !== post.user.toString()){
                        return res.json({ msg: 'Not authorized 1' });
                    }
                    else {
                        const newComment = {
                            text: req.body.text,
                            name: user.name,
                            avatar: user.avatar,
                            user: req.user.id
                        };
                
                        post.comments.unshift(newComment);
                    }
                }) 
            } else {
                return res.json({ msg: 'Not authorized 2' });
            }
        } else {
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };
    
            post.comments.unshift(newComment);
        }        
        await post.save();
        return res.json(post.comments);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




//@route DELETE api/posts/delete/:id/:comment_id
//@desc Delete comment
//@access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if(!comment){
            return res.status(404).json({ msg: 'Comment does not exists' });
        }

        //Check user
        if (comment.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User not authorized' });
        }

        //Get removeIndex
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
