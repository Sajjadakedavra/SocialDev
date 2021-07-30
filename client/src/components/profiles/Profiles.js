import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../store/action/profile';
import ProfileItem from './ProfileItem';

const Profiles = () => {

    const dispatch = useDispatch();
    const profileReturn = useSelector( state => state.profile );
    const { profiles, loading } = profileReturn;

    useEffect( () => {
        //get all profiles on load
        dispatch(getProfiles());
    }, [dispatch] );

    return(
        <Fragment>
            { loading ? <Spinner /> : 
            <Fragment>
                <h1 className='large text-primary'>Developers</h1>
                <p className='lead'>
                    <i className='fab fa-connectdevelop'></i> Browse and connect with developers
                </p>
                <div className='profiles'>
                    { profiles.length > 0 ? 
                    (
                        profiles.map(profile => (
                            <ProfileItem key={profile._id} profile={profile} />
                        ))
                    ) 
                    : <h4>No profiles found</h4> }
                </div>
            </Fragment> }
        </Fragment>
    )
}


export default Profiles;