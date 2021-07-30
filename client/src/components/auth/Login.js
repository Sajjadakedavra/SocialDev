import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { login }  from '../../store/action/auth';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {

    const dispatch = useDispatch();

    const isAuthentiatedVal = useSelector( state => state.auth );

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData; 

    /*[e.target.name] is used to access the value of the key provided within the square brackets.
    so when calling onChange inside html tags, it will call our own onChange function below which will call
    setFormData and keep a copy of the current values within formData and only change the value of the key we
    provided within the sq.brackets
    in [e.target.name], name is a key in all out fields with values of "name", "email", "password", "password2"
    */
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        dispatch(login(email, password))
    }

   // Redirect if logged in
    if(isAuthentiatedVal.isAuthenticated){
        return <Redirect to = '/dashboard' />
    }

    return(
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><i class="fas fa-user"></i> Sign Into Your Account</p>
                
                <form className="form" onSubmit={e => onSubmit(e)}>

                    <div className="form-group">
                    <input type="email" 
                    placeholder="Email Address" 
                    name="email" 
                    value={email} 
                    onChange={e => onChange(e)} 
                    required />
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

                    <input type="submit" className="btn btn-primary" value="Login" />
                </form>
                <p className="my-1">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </section>
        </Fragment>
    )
}

export default Login;