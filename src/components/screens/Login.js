import React from 'react'
import { useState, useContext } from 'react';
import {Link, useNavigate} from "react-router-dom";
import M from 'materialize-css';
import { UserContext } from '../../context/Instacontext';
//import UserProvider from "./context/Instacontext"
const Login = () => {
   const {state, dispatch} = useContext(UserContext)
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const PostData = async ()=>{
// if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
//   { M.toast({html: 'Please enter valid email', classes: '#f44336 red'})
//   }
    const response = await fetch("/api/auth/login",{
       method: 'POST',
       headers: {
        'Content-Type': 'application/json',
       },
       body: JSON.stringify({  email, password}) 
    })
    const json = await response.json();
     console.log(json)

     if(json.success){
      // Save the auth token and redirect
      localStorage.setItem('token', json.authtoken);

      // json.data.user._id = json.data.user.id
      // json.data.user.id = undefined
      localStorage.setItem('user', JSON.stringify( json.data.user));
      dispatch({type: "USER", payload: json.data.user})
      M.toast({html: "successfully created", classes: '#00e676 green accent-3'})
      navigate('/')
    }else if(json.error){
     M.toast({html: json.error, classes: '#f44336 red'})
    }

   //   if(json.error){
   //    M.toast({html: json.error, classes: '#f44336 red'})
   //   }else{
   //    M.toast({html: "successfully logedin", classes: '#00e676 green accent-3'})
   //    navigate('/')
   //   }
  }
  return (
    <div className='mycard input-field'>
       <div className="card auth-card">
             <h2>Instagram</h2>
             <input type="text" placeholder='email'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder='password'
          value={password}
          onChange={(e)=>setPassword(e.target.value)}/>
             <button className="btn waves-effect waves-light #42a5f5 blue darken-1"  onClick={()=>PostData()}>Login</button>
             <h5>
              <Link to="/signup"> Don't have an account ?</Link>
             </h5>
          </div>
     </div>
  )
}

export default Login
