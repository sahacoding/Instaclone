import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/Instacontext";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  //console.log("state is", state)
  const [mypost, setmyPost] = useState([]);
  const [myprofile, setmyProfile] = useState([]);
  const [image, setImage] = useState("");
  //const [pic, setPic] = useState();

  useEffect(() => {
    const asyncmyPost = async () => {
      const response = await fetch("/api/post/mypost", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      //console.log(json);
      setmyPost(json);
    };
    asyncmyPost();
    userDetails();
  }, []);
  console.log(mypost);
  console.log("state is", state);

  const userDetails = async () => {
    const response = await fetch("/api/auth/getuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log("profile details", json);
    setmyProfile(json);
  };
  console.log("my profile", myprofile);

  useEffect(() => {
    if (image) {
      const asyncupdatePhoto = async () => {
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
        //setPic(jsonCloud.url);
        // localStorage.setItem("user", JSON.stringify({...state, pic:jsonCloud.url }))
        // dispatch({type:"UPDATEPIC", payload:jsonCloud.url})

        const response = await fetch("/api/user/updateprofilepic", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({pic: jsonCloud.url})
        });
        const Profilepicjson = await response.json();
        console.log("profile Pic", Profilepicjson);
        localStorage.setItem("user", JSON.stringify({...state, pic:Profilepicjson.pic }))
         dispatch({type:"UPDATEPIC", payload:Profilepicjson.pic})

        if (jsonCloud.error) {
          console.log(jsonCloud.error);
          //console.log("pic is", pic);
        }
      };
      asyncupdatePhoto();
    }
  }, [image]);

  const updatePhoto = async (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={state ? state.pic : "loading"}
          />

          <div className="file-field input-field">
            <div className="btn  #42a5f5 blue darken-1">
              <span>Update Photo</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div>
          <h4>{state ? state.name : "loading"}</h4>
          <h5>{state ? state.email : "loading"}</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "120%",
            }}
          >
            <h6>{mypost.length} post</h6>
            <h6>{myprofile ? myprofile.followers?.length : 0} followers</h6>
            <h6>{myprofile ? myprofile.following?.length : 0} following</h6>
          </div>
        </div>
      </div>

      <div className="gallery">
        {mypost.map((item) => {
          return <img className="item" src={item.photo} alt={item.title} />;
        })}
      </div>
    </div>
  );
};

export default Profile;
