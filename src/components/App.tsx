import React, { useRef } from "react";
import Router from "./Router";
import { useState, useEffect } from "react";
import { defaultAuth } from "../fbBase";
import { onAuthStateChanged, User } from "firebase/auth";

function App() {
  const [init, setInit] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const currentUser = useRef<User | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    onAuthStateChanged(defaultAuth, (user) => {
      if (user) {
        // user is signed in
        setIsLoggedIn(true);
        currentUser.current = user;
      } else {
        // user is signed out
        setIsLoggedIn(false);
        currentUser.current = null;
      }
      setInit(true);
    }),
    []
  );

  return (
    <>
      <UserInfoContext.Provider value={currentUser.current}>
        {init ? <Router isLoggedIn={isLoggedIn} /> : "Initialzing..."}
      </UserInfoContext.Provider>
    </>
  );
}
export const UserInfoContext = React.createContext<User | null>(null);
export default App;
