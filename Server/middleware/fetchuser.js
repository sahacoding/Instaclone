const jwt = require("jsonwebtoken");
const JWT_SECRET = "Arpanisagood$boy";
const User = require('../models/User')

const fetchuser = async (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  //console.log('token is', token);
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token na"});
   // console.log('token', error)
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
  // console.log('data', data)
  // update the user beacuse when we signup then following and followers array is blank when we show myfollowing post then we 
  //require the user from this middleware but in this user is not updated followers and following array is blank soo we require to update
  // this user from database and then save this updated user in req.user.
   const updateduser =await User.findById(data.user._id)
   //console.log('updated user', updateduser)
    req.user = updateduser;
   // console.log('user is', req.user)
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
   // console.log('auth', error)
  }
}; 

module.exports = fetchuser;
