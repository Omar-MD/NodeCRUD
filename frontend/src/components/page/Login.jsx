// React
import {useState} from 'react';

// Services
import UserService from '../../services/user';

// Components
import PageTitle from '../PageTitle';

/**
 * Login component
 * @param {Object} setIsUserLogged login handler controls login state of User
 * @returns 
 */
const Login = ({setIsUserLogged})=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const onSubmit = async (event)=>{
        event.preventDefault();
        setError(null)
        
        // Login request
        const response = await UserService.login(JSON.stringify({username,password}))
        if(response.status === 200){
            setSuccess(true);
            setTimeout(()=>{
                setIsUserLogged(true)
            },1000);
        }else if(response !== 200){
            setError(response.data.error)
        }
    }

    return (
        <section className='login'>
            <PageTitle title="Authenticate" text="Please log in to access employee listing" />
            <div>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input 
                            type="text" 
                            name="username"
                            id='username'
                            value={username}
                            placeholder="Enter username"
                            onChange={(e)=>setUsername(e.target.value)}
                        ></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            name="password"
                            id='password'
                            value={password}
                            placeholder="Enter password"
                            onChange={(e)=>setPassword(e.target.value)}
                        ></input>
                    </div>
                    <button type="submit" className='btn'>Log In</button>
                    {error && <div className='error'>{error}</div>}
                    {success && <div className='success'>Successful Login</div>}
                </form>
            </div>
        </section>
    );
}

export default Login;