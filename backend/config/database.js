'use strict';

// Mongoose Setup
import mongoose from 'mongoose';

export const connect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() =>{
        console.log('MongoDB connected!');
    })
    .catch( error => {
        console.log('Failed to connect to MongoDB. Existing now...');
        console.error(error);
    });
}

export const mongodbClose = () => mongoose.connection.close()