const express = require('express');
//const {body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "Arpanisagood$boy";

router.get('/', (req, res)=>{
    res.send("ARPAN")
})

  // Route 1: create a User using: POST "/api/auth/signup". No login required
router.post('/signup', async (req, res)=>{
 
    const {name, email, password, pic, followers, following} = req.body
    if(!email || !password || !name){
       return res.status(422).json({success, error: "Please fill all the field "})
    }

    //Check whether the user with this email exist already
    try{
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({ errors: "Sorry this email alraedy exist"})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        pic,
        // followers,
        // following
      });

      const data = {
        user:{
          _id: user._id,
          
        
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
    //console.log('oooooo', authtoken)

    res.json({ authtoken})
    } catch (error) {
        console.error('1234', error.message);
        res.status(500).send("Some Error occured");
      }
})

// Route 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', async (req, res)=>{
  let success = false;
  const { email, password} = req.body
  if(!email || !password){
     return res.status(422).json({error: "Please fill all the field "})
  }
  try{
  let user1 = await User.findOne({email: req.body.email})
  if(!user1){
      return res.status(400).json({ errors: "Please try to login with correct credential"})
  }
  const passwordCompare = await bcrypt.compare(password, user1.password)
  if(!passwordCompare){
    return res.status(400).json({ errors: "Please try to login with correct credential"})
  }
  const data = {
    user:{
      _id: user1._id,
      name: user1.name,
      email: user1.email,
      pic: user1.pic,
      followers: user1.followers,
       following: user1.following
      }
  }
  //console.log('data is', data)
  const authtoken = jwt.sign(data, JWT_SECRET);
 // success = true;
 //console.log('isssss', authtoken)
  res.json({success: true , authtoken, data})
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})

// Route 3: Get login  User details using: POST "/api/auth/getuser".  login required
router.post('/getuser', fetchuser, async(req, res) =>{
  try {
    const userId = req.user._id
   //console.log(userId)
   // select is a function which select all the field from User except the password by write(-password)
    const user = await User.findById(userId).select("-password")
   // console.log('user is', user)
   
  res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
  })

module.exports = router