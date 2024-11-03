import React, { useState, useEffect } from "react";
import { Steps, Form, Input, Button, Card, message, Select } from "antd";
import { getAuth } from "firebase/auth";
import { firestore } from "config/firebase";
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import './style.css';
const { Step } = Steps;

export default function Checkout() {
  const [current, setCurrent] = useState(0);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchUserData = async (userId) => {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUser(userData);
      setAddresses(userData.addresses || []);
      if (userData.addresses && userData.addresses.length > 0) {
        setSelectedAddress(userData.addresses[0]);
      }
    } else {
      console.error("User not found");
    }
  };

  const next = () => {
    if (current === 0 && !selectedAddress) {
      return message.error("Please select or add an address.");
    }
    if (current === 1 && !paymentMethod) {
      return message.error("Please select a payment method.");
    }
    if (current === 1 && paymentMethod === "Credit/Debit Card" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      return message.error("Please fill out card details.");
    }
    if (current === 2 && !email) {
      setEmailError("Please enter your email.");
      return;
    }
    setEmailError("");
    setCurrent(current + 1);
  };

  const prev = () => setCurrent(current - 1);

  const handleAddAddress = async () => {
    if (!newAddress) return message.error("Please enter a valid address");

    try {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        addresses: arrayUnion(newAddress),
      });

      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress);
      setNewAddress("");
      message.success("Address added successfully");
    } catch (error) {
      console.error("Error adding address:", error);
      message.error("Failed to add address");
    }
  };

  // Handle finalizing the order
  const handleOrder = async () => {
    if (!selectedAddress || !paymentMethod || !email) {
      return message.error(
        "Please select an address, payment method, and enter an email."
      );
    }

    try {
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + 7); // Add 7 days to current date

      for (const item of cartItems) {
        const { createdBy, ...productDetails } = item;

        const order = {
          cartItems: productDetails,
          orderedBy: auth.currentUser.uid,
          orderedTo: createdBy,
          paymentMethod,
          shippingAddress: selectedAddress,
          cardDetails:
            paymentMethod === "Credit/Debit Card" ? cardDetails : null,
          createdAt: new Date(),
          email,
          expectedDelivery, // Add expectedDelivery to order
        };

        await setDoc(
          doc(
            firestore,
            "orders",
            `${auth.currentUser.uid}_${new Date().getTime()}`
          ),
          order
        );
      }

      message.success("Order placed successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("Failed to place order");
    }
  };

  const steps = [
    {
      title: "Shipping Address",
      content: (
        <Form layout="vertical">
          {addresses.length > 0 ? (
            addresses.map((address, index) => (
              <Card
                key={index}
                onClick={() => setSelectedAddress(address)}
                style={{
                  border:
                    selectedAddress === address
                      ? "2px solid #F7931E"
                      : "1px solid #d9d9d9",
                  marginBottom: "10px",
                }}
              >
                {address}
              </Card>
            ))
          ) : (
            <p>No saved addresses. Please add a new one.</p>
          )}

          <Form.Item label="Add New Address">
            <Input
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter new address"
            />
            <Button
              className="add-btn"
              onClick={handleAddAddress}
              style={{ marginTop: "10px", backgroundColor: "#f7931e" }}
            >
              Add Address
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Payment Method",
      content: (
        <Form layout="vertical">
          <Form.Item label="Select Payment Method" required>
            <Select
              placeholder="Select a payment method"
              onChange={(value) => setPaymentMethod(value)}
            >
              <Select.Option value="Credit/Debit Card">
                Credit/Debit Card
              </Select.Option>
              <Select.Option value="Cash on Delivery">
                Cash on Delivery
              </Select.Option>
            </Select>
          </Form.Item>

          {paymentMethod === "Credit/Debit Card" && (
            <div>
              <Form.Item label="Card Number">
                <Input
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                  placeholder="Enter card number"
                />
              </Form.Item>
              <Form.Item label="Expiry Date">
                <Input
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                  placeholder="MM/YY"
                />
              </Form.Item>
              <Form.Item label="CVV">
                <Input
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                  placeholder="Enter CVV"
                />
              </Form.Item>
            </div>
          )}
        </Form>
      ),
    },
    {
      title: "Review and Complete Order",
      content: (
        <div>
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <h4>Payment Method: {paymentMethod}</h4>
          <h4>Shipping Address: {selectedAddress}</h4>
          <Form layout="vertical">
            <Form.Item
              label="Email Address"
              validateStatus={emailError ? "error" : ""}
              help={emailError}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Item>
          </Form>
          <Button className="add-btn" onClick={handleOrder}>
            Complete Order
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }} className="container">
      <Steps current={current} direction="vertical">
        {steps.map((item, index) => (
          <Step key={index} title={item.title} description={item.content} />
        ))}
      </Steps>
      <div className="steps-action" style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button className="add-btn" onClick={next}>
            Next
          </Button>
        )}
        {current > 0 && (
          <Button className="add-btn" style={{ margin: "0 8px" }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}
