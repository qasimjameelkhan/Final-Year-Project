import { useSelector } from 'react-redux'
import {Outlet, Navigate} from 'react-router-dom'


const ProtectedRoute = () => {

  const {isAuthenticated} = useSelector((state)=>state.user)
  return (
    isAuthenticated ? <Outlet/> : <Navigate to="/auth"/>
  )
}

export default ProtectedRoute