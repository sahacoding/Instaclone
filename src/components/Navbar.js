import React, {createContext, useContext} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/Instacontext'
const Navbar = () => {
  // in the state here store the data{ name, email, id}
  const {state, dispatch} = useContext(UserContext)
  const navigate = useNavigate();
 // console.log('state is', state)
  //now if the data present in localStorage(which now prsnt in reducer state through dispatch) then we show Profile and CreatePost otherwise show Login and Signup 
  const renderList = ()=>{
    
    if(state){
     // console.log('state is', state)
      return[
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/createpost">CreatePost</Link></li>,
         <li><Link to="/myfollowingpost">My following Post</Link></li>,
        <li>
          <button className="btn #f44336 red"  
          onClick={()=>{
          localStorage.clear()
          dispatch({type: "CLEAR"})
          navigate('/login')
          }}>Logout</button>
        </li>
      ]
    }else{
     // console.log('state is', state)
      return [
        <li><Link to="/signup">Signup</Link></li>,
        <li><Link to="/login">Login</Link></li>
      ]
    }
  }
  return (
   <div>
      <nav>
    <div className="nav-wrapper white">
      <Link to={state ? "/" : "/login"} className="brand-logo left">Instragram</Link>
      <ul id="nav-mobile" className="right">
        {/* <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/createpost">CreatePost</Link></li> */}
        {renderList()}
      </ul>
    </div>
  </nav>
   </div>
    
  )
}

export default Navbar
