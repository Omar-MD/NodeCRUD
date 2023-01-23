// React
import { useEffect, useState } from 'react';

// Services
import UserService from './services/user.js';

// Components
import Home from './components/Home';

/**
 * Central App component, fetchs new access token at start.
 * @returns App component
 */
const App = () => {
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(()=>{
    // Fetch new Access token
    const fetchToken = async ()=>{
      const response = await UserService.refresh()
      if (response.status !== 200) {
        console.log(response.data.error);
      }
      setIsAppReady(true)
    }
    fetchToken()
  },[])

  return (
    <div className='app'>  
      {
        isAppReady ?<Home />
        :
        (<div>Loading...</div>)
      }
    </div>
    )
  }

export default App;