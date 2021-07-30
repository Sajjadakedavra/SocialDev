import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../store/action/alert';
import { register } from '../../store/action/auth';

const Register = () => {

    const dispatch = useDispatch();
    const isAuthentiatedVal = useSelector( state => state.auth );

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData; 

    /*[e.target.name] is used to access the value of the key provided within the square brackets.
    so when calling onChange inside html tags, it will call our own onChange function below which will call
    setFormData and keep a copy of the current values within formData and only change the value of the key we
    provided within the sq.brackets
    in [e.target.name], name is a key in all out fields with values of "name", "email", "password", "password2"
    */
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2){
            dispatch(setAlert('Passwords do not match', 'danger', 3000));
            //console.log(alertStatus);
        }
        else{
           dispatch(register({name, email, password}));
        }
    }

    //Redirect if logged in
    if(isAuthentiatedVal.isAuthenticated){
      return <Redirect to = '/dashboard' />
  }

    return(
        <Fragment>
            <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i class="fas fa-user"></i> Create Your Account</p>
      
      <form className="form" onSubmit={e => onSubmit(e)}>

        <div className="form-group">
          <input type="text" 
          placeholder="Name" 
          name="name" 
          value={name} 
          onChange={e => onChange(e)} 
          required />
        </div>

        <div className="form-group">
          <input type="email" 
          placeholder="Email Address" 
          name="email" 
          value={email} 
          onChange={e => onChange(e)} 
          required />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} onChange={e => onChange(e)}
            minLength="6"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2} onChange={e => onChange(e)}
            minLength="6"
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
        </Fragment>
    )
}

export default Register;