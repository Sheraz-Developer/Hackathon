import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Button,
  Divider,
} from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "config/firebase";
import { useAuthContext } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Account.css";

export default function Account() {
  const [user, setUser] = useState({ fullName: "", email: "", uid: "" });

  const auth = getAuth();
  const { dispatch } = useAuthContext();
  let navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUserData(currentUser.uid);
      } else {
        console.log("User not found");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const getUserData = async (id) => {
    try {
      const docRef = doc(firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "SET_LOGGED_OUT" });
      window.toastify("Logged out successfully", "success");
      navigate('/auth/login');
    } catch (error) {
      console.error("Error logging out:", error);
      window.toastify("Error logging out", "error");
    }
  };

  return (
    <div className="account-container">
      {/* Cover Photo */}
      <div className="cover-photo">
        <Avatar
          size={120}
          src="https://cdn-icons-png.freepik.com/512/9512/9512837.png" /* Avatar Image URL */
          icon={<UserOutlined />}
          className="profile-avatar"
        />
      </div>
      {/* Profile Info */}
      <div className="profile-info">
        <Typography.Title level={3}>{user.fullName}</Typography.Title>
        <Typography.Text>{user.email}</Typography.Text>
        <Divider />
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
