// React
import {useState} from 'react';

// Services
import UserService from '../../services/user';

// Components
import PageTitle from '../PageTitle';

/**
 * Register page. 
 * @param {Object} setIsUserLogged handler controls user login state
 * @returns Register component
 */
const Register = ({setIsUserLogged})=>{
    
    // Form
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [password2,setPassword2] = useState('')
    const [error, setError]=useState(null)
    const [success, setSuccess] = useState(false);

    const onSubmit = async (event)=>{
        event.preventDefault();
        setError(null);

        // Password validation
        if(password !== password2){
            setError("Passwords must be the same")
            return;
        }
        // Register request
        const response = await UserService.register(JSON.stringify({username,password})); 
        if(response.status === 200){
            setSuccess(true);
            setTimeout(()=>{
                setIsUserLogged(true)
            },1000);
        } else if(response.status !== 200){
            setError(response.data.error)
        }
    }

    return (
        <section className='signup'>
            <PageTitle title="Register" text="Please register to access employee listing" />
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
                    <div className="form-group">
                        <label htmlFor="password2">Confirm Password:</label>
                        <input  
                            type="password" 
                            name="password2"
                            id='password2'
                            value={password2}
                            placeholder="Confirm password"
                            onChange={(e)=>setPassword2(e.target.value)}
                        ></input>
                    </div>
                    <button type="submit" className='btn'>Register</button>
                    {error && <div className='error'>{error}</div>}
                    {success && <div className='success'>Successful Registeration</div>}
                </form>
            </div>
        </section>
    );
}

export default Register;