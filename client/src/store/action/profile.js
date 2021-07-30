import axios from "axios";
import { setAlert } from "./alert";
import { ACCOUNT_DELETED, CLEAR_PROFILE, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, GET_PROFILES, GET_REPOS,
         /*REQUEST_SENT, REQUEST_ACCEPTED, REQUEST_REMOVED, FRIEND_REMOVED*/ } from "../constants/actionTypes";


// get current user's profile
export const getCurrentProfile = () => async dispatch => {

    try {
        const res = await axios.get('/api/profile/me');

        dispatch({ type: GET_PROFILE, payload: res.data });
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}


//Get all profiles
export const getProfiles = () => async dispatch => {

    dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get('/api/profile');

        dispatch({ type: GET_PROFILES, payload: res.data });
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}



//Get profile by id
export const getProfileById = (userId) => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({ type: GET_PROFILE, payload: res.data });
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}



//Get github repos
export const getGithubRepos = (username) => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({ type: GET_REPOS, payload: res.data });
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}



//create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.post('/api/profile', formData, config);

        dispatch({ type: GET_PROFILE, payload: res.data});

        dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'));

        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;

        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}



// Add Experience
export const addExperience = (formData, history) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({ type: UPDATE_PROFILE, payload: res.data });

        dispatch(setAlert('Experience added!', 'success'));

        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}


// Add Education
export const addEducation = (formData, history) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({ type: UPDATE_PROFILE, payload: res.data });

        dispatch(setAlert('Education added!', 'success'));

        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}



//Delete experience
export const deleteExperience = (id) => async dispatch => {

    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({ type: UPDATE_PROFILE, payload: res.data });

        dispatch(setAlert('Experience removed', 'success'));
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }   
}


//Delete education
export const deleteEducation = (id) => async dispatch => {

    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({ type: UPDATE_PROFILE, payload: res.data });

        dispatch(setAlert('Education removed', 'success'));
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }   
}



//Deletr account and profile
export const deleteAccount = () => async dispatch => {

    if (window.confirm('Do you want to proceed with your action?')){
        try {
            axios.delete('/api/profile');
    
            dispatch({ type: CLEAR_PROFILE });
    
            dispatch({ type: ACCOUNT_DELETED });
    
            dispatch(setAlert('Account deleted'));
        } catch (err) {
            dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
        }
    }

}



// Add friend
export const addFriend = (userId) => async dispatch => {

    try {
        const res = await axios.put(`/api/profile/addFriend/${userId}`);

        // dispatch({ type: REQUEST_SENT, payload: res.data });

        dispatch(setAlert('Friend request sent', 'success'));
        window.location.reload(false);
        
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}

// Remove friend
export const removeFriend = (userId) => async dispatch => {

    try {
        const res = await axios.delete(`/api/profile/removeFriend/${userId}`);

        // dispatch({ type: FRIEND_REMOVED, payload: res.data });

        dispatch(setAlert('Connection removed from friends', 'success'));
        window.location.reload(false);

    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}


// Accept friend request
export const acceptRequest = (userId) => async dispatch => {

    try {
        const res = await axios.put(`/api/profile/acceptRequest/${userId}`);

        // dispatch({ type: REQUEST_ACCEPTED, payload: res.data });

        dispatch(setAlert('You are now friends', 'success'));
        window.location.reload(false);

    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}


// Delete friend request
export const deleteRequest = (userId) => async dispatch => {

    try {
        const res = await axios.delete(`/api/profile/deleteRequest/${userId}`);

        // dispatch({ type: REQUEST_REMOVED, payload: res.data });

        dispatch(setAlert('Request deleted', 'success'));
        window.location.reload(false);
        
    } catch (err) {
        dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
    }
}