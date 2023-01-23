'use strict';

// Mongoose
import { Schema, model } from 'mongoose';

// Validator
import validator from 'validator';
const {isStrongPassword} = validator

// Bycrpt
import bcrypt from 'bcrypt';

// Network Error Class
import { NetworkError } from '../utils/errorHandler.js';

// User Schema
const UserSchema = new Schema({
    username: {
        type: String, 
        require: true, 
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String, 
        require: true,
        trim: true,
        minlength: 8
    }
});

/**
 * Static method, validate username and password
 * @param {String} username Username, must only contain [Word character, number, underscore, full stop]  and a minimum length of 3
 * @param {String} password User password, must contain [Capital, lowercase, number, symbol] and a minimum length of 8
 */
UserSchema.statics.validate = function validate(username, password){
    
    let emptyFields =[]
    const strReg = (/^[a-zA-Z0-9._]+$/);  // [Letters, Numbers, uderscores, full Stop]

    // Invalid Username
    if(!username || !strReg.test(username?.trim())){
        emptyFields.push('username')
        throw new NetworkError(400,"Invalid Username. Username can only contain [Letters, Numbers, uderscores, full Stop]", emptyFields)
    }
    if(username.length < 3 || username.length > 20){
        emptyFields.push('username')
        throw new NetworkError(400,"Invalid Username. Username length must be in the range [3-20]", emptyFields);
    }

    // Invalid password
    if(!password){
        emptyFields.push('password')
        throw new NetworkError(400,"Invalid Password",emptyFields);
    }
    if(!isStrongPassword(password)){
        emptyFields.push('password')
        throw new NetworkError(400,"Weak password. Password must contain [ Capital, Lowercase, Number, Symbol ]", emptyFields);
    }
}

/**
 * Static method, register new user. 
 * @param {String} username 
 * @param {String} password 
 * @returns {User} new User Object
 */
UserSchema.statics.register = async function register(username, password){

    // Validate input
    this.validate(username, password);

    // Check if user already exists
    await this.exists({username})
    .then((user) =>{
        if(user){
            throw new NetworkError(409,"User already exists. Please Login");
        }
    })

    // Encrypt user password
    const hash = await bcrypt.hash(password, parseInt(process.env.HASH_SALT))
    .catch((error) =>{
        // Bcrypt error
        throw new NetworkError(500, error.message);
    })

    // Create new User
    const user = await this.create({username, password: hash})
    .catch((error)=>{
        throw new NetworkError(500, error.message);
    })

    return user
}

/**
 * Static method, authenticate user.
 * @param {String} username 
 * @param {String} password 
 * @returns {User} Authenticated user Object
 */
UserSchema.statics.authenticate = async function authenticate(username, password){

    // Find User
    const user = await this.findOne({username})
    .then((user)=>{
        if(!user){
            // Not found
            throw new NetworkError(403,"Invalid Username")
        }
        return user;
    })
    
    // Check Password
    await bcrypt.compare(password, user.password)
    .then((result)=>{
        if(!result){
            // Incorrect password
            throw new NetworkError(401,"Invalid Password")   
        }
    })

    return user
}

export const User = model('User',UserSchema);