const express = require("express");
//const {body, validationResult } = require('express-validator');
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");

router.get("/:id", fetchuser, async (req, res) => {
  try {
    const otherUser = await User.findOne({ _id: req.params.id }).select(
      "-password"
    );
    const otherPost = await Post.find({ postedBy: req.params.id }).populate(
      "postedBy",
      "id name"
    );
    console.log("other user is", otherUser);
    console.log("other post is", otherPost);
    if (!otherUser || !otherPost) {
      return res.status(404).send("Not Found");
    }
    res.json({ otherUser, otherPost });
  } catch (error) {
    console.error(error.message);
    // res.status(422).send(error.message);
  }
});

router.put("/follow", fetchuser, async (req, res) => {
  try {
    const oppositeUser = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      }
    ).select("-password"); // here in oppositeUser "followId" is the id of the person who is followeded and "followers" key contain the userId who follow.
    // that means push the login userId into the followers array of that id (jake login userId follow krbe tar  id er followers array te log in user id dhukia dbe)
    console.log("oppositeuser is", oppositeUser);
    if (!oppositeUser) {
      return res.status(404).send("Not Found");
    }
    //res.json({})

    const loginUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      {
        new: true,
      }
    ).select("-password"); // here login userId er following array te push kre dbe jake follow krbe tar id ke
    console.log("thatuser is", loginUser);
    if (!loginUser) {
      return res.status(404).send("Not Found");
    }
    res.json({ oppositeUser,loginUser});
   // console.log("thateuser is", loginUser);
  } catch (error) {
    console.error(error.message);
  }
});

router.put("/unfollow", fetchuser, async (req, res) => {
  try {
    const oppositeUser = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    ).select("-password"); // here in oppositeUser "followId" is the id of the person who is followeded and "followers" key contain the userId who follow.
    // that means pull the login userId into the followers array of that id (jake login userId follow krbe tar  id er followers array thke log in user id dhukia dbe)
    if (!oppositeUser) {
      return res.status(404).send("Not Found");
    }
    //res.json({ oppositeUser });
    console.log("oppositeuser is", oppositeUser);
    const loginUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      {
        new: true,
      }
    ).select("-password"); // here login userId er following array te pull kre dbe jake follow krbe tar id ke
    if (!loginUser) {
      return res.status(404).send("Not Found");
    }
    res.json({ oppositeUser, loginUser });
   
    console.log("loginuser is", loginUser);
  } catch (error) {
    console.error(error.message);
  }
});

// making Profile photo upload
router.put("/updateprofilepic", fetchuser, async (req, res) => {
try {
  console.log('req body pic', req.body)
  const updateProfilepic = await User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},
    {new:true})
    console.log('update Profile Pic', updateProfilepic)
    res.json(updateProfilepic)
} catch (error) {
  console.error(error.message);
}
})

module.exports = router;
