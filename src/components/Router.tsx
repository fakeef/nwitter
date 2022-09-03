import { BrowserRouter as BRouter, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

export default function Router({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <BRouter>
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </BRouter>
  );
}
