import { BrowserRouter as BRouter, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

export default function Router({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <BRouter>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Auth />} />
        )}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BRouter>
  );
}
