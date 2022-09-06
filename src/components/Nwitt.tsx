import { deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../fbBase";
import { useState } from "react";
import { TypeNwitt } from "../routes/Home";

export default function Nwitt({ nwitObj, isOwner, docRef }: any) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editText, setEditText] = useState("");

  const onDeleteClick = async () => {
    const isOk = window.confirm("Are you sure to delete the nwit?");
    if (isOk) {
      try {
        const docSnap = await getDoc(docRef);
        await deleteDoc(docSnap.ref);
      } catch (e: any) {
        alert(e);
      }
    }
  };

  const onEditClick = () => {
    setIsEditMode(true);
    setEditText(nwitObj.nwitt);
  };

  const onEditCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditMode(false);
  };

  const onEditUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newNwitt: TypeNwitt = { ...nwitObj, nwitt: editText };
      await updateDoc(docRef, newNwitt);
      // await updateDoc(docRef, "nwitt", editText);
    } catch (e) {
      alert(e);
    }
    setIsEditMode(false);
  };

  const onChange = (e: any) => {
    setEditText(e.target.value);
  };

  const getFileRef = async () => {
    const url = await getDownloadURL(ref(storage, nwitObj.imgPath));
    const img = document.getElementById("nwittimg");
    img?.setAttribute("src", url);
  };
  getFileRef();

  return (
    <>
      {isEditMode ? (
        <form onSubmit={onEditUpdate}>
          <input
            type="text"
            onChange={onChange}
            value={editText}
            maxLength={120}
          />
          <input type="submit" value="Update Nwitt" />
          <button onClick={onEditCancel}> cancel </button>
        </form>
      ) : (
        <>
          <h4> {nwitObj.nwitt} </h4>
          {nwitObj.imgPath && (
            <img id="nwittimg" src="" alt="" width={50} height={50} />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}> delete nwitt </button>
              <button onClick={onEditClick}> edit nwitt </button>
            </>
          )}
        </>
      )}
    </>
  );
}
