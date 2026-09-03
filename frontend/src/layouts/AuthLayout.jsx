import React from 'react'
import { Outlet } from "react-router";
import AuthLeft from "../assets/AuthLeft.svg"
import AuthRight from "../assets/AuthRight.svg"
import "./AuthLayout.css"

const AuthLayout = () => {
  return (
    <div className='auth-layout'>

        <img src={AuthLeft} alt="Left Illustration"  className="auth-left-illustration"/>

        <main className='auth-content'>
            <Outlet/>
        </main>

        <img src={AuthRight} alt="Right Illustration"  className="auth-right-illustration"/>
      
    </div>
  )
}

export default AuthLayout
