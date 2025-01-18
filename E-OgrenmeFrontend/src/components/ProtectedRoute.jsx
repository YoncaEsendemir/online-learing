import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'


function ProtectedRoute({children,redirectTo }) {
    const {loggedInUser}=useSelector((state)=>state.user)
    const location =useLocation();

    if(!loggedInUser){
        return <Link to={redirectTo} state={{from:location}}/>
    }
  return children; 
}
export default ProtectedRoute