import React, { useEffect, Fragment } from 'react';
import { getCurrentProfile } from '../../store/action/profile';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../store/action/profile';
import { Link } from 'react-router-dom';

const Dashboard = () => {

    const dispatch = useDispatch();
    const auth = useSelector( state => state.auth );
    const profileFetch = useSelector( state => state.profile );
    const { profile, loading } = profileFetch;

    useEffect( () => {
        dispatch(getCurrentProfile());
    }, [dispatch]) 

    return(
        loading && profile === null ? <Spinner /> : 
        <Fragment> 
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead"><i className="fas fa-user"></i> Welcome { auth.user && auth.user.name }</p>
            { profile !== null ? 
            <Fragment>
                 <DashboardActions />
                 <Experience />
                 <Education /> 

                 <div className='my-2'>
                     <button className='btn btn-danger' onClick={ () => dispatch(deleteAccount()) }>
                         <i className='fas fa-user-minus'>{' '}Delete My Account</i>
                     </button>
                 </div>
            </Fragment> : 
            <Fragment>
                <p>No profile setup yet. Create your profile now!</p>
                <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
            </Fragment> }
        </Fragment>
    )
}

export default Dashboard;