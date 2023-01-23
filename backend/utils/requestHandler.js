'use strict';

import { NetworkError } from "./errorHandler.js";

/**
 * Parse Incoming Http request String 
 * @param {String} request 
 * @returns Resolved/Rejected Promise
 */
export const bodyParser = function bodyParser(request){
    return new Promise((resolve, reject) => {
        let body ='';

        // listen to data sent by client
        request.on("data", (chunk) => {
            body += chunk;
        });

        // listen till the end
        request.on("end", () => {
            // // send back the data
            let json = tryParseJSONData(body)
            if(!json){
                reject(new NetworkError(400,"Invalid JSON payload"))
            }
            resolve(json)
        })

        // Deal with Bad Request
        request.on("error", (e) => {
            console.error(e);
            reject(new NetworkError(400,"Invalid JSON payload"))
        })
    });
}

/**
 * Safety check, ensure JSON data
 * @param {String} jsonStr 
 * @returns Object/false
 */
function tryParseJSONData (jsonStr){
    try{
        let json = JSON.parse(jsonStr)
        if(json && typeof json ==='object'){
            return json;
        }
    }catch(err){
        return false
    };
}