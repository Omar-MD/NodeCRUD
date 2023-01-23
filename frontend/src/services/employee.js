// Axios app instance
import AppClient from "./axios";

/**
 * Get all employees
 * @returns {Object} Server response
 */
const getAll = async ()=>{
    return await AppClient
    .get('Employees')
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
 * Create new Employee
 * @param {Object} newEmployee payload containing new Employee info
 * @returns {Object} Server response
 */
const create = async (newEmployee) =>{
    return await AppClient
    .post('Employees', newEmployee)
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
            return err.request
        }else {
            // console.log('Error', err.message);
        }
        console.log(err.config);
    })
}

/**
 * Update Employee
 * @param {Object} updatedEmployee payload containing Employee info
 * @param {String} id Employee id
 * @returns {Object} Server response
 */
const update = async (id, updatedEmployee) =>{
    return await AppClient
    .put(`Employees/${id}`, updatedEmployee)
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
 * Delete Employee
 * @param {String} id Employee id
 * @returns {Object} Server response
 */
const remove = async (id) =>{
   return await AppClient
    .delete(`Employees/${id}`)
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

const EmployeeService = {
    getAll, 
    create,
    update,
    remove
}

export default EmployeeService;