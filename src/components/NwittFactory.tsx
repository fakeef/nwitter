import { addDoc, collection } from "firebase/firestore";
import { ref, StringFormat, uploadString } from "firebase/storage";
import { useContext, useState } from "react";
import { db, storage } from "../fbBase";
import { v4 as uuidv4 } from "uuid";
import { UserInfoContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function NwittFactory() {
  const [nwitt, setNwitt] = useState("");
  const [attachment, setAttachment] = useState<
    string | ArrayBuffer | null | undefined
  >(null);
  const userInfo = useContext(UserInfoContext);
  const uid = userInfo ? userInfo.uid : "";

  // submit nwitt to server with an image (only if there is an image)
  const onNwittSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const storageRef = ref(storage, "nwitt/" + uuidv4());
    try {
      let imgPath = null;
      // image upload to storage
      if (attachment !== null) {
        const fileSnapshot = await uploadString(
          storageRef,
          attachment as string,
          StringFormat.DATA_URL
        );
        imgPath = fileSnapshot.ref.toString();
      }

      // nwitt upload to firestore
      const collectionRef = collection(db, "nwitt");
      await addDoc(collectionRef, {
        nwitt,
        createAt: Date(),
        userId: uid,
        imgPath: imgPath,
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

  // when (image) file is selected...
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

  // cancel the selected (image) file
  const onClearClick = () => {
    setAttachment(null);
  };

  return (
    <form onSubmit={onNwittSubmit} className="factory_container">
      <div className="nwitt-container">
        <input
          className="nwitt-input"
          type="text"
          onChange={onChange}
          value={nwitt}
          placeholder="what's on your mind?"
          maxLength={80}
        />
        <input type="submit" value="&rarr;" className="nwitt-submit" />
      </div>
      <label htmlFor="attach-file">
        <span style={{ color: "white", cursor: "pointer" }}>Add photos</span>
        <span className="photo-add" />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0, display: "none" }}
      />
      {attachment && (
        <div className="factory_container">
          <img src={attachment as string} alt="" width="50px" height="50px" />
          <button onClick={onClearClick} className="photo-cancel-button">
            <span className="text-cancel">Cancel</span>
          </button>
        </div>
      )}
    </form>
  );
}
