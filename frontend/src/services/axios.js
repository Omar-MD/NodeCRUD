// Axios
import axios from 'axios'; 

// JWT manager
import inMemoryJWT from './inMemoryJWT';

// Create Axios instance
const AppClient = axios.create({
    baseURL:'http://localhost:27017/api/',
    headers: {
        "Content-Type":"application/json",
        "Accept":"application/json",
    },
    withCredentials:true
})

// Add Authorization header before each request
AppClient.interceptors.request.use(
    (config)=>{
        const token = inMemoryJWT.getToken();
        if(token){
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
);

export default AppClient;
