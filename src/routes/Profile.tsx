import { defaultAuth } from "../fbBase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const onLogoutClick = () => {
    try {
      signOut(defaultAuth);
    } catch (e: any) {
      alert("Sign out error " + e);
    } finally {
      navigate("/");
    }
  };
  return <button onClick={onLogoutClick}> Log out </button>;
}
