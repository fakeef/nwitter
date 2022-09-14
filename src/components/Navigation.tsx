import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserInfoContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKiwiBird } from "@fortawesome/free-solid-svg-icons";
import { CollectionReference } from "firebase/firestore";

export default function Navigation({ setIsNameChanged }: any) {
  const userInfo = useContext(UserInfoContext);

  return (
    <nav>
      <ul className="navi-container">
        <li>
          <Link to="/">
            <span className="navi-to-home"></span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className="navi-profile-container">
            <span className="navi-to-profile"></span>
            <span className="profile-name">
              {userInfo?.displayName
                ? `${userInfo.displayName}의 profile`
                : "Profile"}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
