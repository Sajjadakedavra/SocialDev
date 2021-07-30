import React, { Fragment } from 'react';
import {Link} from 'react-router-dom';
import { logout } from '../../store/action/auth';
import { useDispatch, useSelector } from 'react-redux';

const Navbar = () => {

  const dispatch = useDispatch();
  const checkForAuthentication = useSelector( state => state.auth );
  const { loading, isAuthenticated } = checkForAuthentication;

 return(
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i classname="fas fa-code"></i> Social Dev</Link>
      </h1>

      {/* if loading is false then check for isAuthenticated and show respective links */}
      { !loading && 
        ( <Fragment>
          { 
          isAuthenticated ? 
          <ul>
            <li><Link to='/profiles'>Developers</Link></li>
            <li><Link to='/posts'>Posts</Link></li>
            <li><Link to="/dashboard"><i className='fas fa-user'/>{' '}<span className='hide-sm'>Dashboard</span></Link></li>
            <li> 
              <a onClick={() => dispatch(logout())} href='#!'>
                <i className='fas fa-sign-out-alt'/>{' '}
                <span className='hide-sm'>Logout</span>
              </a>
            </li> 
          </ul>
          : 
          <ul>
            <li><Link to='/profiles'>Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
          }
          </Fragment> 
        ) 
        }

    </nav>
 )   

};

export default Navbar;