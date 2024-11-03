import React, { useState, useEffect } from "react";
import { InputNumber, Button, Input, message, Spin } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Cart.css"; // External CSS for additional styling

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allQuantitiesSet, setAllQuantitiesSet] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch cart items from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Check if all quantities are set properly (min 1)
  useEffect(() => {
    const areQuantitiesSet = cartItems.every((item) => item.quantity >= 1);
    setAllQuantitiesSet(areQuantitiesSet);
    if (areQuantitiesSet) calculateTotal(cartItems);
  }, [cartItems]);

  // Calculate total
  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );
    setGrandTotal(total);
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    message.success("Item removed");
  };

  // Apply coupon
  const applyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(0.1);
      message.success("Coupon applied: 10% off");
    } else {
      message.error("Invalid coupon");
      setDiscount(0);
    }
  };

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  // Update item quantity (minimum value is 1)
  const updateQuantity = (id, value) => {
    if (value < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: value } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Total after applying discount
  const finalTotal = grandTotal - grandTotal * discount;

  // Handle checkout navigation
  const handleCheckout = () => {
    if (allQuantitiesSet) {
      navigate(`/checkout`);
    } else {
      message.error("Please set quantity for all items before checking out.");
    }
  };
  if (loading) {
    return (
      <div className="spin-c">
        <Spin />
      </div>
    );
  }
  return (
    <div className="container mt-4">
      <div className="fs-3 my-2">
        <div>
          {" "}
          <ShoppingCartOutlined /> Cart
        </div>
      </div>
      <div className="row">
        {cartItems.length === 0 ? (
          <div className="row">
            <div className="col-lg-6 col-sm-12">
              <img
                id="no-img"
                src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-illustration-download-in-svg-png-gif-file-formats--page-error-404-empty-state-pack-user-interface-illustrations-5210416.png"
                alt="not found"
              />
            </div>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <img
                  src={item.mainImageUrl || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="mb-2">
                    Price: ₹{(Number(item.price) || 0).toFixed(2)}
                  </p>

                  {/* Flex container for better alignment */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="quantity-section">
                      <p className="mb-0">Quantity:</p>
                      <InputNumber
                        min={1}
                        max={99}
                        defaultValue={1}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.id, value)}
                        className="mx-2"
                      />
                    </div>
                    <p className="mb-0">
                      Total: ₹
                      {(
                        (Number(item.price) || 0) * (item.quantity || 1)
                      ).toFixed(2)}
                    </p>
                  </div>

                  <Button danger onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-4 p-3 bg-light rounded">
          <div className="row">
            <div className="col-md-6">
              <Input
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-right">
              <Button type="primary" onClick={applyCoupon}>
                Apply Coupon
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <p>Grand Total: ₹{grandTotal.toFixed(2)}</p>
            {discount > 0 && (
              <h4>Discount: -₹{(grandTotal * discount).toFixed(2)}</h4>
            )}
            <p>Final Total: ₹{finalTotal.toFixed(2)}</p>
          </div>

          <div className="text-right">
            <Button
              type="primary"
              size="large"
              disabled={!allQuantitiesSet}
              onClick={handleCheckout} // Navigate to checkout on click
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
