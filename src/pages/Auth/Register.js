import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, storage } from "config/firebase"; // Ensure storage is imported
import { Link } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthContext } from "contexts/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage methods

const initialState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  image: null, // Add image state
};

export default function Register() {
  const [state, setState] = useState(initialState);
  const { dispatch } = useAuthContext();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setState((s) => ({ ...s, image: e.target.files[0] }));
    } else {
      setState((s) => ({ ...s, [e.target.name]: e.target.value }));
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `profile_images/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const addTodB = async (user, imageUrl) => {
    let userData = {
      fullName: state.fullName,
      email: state.email,
      uid: user.uid,
      dateCreated: serverTimestamp(),
      isActive: true,
      profileImage: imageUrl, // Store the image URL
    };
    try {
      await setDoc(doc(firestore, "users", user.uid), userData);
      dispatch({ type: "SET_LOGGED_IN", payload: { user: userData } });
      console.log(userData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { fullName, email, password, confirmPassword, image } = state;

    fullName = fullName.trim();

    if (fullName.length < 3) {
      return window.toastify("Please enter your full name", "error");
    }
    if (!window.isEmail(email)) {
      return window.toastify("Please enter a valid email address", "error");
    }
    if (password.length < 6) {
      return window.toastify("Password must be at least 6 chars.", "error");
    }
    if (confirmPassword !== password) {
      return window.toastify("Password doesn't match", "error");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image); // Upload image and get URL
      }

      await addTodB(user, imageUrl); // Pass the image URL
      window.toastify("Registration success", "success");
    } catch (error) {
      console.error("error", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          window.toastify("Email address already in use", "error");
          break;
        default:
          window.toastify("Something went wrong", "error");
          break;
      }
    }
  };

  return (
    <div className="login-page register-page">
      <div className="login-form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            name="fullName"
            required
          />
          <input
            onChange={handleChange}
            type="email"
            placeholder="Email"
            name="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleChange}
            required
          />
          <button type="submit">
            Register
          </button>
        </form>
        <Link to="/auth/login">Already registered? Login here</Link>
      </div>
      <div className="login-image-container register-image">
        {/* You can add a different background image or image element here */}
      </div>
    </div>
  );
}
