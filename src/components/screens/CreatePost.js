import React from "react";
import M from "materialize-css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [pic, setPic] = useState("");
  useEffect(() => {
    if (pic) {
      const asyncCreatePost = async () => {
        // upload image on the page
        const response = await fetch("/api/post/addpost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ title, body, photo: pic }),
        });
        const json = await response.json();
        console.log(json);
        if (json.error) {
          M.toast({ html: json.error, classes: "#f44336 red" });
        } else {
          M.toast({
            html: "successfully created Post",
            classes: "#00e676 green accent-3",
          });
          navigate("/");
        }
      };
      asyncCreatePost();
    }
  },[pic]);
  const postDetails = async () => {
    // upload image on cloudinary
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "deupkqjvg");
    const responseCloud = await fetch(
      "https://api.cloudinary.com/v1_1/deupkqjvg/image/upload",
      {
        method: "post",
        body: data,
      }
    );
    const jsonCloud = await responseCloud.json();
    console.log(jsonCloud);
    console.log('url', jsonCloud.url)
    console.log('ur', data.url)
   setPic(jsonCloud.url);
   
   
    if (jsonCloud.error) {
      console.log(jsonCloud.error);
      //console.log("pic is", pic);
    }


    // // upload image on the page
    // const response = await fetch("/api/post/addpost", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "auth-token": localStorage.getItem("token"),
    //   },
    //   body: JSON.stringify({ title, body, photo: pic }),
    // });
    // const json = await response.json();
    // console.log(json);
    // if (json.error) {
    //   M.toast({ html: json.error, classes: "#f44336 red" });
    // } else {
    //   M.toast({
    //     html: "successfully created Post",
    //     classes: "#00e676 green accent-3",
    //   });
    //   navigate("/login");
    // }
  };
//console.log("pic is", pic);
  return (
    <div
      className="card input-field"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="tittle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn  #42a5f5 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #42a5f5 blue darken-1"
        onClick={() => postDetails()}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
