import React, { useState, useEffect } from "react";
import { Button } from "antd"; // Import Ant Design Button
import { useNavigate } from "react-router-dom";
import "./Wishlist.css"; // External CSS for styling

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve wishlist items from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(storedWishlist);

    // Retrieve cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);
 
  const handleRemoveFromWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleAddToCart = (product) => {
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.toastify(`${product.itemName} added to cart`,"success")
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">Your Wishlist</h2>
      {wishlistItems.length > 0 ? (
        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <div key={product.id} className="wishlist-card">
              <img src={product.mainImageUrl} alt={product.name} className="wishlist-img" />
              <div className="wishlist-info">
                <h4>{product.itemname}</h4>
                <p>{product.description}</p>
                <div className="wishlist-actions">
                  <Button
                    type="danger"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                  >
                    Remove from Wishlist
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <img id="no-img" src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-illustration-download-in-svg-png-gif-file-formats--page-error-404-empty-state-pack-user-interface-illustrations-5210416.png" alt="not found" height={300} />
      )}
    </div>
  );
};

export default Wishlist;
