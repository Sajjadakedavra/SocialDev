import { REMOVE_ALERT, SET_ALERT } from "../constants/actionTypes";
import { v4 as uuidv4 } from 'uuid';


export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuidv4();   //creates a random universal id through an npm package called uuid
    dispatch({ 
        type: SET_ALERT, 
        payload: { msg, alertType, id } 
    });

    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), timeout);
};