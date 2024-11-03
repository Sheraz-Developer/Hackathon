import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useAuthContext } from "contexts/AuthContext";


export default function Login() {
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "SET_LOGGED_IN", payload: { user } });
      } else {
        dispatch({ type: "SET_LOGGED_OUT" });
      }
    });
  }, [dispatch]);

  let initialState = { email: "", password: "" };
  const [state, setState] = useState(initialState);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    let { email, password } = state;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.toastify("Login success", "success");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-credential":
            window.toastify("Wrong Email or Password", "error");
            break;
          default:
            window.toastify("Something went wrong or Network anomaly", "error");
            break;
        }
      });
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={handleChange}
            name="email"
            required
          />
          <input
            type="password"
            onChange={handleChange}
            placeholder="Password"
            name="password"
            required
          />
          <button type="submit">
            Login
          </button>
        </form>
        <Link to="/auth/register">New? Register here</Link>
      </div>
      <div className="login-image-container">
        {/* You can add a background image or image element here */}
      </div>
    </div>
  );
}
