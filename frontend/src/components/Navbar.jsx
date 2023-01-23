
/**
 * App Navbar, allows navigation between Login, and Register page. 
 * Provides Logout button when in Employee listings. 
 * @param {Object} isUserLogged handler for user login state
 * @param {Object} logoutHandler handler for user logout
 * @param {Object} setUserPage handler for user page
 * @returns Navbar component
 */
const Navbar = ({isUserLogged, logoutHandler, setUserPage})=> {
    return (
        <header>
            <div className="navbar">
                <h2>Employee Portal</h2>
                <nav>
                    {isUserLogged  && (
                            <span className="material-icons-outlined" onClick={logoutHandler}>logout</span>
                    )}
                    {!isUserLogged && (
                        <div>
                            <button type="button" className="btn" onClick={()=>setUserPage("LOGIN")}>Login</button>
                            <button type="button" className="btn" onClick={()=>setUserPage("REGISTER")}>Register</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar