import React from "react";
import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [pic, setPic] = useState(undefined);
  
  useEffect(()=>{
if(pic){
   uploadFields()
}
  },[pic])

  const uploadPic = async () => {
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
    console.log("url", jsonCloud.url);
    console.log("ur", data.url);
    setPic(jsonCloud.url);

    if (jsonCloud.error) {
      console.log(jsonCloud.error);
      //console.log("pic is", pic);
    }
  };

  const uploadFields = async () => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, pic }),
    });
    const json = await response.json();
    //console.log(json)

    if (json.error) {
      M.toast({ html: json.error, classes: "#f44336 red" });
    } else {
      M.toast({
        html: "successfully created",
        classes: "#00e676 green accent-3",
      });
      navigate("/login");
    }
  };
;

const PostData =() =>{
  if (image) {
    uploadPic();
  } else {
    uploadFields();
  }

  // if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  //   { M.toast({html: 'Please enter valid email', classes: '#f44336 red'})
  //   }

  //     const response = await fetch("/api/auth/signup",{
  //        method: 'POST',
  //        headers: {
  //         'Content-Type': 'application/json',
  //        },
  //        body: JSON.stringify({ name, email, password})
  //     })
  //     const json = await response.json();
  //      //console.log(json)

  //      if(json.error){
  //       M.toast({html: json.error, classes: '#f44336 red'})
  //      }else{
  //       M.toast({html: "successfully created", classes: '#00e676 green accent-3'})
  //       navigate('/login')
  //      }
    }
  return (
    <div className="mycard input-field">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn  #42a5f5 blue darken-1">
            <span>Upload Pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-1"
          onClick={() =>PostData()}
        >
          Signup
        </button>
        <h5>
          <Link to="/login">Already have an account ?</Link>
        </h5>
      </div>
    </div>
  );

}

export default Signup;
