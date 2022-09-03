import React from "react";
import Router from "./Router";
import { useState } from "react";
import { defaultAuth } from "../fbBase";

function App() {
  const userStatus = defaultAuth.currentUser ? true : false;
  const [isLoggedIn, setLoggedIn] = useState(userStatus);

  return <Router isLoggedIn={isLoggedIn} />;
}

export default App;
