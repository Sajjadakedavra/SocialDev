const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//@route GET api/profile/me
//@desc Get current user's profile
//@access Private
router.get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile){
           return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});



//@route POST api/profile/
//@desc Create/update a user's profile
//@access Private
router.post('/', [ 
    auth, 
    check('status', 'Status is required').not().isEmpty(), 
    check('skills', 'Skills is required').not().isEmpty() ], 
    async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            //Update
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
            return res.json(profile);
        }

        //Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch(e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }

});


//@route GET api/profile/
//@desc Get all profiles
//@access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().select('-pendingSentRequests -pendingAcceptRequests').populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
})



//@route GET api/profile/user/:user_id
//@desc Get profile by user id
//@access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.json(profile);
    } catch (e) {
        console.error(e.message);
        if (e.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send();
    }
})



//@route Delete api/profile
//@desc Delete profile, user, and posts
//@access Private

router.delete('/', auth, async (req, res) => {
    try {
        //Remove user posts
        await Post.deleteMany({ user: req.user.id });

        //Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        //Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
})



//@route PUT api/profile/experience
//@desc Add profile experience
//@access Private

router.put('/experience', 
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(), 
            check('company', 'Company is required').not().isEmpty(), 
            check('from', 'From date is required').not().isEmpty()
        ] 
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Server Error');
        }
})




//@route Delete api/profile/experience/:exp_id
//@desc Delete experience from profile
//@access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        //Getting profile of logged in user
        const profile = await Profile.findOne({ user: req.user.id });

        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
})




//@route PUT api/profile/education
//@desc Add profile education
//@access Private

router.put('/education', 
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(), 
            check('degree', 'Degree is required').not().isEmpty(), 
            check('fieldofstudy', 'Field of study is required').not().isEmpty(), 
            check('from', 'From date is required').not().isEmpty()
        ] 
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile);
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Server Error');
        }
})



//@route Delete api/profile/education/:edu_id
//@desc Delete education from profile
//@access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        //Getting profile of logged in user
        const profile = await Profile.findOne({ user: req.user.id });

        //Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
})



//@route Get api/profile/github/:username
//@desc Get user repos from Github
//@access Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
            &client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200) {
               return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        })
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
})



router.put('/addFriend/:user_id', auth, async (req, res) => {
    try {

        if(req.user.id.toString() === req.params.user_id){
            return res.json('Cannot send friend request to yourself');
        }

        const respondingUserProfile = await Profile.findOne({ user: req.params.user_id })
        const requestingUserProfile = await Profile.findOne({ user:req.user.id })
        
        if (respondingUserProfile.friends){
            if(respondingUserProfile.friends.filter(friend => friend._id.toString() === req.user.id).length > 0){
                return res.json({ msg: 'You are already friends' });
            }
        }

        // if (respondingUserProfile.friends){
        //     respondingUserProfile.friends.map(friend => console.log(friend._id))
        // }

        if (requestingUserProfile.pendingSentRequests) {
            if (requestingUserProfile.pendingSentRequests.filter(friend => friend.user.toString() === req.params.user_id).length > 0){
                return res.json({ msg: 'Request already sent' });
            }
        }

        if (requestingUserProfile.pendingAcceptRequests) {
            if (requestingUserProfile.pendingAcceptRequests.filter(friend => friend.user.toString() === req.params.user_id).length > 0){
                return res.json({ msg: 'This person has already sent you a friend request.' });
            }
        }
    
       requestingUserProfile.pendingSentRequests.unshift({ user: req.params.user_id });
       respondingUserProfile.pendingAcceptRequests.unshift({ user: req.user.id });

       await requestingUserProfile.save();
       await respondingUserProfile.save();

        res.json({ msg: 'Friend request sent' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})



router.get('/requests', auth, async (req, res) => {
    try {
        const requests = await Profile.find({user: req.user.id});
        res.json(requests);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})



router.delete('/deleteRequest/:user_id', auth, async (req, res) => {
    try {
        const requestingUserProfile = await Profile.findOne({ user: req.user.id });
        const respondingUserProfile = await Profile.findOne({ user: req.params.user_id });

        if (requestingUserProfile.pendingSentRequests){
            if (requestingUserProfile.pendingSentRequests.filter(friend => friend.user.toString() === req.params.user_id).length > 0){
                const removeIndex = requestingUserProfile.pendingSentRequests.map(item => item.id).indexOf(req.params.user_id);
                requestingUserProfile.pendingSentRequests.splice(removeIndex, 1);
                // console.log('done 1')
            }
            // else {
            //     return res.json({ msg: 'Error 1' })
            // }
        }

        if (requestingUserProfile.pendingAcceptRequests){
            if (requestingUserProfile.pendingAcceptRequests.filter(friend => friend.user.toString() === req.params.user_id).length > 0){
                const removeIndex = requestingUserProfile.pendingAcceptRequests.map(item => item.id).indexOf(req.params.user_id);
                requestingUserProfile.pendingAcceptRequests.splice(removeIndex, 1);
                // console.log('done 2')
            }
            // else {
            //     return res.json({ msg: 'Error 2' })
            // }
        }

        if (respondingUserProfile.pendingAcceptRequests){
            if (respondingUserProfile.pendingAcceptRequests.filter(friend => friend.user.toString() === req.user.id).length > 0){
                const removeIndex = respondingUserProfile.pendingAcceptRequests.map(item => item.id).indexOf(req.user.id);
                respondingUserProfile.pendingAcceptRequests.splice(removeIndex, 1);
                // console.log('done 3')
            }
            // else {
            //     return res.json({ msg: 'Error 3' })
            // }
        }

        if (respondingUserProfile.pendingSentRequests){
            if (respondingUserProfile.pendingSentRequests.filter(friend => friend.user.toString() === req.user.id).length > 0){
                const removeIndex = respondingUserProfile.pendingSentRequests.map(item => item.id).indexOf(req.user.id);
                respondingUserProfile.pendingSentRequests.splice(removeIndex, 1);
                // console.log('done 4')
            }
            // else {
            //     return res.json({ msg: 'Error 4' })
            // }
        }

        await requestingUserProfile.save();
        await respondingUserProfile.save();
        
        res.json( {msg: 'Friend request removed'} );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})




router.put('/acceptRequest/:user_id', auth, async (req, res) => {
    try {
        const reqUser = await Profile.findOne({ user: req.user.id });
        const resUser = await Profile.findOne({ user: req.params.user_id });

        if(reqUser.pendingAcceptRequests.filter(friend => friend.user.toString() === req.params.user_id).length = 0){
            return res.json({ msg: 'This person has not yet requested to connect' });
        }

        //if the same person is accepting the request who sent it in the first place
        if(reqUser.pendingSentRequests.filter(friend => friend.user.toString() === req.params.user_id).length > 0){
            return res.json({ msg: 'You cant accept the requests you sent' });
        }

        if(reqUser.friends){
            if(reqUser.friends.filter(friend => friend._id.toString() === req.params.user_id).length > 0){
                return res.json({msg: 'You are already friends'});
            }
        }

        if (reqUser.pendingAcceptRequests){
            if(reqUser.pendingAcceptRequests.filter(friend => friend.user.toString() === req.params.user_id).length > 0){
                let removeIndex = reqUser.pendingAcceptRequests.map(item => item.id).indexOf(req.params.user_id);
                reqUser.pendingAcceptRequests.splice(removeIndex, 1);   //deleting from requests
                reqUser.friends.unshift(req.params.user_id);    //adding friend

                removeIndex = resUser.pendingSentRequests.map(item => item.id).indexOf(req.user.id);
                resUser.pendingSentRequests.splice(removeIndex, 1);   //deleting from requests
                resUser.friends.unshift(req.user.id);    //adding friend
            }
            else {
                return res.json({ msg: 'No such request found' });
            }
        }

        await reqUser.save();
        await resUser.save();

        res.json({ msg: 'You are now friends' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server Error');
    }
})




router.delete('/removeFriend/:user_id', auth, async (req, res) => {
    try {
        const reqUser = await Profile.findOne({ user: req.user.id });
        const resUser = await Profile.findOne({ user: req.params.user_id });

        if(reqUser.friends){
            if(reqUser.friends.filter(friend => friend.id === req.params.user_id).length > 0){
                let removeIndex = reqUser.friends.map(item => item.id).indexOf(req.params.user_id);
                reqUser.friends.splice(removeIndex, 1);   //deleting from friends

                removeIndex = resUser.friends.map(item => item.id).indexOf(req.user.id);
                resUser.friends.splice(removeIndex, 1);   //deleting from friends
            }
            else {
                return res.json({ msg: 'You are not friends' });
            }

        }

        await reqUser.save();
        await resUser.save();

        res.json({ msg: 'User removed from friend list' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;