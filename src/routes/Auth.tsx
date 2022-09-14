import { defaultAuth } from "../fbBase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import AuthForm from "../components/AuthForm";

export default function Auth() {
  const onSocialClick = async (e: any) => {
    const {
      target: { name },
    } = e;

    if (name === "google") {
      let provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      try {
        await signInWithPopup(defaultAuth, provider);
      } catch (e: any) {
        alert("google sign in error" + e);
      }
    }
  };

  return (
    <div className="vertical_container">
      <span className="icon-home"></span>
      <AuthForm />
      <div>
        <button name="google" onClick={onSocialClick} className="google-signin">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
