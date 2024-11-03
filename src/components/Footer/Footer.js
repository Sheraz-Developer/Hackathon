import React from "react";
import {
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="Ahbar col-md-3 d-flex align-items-center">
            SHERAZ NOTES
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-4 mb-4">
                <h5>About Us</h5>
                <p>
                  We are a leading provider of computer accessories and
                  electronics, offering top-quality products and exceptional
                  customer service.
                </p>
              </div>
              <div className="col-md-4 mb-4">
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                  <li><a href="/">Home</a></li>
                  <li><a href="/">Products</a></li>
                  <li><a href="/">About Us</a></li>
                  <li><a href="/">Contact Us</a></li>
                </ul>
              </div>
              <div className="col-md-4 mb-4">
                <h5>Contact Information</h5>
                <p><PhoneOutlined /> +92 3079668666</p>
                <p><MailOutlined /> sheraz@gmail.com</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-center">
                <a href="/" className="social-icon"><FacebookOutlined /></a>
                <a href="/" className="social-icon"><TwitterOutlined /></a>
                <a href="/" className="social-icon"><InstagramOutlined /></a>
                <a href="/" className="social-icon"><LinkedinOutlined /></a>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-center mt-3">
                <p>
                  &copy; {new Date().getFullYear()} Made by{" "}
                  <a className="text-success">Sheraz</a>.
                  All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
