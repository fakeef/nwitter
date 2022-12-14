import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../fbBase";
import { collection } from "firebase/firestore";
import { UserInfoContext } from "../components/App";

import Nwitt from "../components/Nwitt";
import NwittFactory from "../components/NwittFactory";

export type TypeNwitt = {
  createAt: string;
  id: string;
  nwitt: string;
  userId: string;
  imgPath: string | null;
  timestamp: string;
};

export default function Home() {
  const [nwitts, setNwitts] = useState<TypeNwitt[]>([]);
  const collectionRef = collection(db, "nwitt");
  const userInfo = useContext(UserInfoContext);
  const uid = userInfo ? userInfo.uid : "";

  useEffect(() => {
    // callback function called when the db is changed.
    onSnapshot(collectionRef, (snapshot) => {
      const nwitArray: TypeNwitt[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        createAt: "",
        nwitt: "",
        userId: "",
        imgPath: null,
        timestamp: "",
        ...doc.data(),
      }));
      setNwitts(nwitArray);

      nwitArray.sort((a, b) => {
        if (Number(a.timestamp) <= Number(b.timestamp)) {
          return 1;
        } else {
          return -1;
        }
      });
    });
  }, []);

  return (
    <div className="home-container">
      <NwittFactory />
      <div className="nwitts-container">
        {nwitts.map((elem) => (
          <Nwitt
            key={elem.id}
            nwitObj={elem}
            isOwner={elem.userId === uid}
            docRef={doc(collectionRef, elem.id)}
          />
        ))}
      </div>
    </div>
  );
}
