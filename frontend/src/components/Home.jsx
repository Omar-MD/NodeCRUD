// React
import React, { useState, useEffect } from 'react';

// Services
import UserServices from '../services/user.js';

// JWT token
import inMemoryJwt from '../services/inMemoryJWT';

// Components
import Login from './page/Login';
import Register from './page/Register';
import Employees from './page/Employees';
import Navbar from './Navbar';

/**
 * Checks if user has valid access token, Otherwise redirects to Login page.
 * @returns Home component
 */
const Home = () => {
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [userPage, setUserPage] = useState('LOGIN');

    useEffect(() => {
        // Check if valid access token
        if(inMemoryJwt.getToken()){
            setUserPage("EMPLOYEES")
            setIsUserLogged(true);
        }

    }, []);
 
    const logoutHandler = async (event) => {
        event.preventDefault();
        // Logout Request
        const response = await UserServices.logout();
        if (response.status === 200 || response.status ===204) {
            setUserPage("LOGIN");
            setIsUserLogged(false);
        }
    };
    
    return (
        <div className="home">
            <Navbar isUserLogged={isUserLogged} setUserPage={setUserPage} logoutHandler={logoutHandler}/>
            {
                isUserLogged ?<Employees />
                :
                (
                    userPage==="LOGIN" ?
                    <Login setIsUserLogged={setIsUserLogged} />
                    :
                    <Register setIsUserLogged={setIsUserLogged} />
                )
            }
            
        </div>
    ); 
}
 
export default Home;