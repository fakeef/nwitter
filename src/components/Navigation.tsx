import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserInfoContext } from "./App";

export default function Navigation({ setIsNameChanged }: any) {
  const userInfo = useContext(UserInfoContext);

  return (
    <ul>
      <li>
        <Link to="/profile"> Profile( {userInfo?.displayName} )</Link>
      </li>
    </ul>
  );
}
