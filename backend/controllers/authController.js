'use strict';

// User DB
import {User} from "../models/userModel.js";

// Network Error class
import { NetworkError } from "../utils/errorHandler.js";

// JWT
import jwt from "jsonwebtoken"; 
const {sign, verify} = jwt;


/**
 * Create JWT Access token, payload: User.username
 * @param {String} username User name 
 * @param {String} type Token type, either ACCESS or REFRESH
 * @returns {String} JWT token
 */
export const createJWT = (username, type)=>{
    const secret = (type ==='ACCESS'?(process.env.ACCESS_TOKEN_SECRET):(process.env.REFRESH_TOKEN_SECRET));
    const duration = (type ==='ACCESS'?(process.env.ACCESS_TOKEN_DURATION):(process.env.REFRESH_TOKEN_DURATION));
    return sign(
        {
            username
        },
        secret,
        {expiresIn: duration}
    );
}

/**
 * Create JWT access and refresh tokens. Returns access token, and sets refresh token in HttpOnly Cookie
 * @param {Object} res Http response object 
 * @param {String} username Token body payload
 * @returns {String, Number} access token and expiration
 */
export const createTokens = (res, username)=> {
    // Access token with expiration in ms
    const accessToken = createJWT(username, 'ACCESS')
    const expiration = parseInt(process.env.ACCESS_TOKEN_DURATION) * 1000

    // Refresh token in HttpOnly Cookie
    const refreshToken = createJWT(username, 'REFRESH')
    const maxAge = 7*24*60*60;  // 7 days in seconds
    res.setHeader("Set-Cookie", `refreshToken=${refreshToken}; Max-Age=${maxAge}; Path=/; Secure; HttpOnly; SameSite=None`)

    return {accessToken, expiration}
}

/**
 * Verify access token. 
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 * @returns {string} Decoded payload i.e. username
 */
export const verifyAccess = (req, res) =>{
    try{
        // Extracting Token
        const authHeader = req.headers['authorization'] || req.headers['Authorization'] 
        
        if(!authHeader?.startsWith('Bearer ')){
            // Missing Token
            throw new NetworkError(401,"Unathorized")
        }
        
        const token = authHeader.split(' ')[1]
        let decoded = null;
        try {
            decoded = verify(token, process.env.ACCESS_TOKEN_SECRET)
        }catch(error){
            // Invalid Token
            throw new NetworkError(403,"Forbidden")
        }
        
        // True 
        return decoded.username;

    }catch(error){
        // Error
        res.statusCode = error.status;
        res.end(JSON.stringify({error: error.message}))
    }
};

/** 
 * Verify refresh token and provide new access token.
 * @async
 * @param {String} refreshToken 
 * @returns {Object} new access token and expiration
 */
export const verifyRefresh =  async (refreshToken) =>{

    // Verify valid refresh token
    let decoded;
    try{
        // Decode token
        decoded = verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
    }catch(error){
        throw new NetworkError(403,"Forbidden")
    }

    // Find User
    const foundUser = await User.findOne({username:decoded.username})
    .then((user)=>{
        if(!user){
            // Not found
            throw new NetworkError(401,"Unauthorized")
        }
        return user;
    })

    // Create new Access token
    const accessToken = createJWT(foundUser.username, 'ACCESS')
    const expiration = parseInt(process.env.ACCESS_TOKEN_DURATION) * 1000
    
    return {accessToken, expiration};
};

/** 
 * Get refresh token.
 * @param {Object} req Http request 
 * @returns {String} refresh token
 */
export const getRefreshToken = (req)=>{
    // Validate Cookie
    const cookies = req.headers.cookie;
    if(!cookies) throw new NetworkError(401,"Unauthorized")
    
    // Extract refresh token
    const refreshToken = cookies.match(`(?:(?:^|.*; *)refreshToken *= *([^;]*).*$)|^.*$`)[1]
    return refreshToken;
}

/** 
 * Expire refresh token
 * @param {Object} req Http request
 * @param {Object} res Http response 
 */
export const expireRefreshToken = (req, res) =>{
    // Check for Cookie
    const cookies = req.headers.cookie;
    if(!cookies) { 
        res.statusCode = 204;
        res.end(JSON.stringify({error: "No Content"}))
        return true;
    }
    // Expire Cookie
    res.setHeader("Set-Cookie",`refreshToken=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=None`)
}