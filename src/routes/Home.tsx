import { addDoc, doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db, storage } from "../fbBase";
import { collection } from "firebase/firestore";
import { StringFormat } from "firebase/storage";
import { ref, uploadBytes, uploadString } from "firebase/storage";
import { UserInfoContext } from "../components/App";
import { v4 as uuidv4 } from "uuid";
import Nwitt from "../components/Nwitt";

export type TypeNwitt = {
  createAt: string;
  id: string;
  nwitt: string;
  userId: string;
  imgPath: string | null;
};

export default function Home() {
  const [nwitt, setNwitt] = useState("");
  const [nwitts, setNwitts] = useState<TypeNwitt[]>([]);
  const [attachment, setAttachment] = useState<
    string | ArrayBuffer | null | undefined
  >(null);
  const userInfo = useContext(UserInfoContext);
  const collectionRef = collection(db, "nwitt");
  const uid = userInfo ? userInfo.uid : "";
  useEffect(() => {
    // callback function called when the db is changed.
    onSnapshot(collectionRef, (snapshot) => {
      const nwitArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNwitts(nwitArray as TypeNwitt[]);
    });
  }, []);

  const onNwittSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const storageRef = ref(storage, "nwitt/" + uuidv4());
    try {
      const fileSnapshot = await uploadString(
        storageRef,
        attachment as string,
        StringFormat.DATA_URL
      );
      const collectionRef = collection(db, "nwitt");
      await addDoc(collectionRef, {
        nwitt,
        createAt: Date(),
        userId: uid,
        imgPath: fileSnapshot.ref.toString(),
      });
    } catch (error) {
      alert(error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setNwitt(value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const imgFile = files && files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "loadend",
      (event) => {
        setAttachment(event.target?.result);
      },
      false
    );
    imgFile && reader.readAsDataURL(imgFile);
  };

  const onClearClick = () => {
    setAttachment(null);
  };

  return (
    <>
      <form onSubmit={onNwittSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={nwitt}
          placeholder="what's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nwitt" />
        {attachment && (
          <>
            <img src={attachment as string} alt="" width="50px" height="50px" />
            <button onClick={onClearClick}> Clear Photo </button>
          </>
        )}
      </form>
      <div>
        {nwitts.map((elem) => (
          <Nwitt
            key={elem.id}
            nwitObj={elem}
            isOwner={elem.userId === uid}
            docRef={doc(collectionRef, elem.id)}
          />
        ))}
      </div>
    </>
  );
}
