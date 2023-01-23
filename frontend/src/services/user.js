// Axios app instance
import AppClient from "./axios";

// JWT manager, stored in memory
import inMemoryJWT from './inMemoryJWT';


/**
 * Register new User
 * @param {Object} user Payload containing username and password
 * @returns {Object} Server Response
 */
const register = async (user)=>{
    return await AppClient
    .post('Register', user)
    .then((res)=>{
        // If success
        if(res.data.accessToken){
            // Store access token
            inMemoryJWT.setToken(res.data.accessToken, res.data.expiration)
        }
        return res;
    })
    .catch(err => {
        if(err.response){
            // Client recieved error response
            // console.log(err.response.data);
            // console.log(err.response.status);
            // console.log(err.response.headers);
            return err.response; 
        } else if(err.request) {
            // Client never recieved a response
            // console.log(err.request);
            return err.request; 
        }else {
            // console.log('Error', err.message);
        }
        console.log(err.config);
    })
}

/**
 * Authenticate User
 * @param {Object} user Payload containing username and password
 * @returns {Object} Server Response
 */
const login = async (user)=>{
    return await AppClient
    .post('Authenticate', user)
    .then((res)=>{
        // If success
        if(res.data.accessToken){
            // Store access token
            inMemoryJWT.setToken(res.data.accessToken, res.data.expiration)
        }
        return res;
    })
    .catch(err => {
        if(err.response){
            // Client recieved error response
            // console.log(err.response.data);
            // console.log(err.response.status);
            // console.log(err.response.headers);
            return err.response; 
        } else if(err.request) {
            // Client never recieved a response
            // console.log(err.request);
            return err.request; 
        }else {
            // console.log('Error', err.message);
        }
        console.log(err.config);
    })
}

/**
 * Refresh access token
 * @returns {Object} Server Response
 */
const refresh = async ()=>{
    return await AppClient
    .post('Authenticate/Refresh')
    .then((res)=>{
        // If success
        if(res.data.accessToken){
            // Store access token
            inMemoryJWT.setToken(res.data.accessToken, res.data.expiration)
        }
        return res;
    })
    .catch(err => {
        if(err.response){
            // Client recieved error response
            // console.log(err.response.data);
            // console.log(err.response.status);
            // console.log(err.response.headers);
            return err.response; 
        } else if(err.request) {
            // Client never recieved a response
            // console.log(err.request);
            return err.request; 
        }else {
            // console.log('Error', err.message);
        }
        console.log(err.config);
    })
}

/**
 * Logout User
 * @returns {Object} Server Response
 */
const logout = async ()=>{
    return await AppClient
    .post('Authenticate/Logout')
    .then((res)=>{
        // If success
        if(res.status===204 || res.status===200){
            // Delete access token in memory
            inMemoryJWT.deleteToken();
        }
        return res;
    })
    .catch(err => {
        if(err.response){
            // Client recieved error response
            // console.log(err.response.data);
            // console.log(err.response.status);
            // console.log(err.response.headers);
            return err.response; 
        } else if(err.request) {
            // Client never recieved a response
            // console.log(err.request);
            return err.request; 
        }else {
            // console.log('Error', err.message);
        }
        console.log(err.config);
    })
}

const UserService = {
    register,
    login,
    refresh,
    logout
}

export default UserService;