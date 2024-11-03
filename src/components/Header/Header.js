import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, HeartOutlined, UserOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useAuthContext } from "contexts/AuthContext";

export default function Header() {
  const { isAuthenticated } = useAuthContext();
  const nav = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Function to update counts from localStorage
  const updateCounts = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCartCount(cartItems.length);
    setWishlistCount(wishlistItems.length);
  };

  // Update counts on component mount and when localStorage changes
  useEffect(() => {
    updateCounts();

    // Add event listener for storage changes
    window.addEventListener('storage', updateCounts);

    return () => {
      // Clean up event listener on component unmount
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const toggleMenu = () => {
    nav.current.classList.toggle("active");
  };

  return (
    <header className="header">
      <div className="logo">
        <img style={{borderRadius:"50px"}}
          src="https://img.freepik.com/free-vector/gradient-instagram-shop-logo-template_23-2149704603.jpg"
          alt="Logo"
        />
        <span>SHERAZ NOTES</span>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <nav className="nav" ref={nav}>
        {isAuthenticated ? (
          <>
            <Link to="/">&nbsp; <span>Home</span> </Link>
            <Link to="/dashboard">&nbsp; <span>Account</span> </Link>
            <Link to="/wishlist">
              <Badge count={wishlistCount} style={{ backgroundColor: '#f5222d' }}>
              </Badge> &nbsp;
              <span>Wishlist</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/auth/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
