'use strict';

// MongoDB
import { config } from 'dotenv';    config();
import { connect } from './config/database.js'; connect();

// Http Server
import server from './api/server.js';
const API_PORT = process.env.API_PORT;

// Start server
server.listen(API_PORT, (error) => {
    if(!error)
        console.log(`Server is running at Port ${API_PORT}!`);
    else
        console.log('Error Starting server');
});