"use strict";

// User controller
import userController from '../controllers/userController.js';

// Employee controller
import employeeController from '../controllers/employeeController.js';

// Authentication
import { verifyAccess } from '../controllers/authController.js';

/**
 * Server endpoints for Employee Portal client
 * @param {Object} req Http IncomingMessage request
 * @param {Object} res Http Response 
 */
export const routes = async (req, res) =>{

    let url = req.url; 
    let method = req.method.toUpperCase();
    // console.log(method, url);


    // User Routes
    if(method === 'POST'){
        switch(url){
            case '/api/Register':
                return await userController.register(req, res);
            case '/api/Authenticate':
                return await userController.login(req, res);
            case '/api/Authenticate/Refresh':
                return await userController.refresh(req, res);
            case '/api/Authenticate/Logout':
                return userController.logout(req, res);
            default:
        }
    }

    // Protected Employee Routes
    if(verifyAccess(req,res)){
        switch(method){
            case "GET":
                if(url === '/api/Employees'){
                    await employeeController.get(req, res);
                }else{
                    res.statusCode = 405;
                    res.end(JSON.stringify({error: "Method Not Allowed"}))
                }
                break;
            case "POST":
                if(url ==='/api/Employees'){
                    await employeeController.create(req, res);
                }else{
                    res.statusCode = 405;
                    res.end(JSON.stringify({error: "Method Not Allowed"}))
                }
                break;
            case "PUT":
                // Match /Employees/id
                if(url.match(/\/api\/Employees\/[a-zA-Z0-9]+/)){
                    const id = url.split('/')[3];
                    await employeeController.update(req, res, id);
                }else{
                    res.statusCode = 405;
                    res.end(JSON.stringify({error: "Method Not Allowed"}))
                }
                break;
            case "DELETE":
                // Match /Employees/id
                if(url.match(/\/api\/Employees\/[a-zA-Z0-9]+/)){
                    const id = url.split('/')[3];
                    await employeeController.remove(req, res, id);
                }else{
                    res.statusCode = 405;
                    res.end(JSON.stringify({error: "Method Not Allowed"}))
                }
                break;
            default:
                res.statusCode = 405;
                res.end(JSON.stringify({error: "Method Not Allowed"}))
        }
    }
}