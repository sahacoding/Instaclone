const express = require('express');
//const {body, validationResult } = require('express-validator');
const router = express.Router();
const Post = require('../models/Post')
const fetchuser = require('../middleware/fetchuser')
//const bcrypt = require("bcryptjs")

router.get('/fetchallpost',  async(req, res)=>{
    try {
        const allPost = await Post.find({}).populate("postedBy", "_id name").populate("comments.cpostedBy", "_id name")
        res.json(allPost)
    } catch (error) {
        console.error(error.message);
    res.status(500).send("Some Error occured");
    }
})

//Show only the following Post
router.get('/fetchfollowingpost', fetchuser,  async(req, res)=>{
    try {
       // console.log('req user is', req.user)
        //console.log('req following', req.body)
        // $in here means checking the postedby is present in this following array
        const followingPost = await Post.find({postedBy:{$in: req.user.following}}).populate("postedBy", "_id name").populate("comments.cpostedBy", "_id name")
       //console.log('following post', followingPost)
        res.json(followingPost)
    } catch (error) {
        console.error(error.message);
    res.status(500).send("Some Error occured");
    }
})


router.post("/addpost", fetchuser, async (req, res) =>{
    try {
     //console.log(req.body)
        const {title, body, photo} = req.body
       // console.log('yyyyy',req.body)
        if(!title || !body || !photo){
            return res.status(422).json({error: "Please add all the field "})
        } 
        // console.log(req.user)
        // res.send('ok')
        const post = new Post({
            title,
            body,
           photo,
            postedBy: req.user._id,
          });
          const savedPost = await post.save();
          //console.log('dot', savedPost)
          
          res.json({savedPost});
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Some Error occured");
    }

})


router.get('/mypost', fetchuser, async(req, res)=>{
    try {
        const myPost = await Post.find({postedBy: req.user._id}).populate( "postedBy", "_id name")
        res.json(myPost)
        console.log("my post", myPost)
    } catch (error) {
        console.error(error.message);
    res.status(500).send("Some Error occured");
    }
})

router.put('/like', fetchuser, async(req, res)=>{
    try {
         // this postId is a key used in frontend this like api calling and stringify the body
        // console.log('_id is', req.user._id)
        // console.log('postid is', req.body.postId)
    const likePost = await Post.findByIdAndUpdate(req.body.postId, {$push:{likes: req.user._id}},
        // if we dont use new: true then mongodb send old records we need updated records so we use new: true
        {new: true}
        ).populate( "postedBy", "_id name")
        res.json(likePost)
       // console.log('like is',likePost)
    } catch (error) {
        console.error(error.message);
        res.status(422).send(error.message);
    }
})

router.put('/unlike', fetchuser, async(req, res)=>{
    try {
         // this postId is a key used in frontend this like api calling and stringify the body
    const likePost = await Post.findByIdAndUpdate(req.body.postId, {$pull:{likes: req.user._id}},
        // if we dont use new: true then mongodb send old records we need updated records so we use new: true
        {new: true}
        ).populate( "postedBy", "_id name")
        res.json(likePost)
        console.log(likePost)
    } catch (error) {
        console.error(error.message);
        res.status(422).send(error.message);
    }
})

router.put('/comment', fetchuser, async(req, res)=>{
    try {
        // destructuring the comment txt from req.body and user _id so we put it on cmnt variable and $push in comments key
        const cmnt = {
            text: req.body.text,
            cpostedBy: req.user._id
        }
    const commentPost = await Post.findByIdAndUpdate(req.body.postId, {$push:{comments: cmnt}},
        // if we dont use new: true then mongodb send old records we need updated records so we use new: true
        {new: true}
        ).populate("comments.cpostedBy", "_id name").populate( "postedBy", "_id name") // i want user _id as well as user name so we populate
        res.json(commentPost)
       // console.log('comment is',commentPost)
    } catch (error) {
        console.error(error.message);
        res.status(422).send(error.message);
    }
})

router.delete('/deletepost/:postId', fetchuser, async(req, res)=>{
    try {
        console.log("_id is", req.params.postId)
    let deletePost = await Post.findOne( {_id:req.params.postId}).populate("postedBy", "_id")
    console.log('delete post', deletePost)
     if(!deletePost){
        return res.status(404).send("Not Found");
     }
     console.log('postedid is', deletePost.postedBy._id.toString())
     console.log('req user id', req.user._id)
     // Allow deletion only if user owns this Note
  if (deletePost.postedBy._id.toString() !== req.user._id.toString()) {
    return res.status(401).send("Not Allowed");
   
    
  }
  deletePost= await Post.findByIdAndDelete(req.params.postId);
  res.json({ Success: "Post has been deleted", deleteitem: deletePost });
  console.log('delete post is', deletePost)
    } catch (error) {
        console.error(error.message);
        res.status(422).send(error.message);
    }
})

module.exports = router 
