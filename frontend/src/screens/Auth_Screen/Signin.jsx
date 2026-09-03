import { useState } from "react";
import { useNavigate } from "react-router";
import AuthHeader from "../../components/Auth/AuthHeader";
import "./Auth.css";
import {signinUser} from "../../services/AuthService"
import toast from "react-hot-toast"
import {useAuth} from "../../context/Auth_Context"

const Signin = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {login, setUserData} = useAuth();

  const handleSignin = async (e) => {
    e.preventDefault();

    // Backend integration 

    try{
      const data = await signinUser({username,password});
      
      login(data.token, data.user);
      toast.success("Logged in successfully!");

      navigate("/");
    }
    catch(error){
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Invalid username or password"
      );
    }


  };

  return (
    <div className="auth-card">

      <AuthHeader />

      <h1 className="auth-title">
        Log in to continue
      </h1>

      <form
        className="auth-form"
        onSubmit={handleSignin}
      >

        <div className="form-group">
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>


        <button
          type="submit"
          className="auth-submit-button"
        >
          Log in
        </button>

      </form>


      <p className="auth-footer">
        Don't have an account?{" "}

        <button
          type="button"
          onClick={() => navigate("/signup")}
        >
          Create an account
        </button>
      </p>

    </div>
  );
};

export default Signin;
