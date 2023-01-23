'use strict';

// Mongoose
import mongoose, { Schema, model } from 'mongoose';

// Skill Level DB
import {SkillLevel} from './skillLevelModel.js';

// Validator
import validator from 'validator';
const {isEmail} = validator

// Network Error class
import { NetworkError } from '../utils/errorHandler.js';

// Employees Schema
const EmployeeSchema = new Schema({
    DOB: {
        type: Date,
        required: true,
        default: new Date().toISOString().slice(0,10)
    },
    active: {
        type: Boolean, 
        default:false
    },
    age: {
        type: Number, 
        required: true
    },
    email: {
        type: String, 
        unique: true, 
        lowercase: true,
        required: true,
    },
    firstName: {
        type: String, 
        required: true, 
        trim: true
    },
    lastName: {
        type: String, 
        required: true, 
        trim: true
    },
    skill: {
        type: Schema.Types.ObjectId, 
        ref: 'SkillLevel' 
    },
});


/**
 * Static method, Validate Employee Details
 * @param {Object} payload 
 */
EmployeeSchema.statics.validateEmployee = function validateEmployee(payload){

    let emptyFields = ['firstName', 'lastName', 'age', 'DOB', 'email','active', 'name', 'description'];
    const strReg = (/^[a-zA-Z. ]+$/); //Check for words, space, and .

    // Validate each field
    for(let [key,value] of Object.entries(payload)){
        switch(key){
            case 'skill':
                if(strReg.test(value.name?.trim())){
                    emptyFields = emptyFields.filter(val=> val!=='name');
                }
                if(strReg.test(value.description?.trim())){
                    emptyFields = emptyFields.filter(val=> val!=='description');
                }
                break;

            case 'active':
                // Check Boolean
                if(typeof value === 'boolean'){
                    emptyFields = emptyFields.filter(val=> val!==key);
                }
                break;

            case 'age':
                // Check age > 0
                if(value && value > 0){
                    emptyFields = emptyFields.filter(val=> val!==key);
                }
                break;

            case 'email':
                // Check Valid Email
                if(value && isEmail(value)){
                    emptyFields = emptyFields.filter(val=> val!==key);
                }
                break;

            case 'DOB':
                // Check Valid Email
                if(value){
                    emptyFields = emptyFields.filter(val=> val!==key);
                }
                break;
            case '_id':
                break;

            default:
                if(strReg.test(value?.trim())){
                    emptyFields = emptyFields.filter(val=> val!==key);
                }
        }
    }

    if(emptyFields.length === 1 && emptyFields.includes('email') ){
        // Not a valid Email!
        throw new NetworkError(400,"Please Enter a valid Email", emptyFields);

    }else if (emptyFields.length === 1 && emptyFields.includes('age')){
        // Not a valid Age!
        throw new NetworkError(400,"Please Enter a valid Age", emptyFields);

    }else if (emptyFields.length >0){
        // Unfilled field
        throw new NetworkError(400,"Fields can only contain [Words, space and full stop]", emptyFields);
    }
}


/**
 * Static method, Add new Employee to DB.
 * @param {Object} payload 
 * @returns {String} new Employee id
 */
EmployeeSchema.statics.addEmployee = async function addEmployee(payload){

    // Validate Employee
    this.validateEmployee(payload)
    const {firstName, lastName, email, age, DOB, active, skill:{name, description}} = payload;

    // Check if employee exists
    await this.exists({email})
    .then((employee)=>{
        if(employee){
            // Employee Found
            throw new NetworkError(409,"Email Already Exists", ['email']);
        }
    })

    // Create Employee Skill
    const skill = await SkillLevel.create({name, description})
    .catch((error)=>{
        throw new NetworkError(400, error._message)
    })

    // Create Employee
    const employee = await this.create({
        firstName,lastName,
        email,DOB,age,active,
        skill:skill._id
    })
    .catch((error)=>{
        throw new NetworkError(400, error._message, ['DOB'])
    })

    return employee._id;
}

/**
 * Static method, Retrieve all employees in DB.
 * @returns {Array} Of Employees
 */
EmployeeSchema.statics.getEmployees = async function getEmployees(){
    
    // Find all Employees & Populate Skill documents
    let employees = await this.find()
    .lean()
    .populate("skill")
    .catch((error)=>{
        throw new NetworkError(500, error._message)
    })

    // Remove sensitive data
    employees = employees.map(employee=>{
        delete employee.__v;
        delete employee.skill._id;
        delete employee.skill.__v;
        return employee;
    })

    return employees;
}

/**
 * Static method, Update existing employee
 * @param {String} id Employee Id
 * @param {Object} payload Employee info
 * @returns {Object} Updated Employee with Skill Level
 */
EmployeeSchema.statics.updateEmployee = async function updateEmployee(id, payload){

    // Validate Employee
    this.validateEmployee(payload)
    const {firstName, lastName, email, age, DOB, active, skill:{name, description}} = payload;

    // Validate Object ID
    if(!mongoose.isValidObjectId(id)){
        // Invalid ID
        throw new NetworkError(400,"Invalid ID");
    }

    // Find Employee
    const employee = await this.findById(id)
    .then((employee)=>{
        if(!employee){
            // Employee NOT Found
            throw new NetworkError(404,"Employee Not Found");
        }
        return employee;
    })

    // Update Skill
    await SkillLevel.updateOne(
        {_id: employee.skill},
        {name, description},
        {runValidators:true}
    )
    .catch((error)=>{
        throw new NetworkError(400, error._message)
    })
    
    // Modify Employee
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.age = age;
    employee.DOB = DOB;
    employee.active = active;

    await employee.save()
    .catch((_)=>{
        throw new NetworkError(409, "Email Already Exists",['email'])
    })

    // Populate Employee
    let populatedEmployee = await employee
    .populate({path:"skill", options: {lean:true}})
    .then(populatedEmployee => populatedEmployee.toObject())
    .catch((error)=>{
        throw new NetworkError(500, error._message)
    })

    // Remove sensitive data
    delete populatedEmployee.__v;
    delete populatedEmployee.skill._id;
    delete populatedEmployee.skill.__v;

    return populatedEmployee;
}

/**
 * Static method, Delete employee from DB.
 * @param {String} id Employee Id
 */
EmployeeSchema.statics.deleteEmployee = async function deleteEmployee(id){

    // Validate Object ID
    if(!mongoose.isValidObjectId(id)){
        // Invalid ID
        throw new NetworkError(400, "Invalid ID");
    }

    // Find Employee
    const employee = await this.findById(id)
    .then((employee)=>{
        if(!employee){
            // Employee NOT Found
            throw new NetworkError(404, "Employee Not Found");
        }
        return employee;
    })

    // Delete Skill
    await SkillLevel.deleteOne({_id:employee.skill})
    .catch((error)=>{
        throw new NetworkError(500, error._message);
    })

    // Delete Employee
    await this.deleteOne({_id:employee._id})
    .catch((error)=>{
        throw new NetworkError(500, error._message)
    })
}


// Export Employee
export const Employee = model('Employee',EmployeeSchema);
