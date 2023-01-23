'use strict';

// Debugger check
import inspector from 'node:inspector';

// Http Server
import { createServer, globalAgent } from 'http';

// API endpoints
import { routes } from './routes.js';


/**
 * Create Http server
 * @param {Object} req Http request
 * @param {Object} res Http response
 */
const server = createServer(async (req, res) => {

    // App functionality Headers
    res.setHeader("Access-Control-Allow-Headers",       "Authorization, Accept, Content-Type")
    res.setHeader("Access-Control-Allow-Methods",       "OPTIONS, POST, GET, PUT, DELETE")
    res.setHeader("Access-Control-Allow-Origin",        process.env.ORIGIN)
    res.setHeader("Access-Control-Allow-Credentials",   true)       
    res.setHeader("Content-Type",                       "application/json");
    res.setHeader("Accept",                             "application/json")

    // Security Headers
    res.setHeader("Content-Security-Policy", "script-src 'self'")   // Block inline scripts & dynamic script execution eval
    res.setHeader("X-XSS-Protection","1;mode=block");               // Set XSS filter
    res.setHeader("X-Frame-Options","SAMEORIGIN");                  // Block Click Jacking 
    res.setHeader("X-Content-Type-Options","nosniff")               // Block MIME confusion attack
    
    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end(JSON.stringify({message: "No Content"}))
        return;
    }

    // DoS measure: Timeout Idle requests 5s
    res.setTimeout(parseInt(process.env.SERVER_TIMEOUT), (socket)=>{    
        console.log("Timeout!");
        res.setHeader("Connection","close");
        res.statusCode = 408;
        res.end(JSON.stringify({message: `Request timeout after ${process.env.SERVER_TIMEOUT} ms`}))
        socket.destroy()
        return;
    })

    // API endpoints
    await routes(req, res);
});


// DoS measure: Limit sockets per host
globalAgent.maxSockets = 50;
 
// DNS Rebinding measure : Disable inspector
process.on('SIGUSR1',()=>{
    console.log("Received SIGUSR1. Disabling inspector");
    inspector.close()
})

export default server;



