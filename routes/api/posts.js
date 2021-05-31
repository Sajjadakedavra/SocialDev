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
                private: req.body.private   //field added by me for extra feature to make posts private
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
        const user = req.user.id
        const posts = await Post.find( { $or: [ { user: req.user.id }, { user: { $ne: req.user.id }, private: false } ] } ).sort( { date: -1 } );

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

        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        
        if(req.user.id.toString() === post.user.toString()){
            //post is created by the same user that is requesting it
            return res.json(post);
        }
        else if(post.private === false){
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

module.exports = router;
