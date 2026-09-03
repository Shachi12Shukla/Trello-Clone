import React from 'react'
import logo from "../../assets/Logo.webp"

const AuthHeader = () => {
  return (
    <div className='auth-header'>
      <img src={logo} alt="Trello logo" className='auth-logo' />

      <span className='auth-brand-name'>Trello</span>
      
    </div>
  )
}

export default AuthHeader
