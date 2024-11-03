import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Home/Home";
import Menu from "./Menu/Menu";
import Product from "./Menu/Product/Product";
import Wishlist from "./Wishlist/Wishlist";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/CheckoutPage";

export default function Frontend() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<Menu />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element="<h1>404 Not found</h1>" />
    </Routes>
  );
}
