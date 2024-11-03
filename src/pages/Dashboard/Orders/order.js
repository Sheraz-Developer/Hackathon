import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "config/firebase";
import { Card, Spin, Badge, Button, Image, Collapse, Switch } from "antd";
import { useAuthContext } from "contexts/AuthContext";
const { Panel } = Collapse;

const Order = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(firestore, "orders"),
          where("orderedTo", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        window.toastify("Something went wrong, or Network anomaly", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleComplete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "orders", id));
      setOrders(orders.filter((order) => order.id !== id));
      window.toastify("Order marked as completed and deleted", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      window.toastify("Failed to mark order as completed", "error");
    }
  };

  const handleShipped = async (id, isShipped) => {
    try {
      const orderRef = doc(firestore, "orders", id);
      await updateDoc(orderRef, { isShipped });
      window.toastify(
        `Order has been marked as ${isShipped ? "Shipped" : "Not Shipped"}`,
        "success"
      );
    } catch (error) {
      console.error("Error updating order:", error);
      window.toastify("Failed to update shipping status", "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>
      {loading ? (
        <Spin tip="Loading..." />
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <Collapse key={order.id} style={{ marginBottom: "20px" }}>
            <Panel
              header={`${order.cartItems.itemName}`}
              extra={
                <Switch
                  checked={order.isShipped}
                  onChange={(checked) => handleShipped(order.id, checked)}
                  checkedChildren="Shipped"
                  unCheckedChildren="Not Shipped"
                />
              }
            >
              <Card bordered={false}>
                <p>
                  <strong>Customer Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Address:</strong> {order.shippingAddress}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Quantity:</strong> &nbsp; {order.cartItems.quantity}
                </p>
                <p>
                  <strong>Total:</strong> &nbsp; $
                  {Number(order.cartItems.quantity) *
                    Number(order.cartItems.price)}
                </p>
                <p>
                  <strong>Status: &nbsp;</strong>
                  <Badge
                    status={order.completed ? "success" : "processing"}
                    text={order.completed ? "Completed" : "Pending"}
                  />
                </p>
                <div>
                  <h4>Cart Items:</h4>
                  <Image
                    src={order.cartItems.mainImageUrl}
                    height={50}
                    className="rounded rounded-full"
                  />
                </div>
                {/* Moved Complete Button here */}
                {!order.completed && (
                  <Button
                    type="primary"
                    danger
                    style={{ marginTop: "20px" }}
                    onClick={() => handleComplete(order.id)}
                  >
                    Mark as Completed
                  </Button>
                )}
              </Card>
            </Panel>
          </Collapse>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Order;
