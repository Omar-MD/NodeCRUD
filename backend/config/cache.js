// // "use strict"

// // TODO: CHANGE TO FUNCTION
// import redis from 'redis';
// const client = redis.createClient(); // localhost(127.0.0.1), port 6379, no password

// client.on("connect", ()=>{
//     console.log("Client connected to redis..");
// })

// client.on("ready", ()=>{
//     console.log("Redis is ready to use");
// })

// client.on("error", (err)=>{
//     console.error("Redis client Error: ", err);
// })

// client.on("end", ()=>{
//     console.log("Redis disconnected successfully");
// })

// await client.connect()

// export default client;
