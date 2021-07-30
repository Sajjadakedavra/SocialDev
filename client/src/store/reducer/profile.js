import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_REPOS } from "../constants/actionTypes"

const INIT_STATE = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default (state = INIT_STATE, action) => {

    switch (action.type){

        case GET_PROFILE:
        case UPDATE_PROFILE:
            return { ...state, loading: false, profile: action.payload };

        case GET_PROFILES:
            return { ...state, loading: false, profiles: action.payload };

        case GET_REPOS:
            return { ...state, loading: false, repos: action.payload };
        
        case PROFILE_ERROR:
            return { ...state, loading: false, error: action.payload };

        case CLEAR_PROFILE:
            return { ...state, profile: null, repos: [], loading: false };

        default:
            return state;
    }
}