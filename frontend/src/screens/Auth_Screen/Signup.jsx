import {useNavigate} from "react-router"
import AuthHeader from "../../components/Auth/AuthHeader"
import { useState } from 'react'
import "../../components/Auth/AuthCard.css"
import toast from "react-hot-toast"
import { signupUser } from '../../services/AuthService'

const Signup = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    // backend integration
    try{
      const data = await signupUser({username, password});


      toast.success("created account successfully");
      navigate("/signin");
    }

    catch(error){
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
    

  }

  return (
    <div className='auth-card'>
     
      <AuthHeader/>

      <h1 className='auth-title'>
        Sign up for Trello
      </h1>

      <form className='auth-form' onSubmit={handleSignup}>
        <div className='form-group'>
          <label htmlFor="username">Username</label>

          <input type="text" id="username" placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)}/>

        </div>

        <div className='form-group'>
          <label htmlFor="password">Password</label>

          <input type="password" id="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)}/>

        </div>

        <button type='submit' className='auth-submit-button'>Sign Up</button>
      </form>

      <p className='auth-footer'>
        Already have an account ?{" "}

        <button type='button' onClick={() => navigate("/signin")}>Log in</button>
      </p>
      
    </div>
  )
}

export default Signup
