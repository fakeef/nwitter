import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserInfoContext } from "./App";

export default function Navigation({ setIsNameChanged }: any) {
  const userInfo = useContext(UserInfoContext);

  return (
    <nav>
      <ul className="navi-container">
        <li>
          <Link to="/nwitter">
            <span className="navi-to-home"></span>
          </Link>
        </li>
        <li>
          <Link to="/nwitter/profile" className="navi-profile-container">
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
