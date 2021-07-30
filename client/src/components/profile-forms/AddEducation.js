import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { addEducation } from '../../store/action/profile';
import { Link } from 'react-router-dom';

const AddEducation = () => {

    const dispatch = useDispatch();
    const history = useHistory();



    const [formData, setFormData] = useState({
        degree: '',
        school: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        description: '',
    });

    const [toDateDisabled, toggleDisabled] = useState(false);

    const { school, degree, fieldofstudy, from, to, current, description } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    return(
        <Fragment>

             <h1 class="large text-primary">Add Your Education</h1>

            <p class="lead">
                <i class="fas fa-code-branch"></i> Add any school/bootcamp that you have attended
            </p>

            <small>* = required field</small>
            
            <form class="form"
             onSubmit={ e => {
                e.preventDefault();
                dispatch(addEducation(formData, history));
            } }>
                <div class="form-group">
                <input type="text" placeholder="* School/Bootcamp" name="school" required value={school} onChange={e => onChange(e)} />
                </div>

                <div class="form-group">
                <input type="text" placeholder="* Degree/Certificate" name="degree" required value={degree} onChange={e => onChange(e)} />
                </div>

                <div class="form-group">
                <input type="text" placeholder="field of study" name="fieldofstudy" value={fieldofstudy} onChange={e => onChange(e)} />
                </div>

                <div class="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={e => onChange(e)} />
                </div>

                <div class="form-group">
                <p><input type="checkbox" name="current" checked={current} value={current}
                //setformdata reverses the value of what currently the value of 'current' is and does same with below comment
                //toggledisabled changes value of toDataDisabled to hide the 'to date' form if we are currently working at a job  
                onChange={e => {setFormData({ ...formData, current: !current }); toggleDisabled(!toDateDisabled)}} /> 
                {' '}Current School</p>
                </div>

                <div class="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" 
                value={to} onChange={e => onChange(e)}
                //disable if todatedisabled is true so means the user is currently working at their job
                disabled={toDateDisabled ? 'disabled' : ''} />
                </div>

                <div class="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Program Description"
                    value={description} onChange={e => onChange(e)}
                ></textarea>
                </div>

                <input type="submit" class="btn btn-primary my-1" />
                
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </Fragment>
    )
}


export default AddEducation;