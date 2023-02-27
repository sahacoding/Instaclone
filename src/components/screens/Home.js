import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/Instacontext";
const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const [post, setPost] = useState([]);
//console.log('state is', state)
  useEffect(() => {
    const asyncallPost = async () => {
      const response = await fetch("/api/post/fetchallpost", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const pJson = await response.json();
      console.log(pJson);
      setPost(pJson);
    };
    asyncallPost();
  }, []);
  console.log(post);
  // frontend like button func
  const likepost = async (id) => {
    try {
      const response = await fetch("/api/post/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ postId: id }), // this id is pass on 21 line no as a parameter of likepost func
      });
      const json = await response.json();
      console.log(json);
      console.log('like post', post)
      const newlkpost = post.map((item) => {
        if (item._id === json._id) {
          return json;
        } else {
          return item;
        }
      });
      setPost(newlkpost);
    } catch (error) {
      console.log(error);
    }
  };
  
  // Frontend unlike button func
  const unlikepost = async (id) => {
    try {
      const response = await fetch("/api/post/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ postId: id }), // this id is pass on 21 line no as a parameter of likepost func
      });
      const json = await response.json();
      console.log(json);
      //console.log('like post', post)

      // logic for  like or unlike on user only one time
      const newlkpost = post.map((item) => {
        if (item._id === json._id) {
          return json;
        } else {
          return item;
        }
      });
      setPost(newlkpost);
    } catch (error) {
      console.log(error);
    }
  };

  // Frontend Comment button func
  const commentPost = async (text, postId) => {
    try {
      const response = await fetch("/api/post/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ text, postId }),
      });
      const json = await response.json();
      console.log(json);

      // logic for  comment on user only one time
      const newcmntpost = post.map((item) => {
        if (item._id === json._id) {
          return json;
        } else {
          return item;
        }
      });
      setPost(newcmntpost);
    } catch (error) {
      console.log(error);
    }
  };

  //frontend for delet post button
  const deletePost = async (id) => {
    try {
      const response = await fetch(`/api/post/deletePost/${id}`, {
        method: "delete",
        headers: {
          // 'Content-Type': 'application/json',
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ postId: id }),
      });
      const json = await response.json();
      console.log(json);

      const newdata = post.filter((item) => {
        return item._id !== id; // this id is the parameter use in line no 105
      });
      setPost(newdata);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("item is", post);
  return (
    <div className="home">
      {post.map((item) => {
        return (
          <div className="card  home-card">
            <h5>
              <Link
                to={item.postedBy &&
                  item.postedBy._id !== state._id
                    ? `/profile/${item.postedBy._id}`
                    : "/profile"
                }
              >
                {item.postedBy.name}
              </Link>{" "}
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => {
                    deletePost(item._id);
                  }}
                >
                  delete
                </i>
              )}{" "}
            </h5>
            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {/* //logic for like unlike button  */}
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikepost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likepost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}

              <h6>{item.likes.length}</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>

              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.cpostedBy.name}
                    </span>{" "}
                    {record.text}
                  </h6>
                );
              })}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  commentPost(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
