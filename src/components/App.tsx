import React from "react";
import Router from "./Router";
import { useState, useEffect, useRef } from "react";
import { defaultAuth } from "../fbBase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    onAuthStateChanged(defaultAuth, (user) => {
      if (user) {
        // user is signed in
        setIsLoggedIn(true);
      } else {
        // user is signed out
        setIsLoggedIn(false);
      }
      setInit(true);
    }),
    []
  );

  return <>{init ? <Router isLoggedIn={isLoggedIn} /> : "Initialzing..."}</>;
}

export default App;
