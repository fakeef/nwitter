import { useContext, useEffect, useState } from "react";
import { defaultAuth } from "../fbBase";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserInfoContext } from "../components/App";
import { TypeNwitt } from "../routes/Home";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../fbBase";
import Nwitt from "../components/Nwitt";

export default function Profile({ setIsNameChanged }: any) {
  const navigate = useNavigate();
  const userInfo = useContext(UserInfoContext);
  const collectionRef = collection(db, "nwitt");
  const [nwitts, setNwitts] = useState<TypeNwitt[]>([]);
  const [profileName, setProfileName] = useState(userInfo?.displayName);

  const getMyNwitts = async () => {
    const q = query(collectionRef, where("userId", "==", userInfo?.uid));
    const querySnapshot = await getDocs(q);
    const nwittArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNwitts(nwittArray as TypeNwitt[]);
  };

  useEffect(() => {
    getMyNwitts();
  }, []);

  const onLogoutClick = () => {
    try {
      signOut(defaultAuth);
    } catch (e: any) {
      alert("Sign out error " + e);
    } finally {
      navigate("/");
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setProfileName(value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (profileName !== userInfo?.displayName) {
      try {
        userInfo &&
          (await updateProfile(userInfo, { displayName: profileName }));
        setProfileName("");
        setIsNameChanged((prev: boolean) => !prev);
        navigate("/");
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="nwitts-container">
        <input
          type="text"
          value={profileName as string}
          onChange={onChange}
          autoFocus
          className="edit-nwitt"
        />
        <input
          type="submit"
          value="Change profile name"
          className="update-button"
        />
      </form>
      <p
        style={{
          width: "100%",
          border: "1px solid white",
        }}
      ></p>
      <button onClick={onLogoutClick} className="cancel-button">
        Log out
      </button>

      <div>
        {nwitts.map((elem) => (
          <Nwitt
            key={elem.id}
            nwitObj={elem}
            isOwner={elem.userId === userInfo?.uid}
            docRef={doc(collectionRef, elem.id)}
          />
        ))}
      </div>
    </div>
  );
}
