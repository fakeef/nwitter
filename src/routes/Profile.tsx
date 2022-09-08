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
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={profileName as string} onChange={onChange} />
        <input type="submit" value="Change profile name" />
      </form>
      <h1> Welcome {userInfo?.displayName} !! </h1>
      <h3> Here are you nwitts </h3>

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
      <br />
      <br />
      <button onClick={onLogoutClick}> Log out </button>
    </>
  );
}
