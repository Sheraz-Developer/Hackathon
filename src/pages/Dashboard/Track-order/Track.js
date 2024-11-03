import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "config/firebase";
import { Spin, Tag, Badge } from "antd";
import { TruckOutlined } from "@ant-design/icons";
import './style.css'; // Ensure this file is properly styled

const Track = () => {
  const [user, setUser] = useState({ fullName: "", email: "", uid: "" });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUserData(currentUser.uid);
      } else {
        console.log("User not found");
      }
    });

    return () => unsubscribe();
  }, [auth]); // Fixed dependency array

  const getUserData = async (id) => {
    try {
      const docRef = doc(firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        fetchOrders(id); // Fetch orders when user data is available
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const ordersQuery = query(
        collection(firestore, "orders"),
        where("orderedBy", "==", userId)
      );
      const querySnapshot = await getDocs(ordersQuery);
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching orders: ", error);
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Unknown Date";
  };

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "90vh" }}
      >
        <Spin />
      </div>
    );
  }

  return (
    <div className="track-container">
      <h1 className="my-3">My Orders</h1>
      {orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <li style={{ listStyleType: "none" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-secondary">
                    <b>{order.cartItems.itemName}</b>
                  </div>
                  <div className="d-flex align-items-center">
                    <TruckOutlined className="truck-icon" />
                    <Badge
                      status={order.isShipped ? "success" : "default"}
                      text={order.isShipped ? "Shipped" : "Not Shipped"}
                      style={{ marginLeft: "8px" }}
                    />
                  </div>
                </div>
                <div className="price-tag">
                  <Tag color="success">
                    $ {Number(order.cartItems.quantity) * Number(order.cartItems.price)}
                  </Tag>
                </div>
                <div className="order-date text-danger">
                  <b>Order Date: </b>{formatDate(order.createdAt)}
                </div>
                <div className="expected-delivery text-info">
                  <b>Expected Delivery: </b>{formatDate(order.expectedDelivery)}
                </div>
              </li>
            </div>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Track;
