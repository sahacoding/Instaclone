import React, { createContext, useContext, useReducer } from "react";
//import {reducer, initialState} from "./reducers/userReducer"
import { reducer, initialState } from "../reducers/userReducer";
export const UserContext = createContext();

export default function UserProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const[state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <UserContext.Provider value={{ state, dispatch }}>
        {props.children}
      </UserContext.Provider>
    </div>
  );
}
