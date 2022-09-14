import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { defaultAuth } from "../fbBase";

export default function AuthForm() {
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

  return (
    <>
      <form onSubmit={onSubmit} className="vertical-container">
        <input
          name="email"
          className="form-input"
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
          className="form-input"
        />
        <input
          className="form-button"
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
      </form>
      <span onClick={onToggle} className="auth-switch">
        {newAccount ? "Sign In?" : "Create New Account?"}
      </span>
    </>
  );
}
