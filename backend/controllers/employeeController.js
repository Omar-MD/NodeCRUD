'use strict';

// Employee DB
import { Employee } from "../models/employeeModel.js";

// Request handler
import { bodyParser } from "../utils/requestHandler.js";


/**
 * Create new Employee
 * @param {Object} req Http Request 
 * @param {Object} res Http Response 
 */
const create = async (req, res) =>{
    try{
        const payload = await bodyParser(req)
        const id = await Employee.addEmployee(payload)

        res.statusCode = 201;
        res.end(JSON.stringify({id}));

    }catch(error){
        // Error
        res.statusCode = error.status;
        if(error.emptyFields){
            // Validation 
            res.end(JSON.stringify({error: error.message, emptyFields: error.emptyFields}));
        }else{
            // Other
            res.end(JSON.stringify({error: error.message}));
        }
    }
}

/**
 * Get all Employees
 * @param {Object} req Http Request 
 * @param {Object} res Http Response
 */
const get = async (_, res) =>{
  try{
    const employees = await Employee.getEmployees();

    res.statusCode = 200;
    res.end(JSON.stringify({employees}));

  }catch(error){
    // Error
    res.statusCode = error.status;
    res.end(JSON.stringify({error: error.message})); 
  }
}

/**
 * Update Employee
 * @param {Object} req Http Request 
 * @param {Object} res Http Response
 */
const update = async (req, res, id) =>{
    try{
        const payload = await bodyParser(req)
        const employee = await Employee.updateEmployee(id, payload);

        res.statusCode = 200;
        res.end(JSON.stringify({employee}));

    }catch(error){
        // Error
        res.statusCode = error.status;
        if(error.emptyFields){
            // Validation 
            res.end(JSON.stringify({error: error.message, emptyFields: error.emptyFields}));
        }else{
            // Other 
            res.end(JSON.stringify({error: error.message}));
        }
    }
}

/**
 * Delete Employee
 * @param {Object} req Http Request 
 * @param {Object} res Http Response
 */
const remove = async (_, res, id) =>{
    try{
        await Employee.deleteEmployee(id);

        res.statusCode = 200;
        res.end();

    }catch(error){
        // Error
        res.statusCode = error.status;
        res.end(JSON.stringify({error: error.message}));
    }
}

const employeeController = {
    create,
    get,
    update,
    remove
}

export default employeeController;