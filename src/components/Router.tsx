import { BrowserRouter as BRouter, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";
import React, { useState } from "react";

export default function Router({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isNameChanged, setIsNameChanged] = useState(false);

  return (
    <BRouter>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Auth />} />
        )}
        <Route
          path="/profile"
          element={<Profile setIsNameChanged={setIsNameChanged} />}
        />
      </Routes>
    </BRouter>
  );
}
