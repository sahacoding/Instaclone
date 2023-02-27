import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../context/Instacontext';
import { useParams } from 'react-router-dom';
const UserProfile = () => {
  const {state, dispatch} = useContext(UserContext)
  //console.log("state is", state)
  const [userprofile, setuserprofile] = useState(null);
  const {userid} = useParams()
  console.log(userid)
  useEffect(()=>{
    const asyncmyPost = async () => {
                const response = await fetch(`/api/user/${userid}`,{
                method: "GET",
                headers: {
                           "Content-Type": "application/json",
                           "auth-token": localStorage.getItem("token"),
                          }
                });
           const json = await response.json();
           console.log(json);
           setuserprofile(json)
        }
        asyncmyPost();
  },[])
 

 const followuser = async ()=>{
  try {
    const response = await fetch("/api/user/follow",{
      method: 'put',
      headers: {
       'Content-Type': 'application/json',
       "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({followId: userid}) 
   })
   const json = await response.json();
    console.log("Follow-->",json)
    dispatch({type: "UPDATE", payload:{following:json.loginUser.following,
     followers: json.loginUser.followers}})
    localStorage.setItem("user", JSON.stringify(json.loginUser))
    //when we follow then follower:1 show by updating the local state (userprofile) setUserprofile using callback function ...prevuserprofile
    // means previous userprofile which has(otherPost and OtherUser) get then replace the otherUser through 38line json.oppositeUser
     setuserprofile((prevuserprofile)=>{
      return {
        ...prevuserprofile,
        otherUser: json.oppositeUser
      }
    })
 
  }
  catch(error){
    console.log(error)
  }
  
}


const unfollowuser = async ()=>{
  try {
    const response = await fetch("/api/user/unfollow",{
      method: 'put',
      headers: {
       'Content-Type': 'application/json',
       "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({unfollowId: userid}) 
   })
   const unfollowjson = await response.json();
    console.log("unFollow-->",unfollowjson)
    dispatch({type: "UPDATE", payload:{following:unfollowjson.loginUser.following,
     followers: unfollowjson.loginUser.followers}})
    localStorage.setItem("user", JSON.stringify(unfollowjson.loginUser))
   // console.log('id is', unfollowjson.loginUser._id)
   // console.log('log in id', userprofile.otherUser.followers)
   // when we unfollow then follower:1 show by updating the local state (userprofile) setUserprofile using callback function ...prevuserprofile
   // means previous userprofile which has(otherPost and OtherUser). Here in otherUser.followers have the loginid which we now remove. 77 no line is the logic of removing the login id from otherUser.followers array
      setuserprofile((prevuserprofile)=>{
       const newFollower = prevuserprofile.otherUser.followers.filter(item=>item !== unfollowjson.loginUser._id)
      return {
           ...prevuserprofile,
        otherUser:{
           ...prevuserprofile.otherUser,
           followers: newFollower
         }
       }
     })
    
  }
  catch(error){
    console.log(error)
  }
  
}

console.log(userprofile)
//console.log('state is', state)
  return (
    <>
    {userprofile ? 
    
    <div style={{maxWidth:"550px", margin:"0px auto"}}>
      <div style={{display:"flex", justifyContent:"space-around", margin: "18px 0px", borderBottom:"1px solid grey"}}>
        <div>
          <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
          src={userprofile.otherUser.pic}/>
        </div>
        <div>
          <h4>{userprofile.otherUser.name}</h4>
          <h5>{userprofile.otherUser.email}</h5>
          <div style={{display:"flex", justifyContent:"space-between", width:"120%"}}>
            <h6>{userprofile.otherPost.length}post</h6>
            <h6>{userprofile.otherUser.followers.length}followers</h6>
            <h6>{userprofile.otherUser.following.length}following</h6>
          </div>
           { userprofile.otherUser.followers.includes(state._id) ?
           <button  style={{margin: "10px"}} className="btn waves-effect waves-light #42a5f5 blue darken-1"
             onClick={()=>unfollowuser()}>Unfollow</button>
               :  
             <button style={{margin: "10px"}} className="btn waves-effect waves-light #42a5f5 blue darken-1"
             onClick={()=>followuser()}>Follow</button>  
             
            }  
          



        </div>
       </div>
       <div className='gallery'>
        {
          userprofile.otherPost.map((item, index)=>{
            return(
            <img key={index} className='item'  src={item.photo} alt={item.title}/>
            )
          })
        }
          
        </div>
    </div>
    
    : <h2>"loading..."</h2>}
    
    </>
  )
}

export default UserProfile
