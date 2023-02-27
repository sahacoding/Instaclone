// import logo from './logo.svg';
import React, {useEffect, useContext,  useReducer} from 'react';
//import {reducer, initialState} from "./reducers/userReducer"
import UserProvider from "./context/Instacontext"
import { UserContext } from './context/Instacontext';
import "./App.css";
import Home from "./components/screens/Home";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import Login from "./components/screens/Login";
import Navbar from "./components/Navbar";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import Myfollowingpost from './components/screens/Myfollowingpost';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,  useNavigate,
  Routes, Switch
} from "react-router-dom";
//export const UserContext = createContext();


const Routing = ()=>{
  const {state,dispatch} =  useContext(UserContext);
  const navigate = useNavigate();
 useEffect(()=>{
const checkUser = JSON.parse(localStorage.getItem('user'));
//console.log('check user is', checkUser)
if(checkUser){
  dispatch({type:"USER", payload: checkUser})
 // navigate('/')
}else{
  navigate('/login')
}
},[])
console.log('js is',state)
  return (
   <>
   {/*  wrapping the Routes using Switch is optional We wrap bcs Switch will make sure that one of the Route is active at a time */}
     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/profile/:userid" element={<UserProfile />} />
           <Route path="/myfollowingpost" element={<Myfollowingpost />} /> 
        </Routes>
      
   </>
  )
}

function App() {
  //const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      <UserProvider>
         <div className="App">
            <Navbar />
         </div>
      {/* <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createpost" element={<CreatePost />} />
        </Routes>
      </div> */}
         <div className="container">
            <Routing/>
         </div>
       </UserProvider>
    
    </>
  );
}

export default App;
