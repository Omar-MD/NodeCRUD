"use strict";

// User DB
import { User } from '../models/userModel.js';

// Request handler
import { bodyParser } from "../utils/requestHandler.js";

// Authentication handlers
import  { createTokens, expireRefreshToken, getRefreshToken, verifyRefresh } from "./authController.js";

/**
 * User Login endpoint. Authenticate user, and provide JWT tokens.
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 */
const login = async (req, res) =>{
    try{
        const {username, password} = await bodyParser(req)
        const user = await User.authenticate(username, password);

        // Creates Access and Refresh Tokens. Refresh Token 
        const {accessToken, expiration} = createTokens(res, user.username);

        res.statusCode = 200;
        res.end(JSON.stringify({accessToken, expiration}));

    }catch(error){
        // Error
        res.statusCode = error.status;
        res.end(JSON.stringify({error: error.message}))
    }
}

/**
 * User Register endpoint. Register user, and provide JWT tokens.
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 */
const register = async (req, res) =>{
    try{
        const {username, password} = await bodyParser(req)
        const user = await User.register(username, password);

        // Creates Access and Refresh Tokens. Refresh Token 
        const {accessToken, expiration} = createTokens(res, user.username);

        res.statusCode = 200;
        res.end(JSON.stringify({accessToken, expiration}));

    }catch(error){
        // Error
        res.statusCode = error.status;
        res.end(JSON.stringify({error: error.message, emptyFields: error.emptyFields}))
    }
}

/**
 * Refresh token endpoint. Verify refresh token and provide new access token.
 * @async
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 */
const refresh = async (req,res) =>{
    try{
        // Extract refresh Token
        const refreshToken = getRefreshToken(req);
  
        // Verify and create new Access Token
        const {accessToken, expiration} = await verifyRefresh(refreshToken)

        res.statusCode = 200;
        res.end(JSON.stringify({accessToken, expiration}));

    }catch(error){
        // Error
        res.statusCode = error.status;
        res.end(JSON.stringify({error: error.message}))
    }
}

/**
 * Logout User endpoint. Expire refreshToken cookie.
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 */
const logout = (req, res)=>{
    const done = expireRefreshToken(req, res); 
    if(!done){
        res.statusCode = 200;
        res.end(JSON.stringify({message: "Cookie cleared"}));
    }
}

const userController = {
    login,
    register,
    refresh,
    logout
}

export default userController;