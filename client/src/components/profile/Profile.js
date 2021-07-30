import React, {Fragment, useEffect} from 'react';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
import { getProfileById } from '../../store/action/profile';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFriend, removeFriend, acceptRequest, deleteRequest } from '../../store/action/profile';

const Profile = ({ match }) => {

    const dispatch = useDispatch();

    const auth = useSelector( state => state.auth );
    const userProfile = useSelector( state => state.profile );
    const { profile, loading } = userProfile;

    useEffect( () => {
        dispatch(getProfileById(match.params.id));
    }, [dispatch, match.params.id] );

    //Check if logged in user has sent a friend request to this profile
    const checkPendingAcceptReq = () => {
        if(profile.pendingAcceptRequests.filter( req => req.user === auth.user._id ).length > 0){
            return true;
        }
        return false;
    }

    //Check if logged in user has received a friend request from this profile
    const checkPendingSentReq = () => {
        if(profile.pendingSentRequests.filter( req => req.user === auth.user._id ).length > 0){
            return true;
        }
        return false;
    }


    return(
        <Fragment>
                { profile === null || loading ? <Spinner/>
                :
                <Fragment>
                    <Link to='/profiles' className='btn btn-light'>Back to profles</Link>
                    { auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && 
                    (<Link to='/edit-profile' className='btn btn-dark'>Edit profile</Link>) }

                      {/*if user is authenticated and profile has loaded and user is not on his own profile and user is not currently friends with the current profile
                      then check to see if user has sent friend req to current profile and display 'dlt fr req' button else see if current profile has sent friend req to the user
                      then display 'accept friend req' button else if neither the user nor the profile has sent req to each other then display 'add friend' button
                      else if the user is already friends with the profile then display 'remove friend' button */} 

                    { auth.isAuthenticated && auth.loading === false && auth.user._id !== profile.user._id && profile.friends.filter(friend => friend._id === auth.user._id).length === 0 ? 
                        (
                            checkPendingAcceptReq() ? 
                            (<button onClick={() => dispatch(deleteRequest(match.params.id))} className='btn btn-danger'>Delete sent request</button>) 
                            : 
                            (checkPendingSentReq() ? 
                            (<div>
                                <button onClick={() => dispatch(acceptRequest(match.params.id))} className='btn btn-dark'>Accept friend request</button>
                                <button onClick={() => dispatch(deleteRequest(match.params.id))} className='btn btn-danger'>Delete received request</button>
                            </div>) 
                            : 
                            (<button onClick={(e) => dispatch(addFriend(match.params.id))} className='btn btn-dark'>Add friend</button>))
                        ) 
                        : 
                        (
                            auth.user._id !== profile.user._id && (<button onClick={() => dispatch(removeFriend(match.params.id))} className='btn btn-danger'>Remove friend</button>)
                        ) 
                    }

                    <div class="profile-grid my-1">
                        <ProfileTop profile={profile} />

                        <ProfileAbout profile={profile} />

                        <div className='profile-exp bg-white pp-2'>
                            <h2 className='text-primary m-1'>Experience</h2> 
                            { profile.experience.length > 0 ? 
                            (<Fragment>
                                {profile.experience.map(experience => (<ProfileExperience key={experience._id} experience={experience} />))}
                            </Fragment>) 
                            : 
                            (<h4 className='m-1'>No experience credentials</h4>) }
                        </div>

                        <div className='profile-edu bg-white pp-2'>
                            <h2 className='text-primary m-1'>Education</h2> 
                            { profile.education.length > 0 ? 
                            (<Fragment>
                                {profile.education.map(education => (<ProfileEducation key={education._id} education={education} />))}
                            </Fragment>) 
                            : 
                            (<h4 className='m-1'>No education credentials</h4>) }
                        </div>

                        { profile.githubusername && (<ProfileGithub username={profile.githubusername} />) }

                    </div>
                </Fragment> }

        </Fragment>
    )
}

export default Profile;