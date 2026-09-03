import React from 'react'
import {Navigate, Outlet} from "react-router";
import {useAuth} from "../context/Auth_Context"
import toast from "react-hot-toast"

const ProtectedRoutes = () => {

  const {isLoggedIn} = useAuth();

  if(!isLoggedIn){
    return (
      <Navigate  to="/signin" replace />
    )
  }

  return <Outlet/>; 

}

export default ProtectedRoutes
