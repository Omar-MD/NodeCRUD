// Services
import UserService from "./user";

// JWT manager
const inMemoryJWTManager = ()=>{
    let inMemoryJWT = null;
    let refreshTimeoutID;
    const storageKey = 'logout';

    // Ensure all app instance are in sync
    window.addEventListener('storage', (event)=>{
        if(event.key === storageKey){
            inMemoryJWT = null;
        }
    })

    // Schedule refresh token call just before access token expires
    const refreshToken = async (expiration)=>{
        const delay = (Date.now()+expiration) - Date.now();
        // Trigger refresh 5 seconds before expire
        const timeoutTrigger = delay - 5000;

        refreshTimeoutID = window.setTimeout(async ()=>{
            await UserService.refresh()
        },timeoutTrigger)
    }

    // Quit refresh calls
    const abortRefreshToken = ()=>{
        if(refreshTimeoutID){
            window.clearTimeout(refreshTimeoutID);
        }
    }

    // Return access token
    const getToken = ()=> inMemoryJWT;

    // Set access token, and refresh calls
    const setToken = (token, expiration)=> {
        inMemoryJWT = token;
        refreshToken(expiration)
        return true;
    }
    
    // Delete in memory access token, quit refresh calls, and sync tabs.
    const deleteToken = ()=>{
        inMemoryJWT = null;
        abortRefreshToken();
        window.localStorage.setItem(storageKey,Date.now())
        return true;
    }

    return {
        getToken,
        setToken,
        deleteToken
    }
}

export default inMemoryJWTManager();