import { deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
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
        if (nwitObj.imgPath !== null) {
          await deleteObject(ref(storage, nwitObj.imgPath));
        }
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
      // 사진도 업데이트??
      // 사진 업로드 관련 사항은 Home에 있는데.. 기능을 분리해야 할듯
      // <input file... onFileChange ... update는 여기도 있고 home(최초 업로드)에도 있고
      const newNwitt: TypeNwitt = { ...nwitObj, nwitt: editText };
      await updateDoc(docRef, newNwitt);
    } catch (error) {
      alert(error);
    }
    setIsEditMode(false);
  };

  const onChange = (e: any) => {
    setEditText(e.target.value);
  };

  // 파일을 가져와서 화면에 표시
  const [imgurl, setImgurl] = useState("");
  const getFileRef = async () => {
    const url = await getDownloadURL(ref(storage, nwitObj.imgPath));
    setImgurl(url);
  };
  getFileRef();

  return (
    <div className="nwitts-container">
      {isEditMode ? (
        <form onSubmit={onEditUpdate} className="nwitts-container">
          <input
            type="text"
            placeholder="Edit your nwitt"
            onChange={onChange}
            value={editText}
            maxLength={80}
            required
            autoFocus
            className="edit-nwitt"
          />
          <input type="submit" value="Update Nwitt" className="update-button" />
          <button onClick={onEditCancel} className="cancel-button">
            cancel
          </button>
        </form>
      ) : (
        <div className="nwitt-text-container">
          <h4 className="nwitt-text"> {nwitObj.nwitt} </h4>
          {nwitObj.imgPath && (
            <img
              className="nwitt-image"
              id="nwittimg"
              src={imgurl}
              alt=""
              width={50}
              height={50}
            />
          )}

          {isOwner && (
            <>
              <button onClick={onDeleteClick} className="nwitt-delete"></button>
              <button onClick={onEditClick} className="nwitt-edit"></button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
