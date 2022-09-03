import { useState } from "react";
import { defaultAuth } from "../fbBase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    } else {
      setPassword(event.target.value);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (newAccount) {
        // create account
        await createUserWithEmailAndPassword(defaultAuth, email, password);
      } else {
        // log in
        await signInWithEmailAndPassword(defaultAuth, email, password);
      }
    } catch (e: any) {
      alert(" create user with email/pswd error: " + e.code + " " + e.message);
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  const onToggle = () => {
    setNewAccount((prev) => !prev);
  };

  const onSocialClick = async (e: any) => {
    const {
      target: { name },
    } = e;

    if (name === "google") {
      let provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      try {
        const result = await signInWithPopup(defaultAuth, provider);
      } catch (e: any) {
        alert("google sign in error" + e);
      }
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
      </form>
      <span onClick={onToggle}>
        {newAccount ? "toggle to Sign In" : "toggle to Create New Account"}
      </span>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
