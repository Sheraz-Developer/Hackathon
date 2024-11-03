import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Image,
  Carousel,
  Button,
  Spin,
  Rate,
  Row,
  Col,
  Space,
  Tag,
} from "antd";
import { firestore } from "config/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./style.css";
import Info from "./Info";
const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  console.log(cartItems.itemName);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(firestore, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleThumbnailClick = (index) => {
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
  };

  useEffect(() => {
    // Load cart from localStorage when the component is mounted
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{ height: "100vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <Spin />
      </div>
    );
  }

  const updateWishlist = (product, isAdding) => {
    setWishlistItems((prevItems) => {
      let updatedItems;
      if (isAdding) {
        window.toastify(`${product.itemName} added to wishlist`, "info");
        updatedItems = [...prevItems, product];
      } else {
        window.toastify(`${product.itemName} removed from wishlist`, "info");
        updatedItems = prevItems.filter((item) => item.id !== product.id);
      }

      // Save the updated wishlist to local storage
      localStorage.setItem("wishlist", JSON.stringify(updatedItems));

      return updatedItems;
    });
  };

  const handleAddToCart = (product) => {
    // Retrieve the current cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const isProductInCart = storedCart.some((item) => item.id === product.id);

    if (isProductInCart) {
      window.toastify(`${product.itemName} is already in the cart`, "info");
      return;
    }

    // Add the product to the cart if not already present
    const updatedCart = [...storedCart, product];
    setCartItems(updatedCart);

    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.toastify(`${product.itemName} added to cart`, "success");
  };

  // Function to handle checkbox changes for the wishlist
  const handleChange = (e, product) => {
    const isChecked = e.target.checked;

    // Call updateWishlist function with product and checkbox status
    updateWishlist(product, isChecked);
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product); // Add to cart
    navigate("/cart"); // Redirect to cart
  };

  const calRating = (product) => {
    // Check if the product has reviews
    if (!product.reviews || product.reviews.length === 0) {
      return 0; // No reviews means no rating
    }
  
    // Calculate the sum of all ratings
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  
    // Calculate the average rating
    const averageRating = totalRating / product.reviews.length;
  
    // Return the average rating rounded to one decimal place
    return Math.round(averageRating * 10) / 10;
  };
  
  

  return product ? (
    <div className="container mt-4">
      <div>
        <Link to="/" className="text-decoration-none text-secondary">
          Home &nbsp;
        </Link>
        &gt; &nbsp;
        <Link className="text-decoration-none text-black">Product</Link>
      </div>
      <div style={{ margin: "20px" }}>
        <Row gutter={16}>
          {/* Carousel (left side) */}
          <Col xs={24} md={12}>
            <Carousel ref={carouselRef} autoplay>
              <div>
                <Image
                  src={product.mainImageUrl}
                  alt="Main Image"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
              {/* {product.secondaryImageUrls &&
                product.secondaryImageUrls.map((imgUrl, index) => (
                  <div key={index}>
                    <Image
                      src={imgUrl}
                      alt={`Secondary Image ${index + 1}`}
                      style={{ maxWidth: "100%", height: "100%" }}
                    />
                  </div>
                ))} */}
            </Carousel>
            {/* Thumbnails */}
            <Space
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <img
                src={product.mainImageUrl}
                alt="Thumbnail"
                width={50}
                height={50}
                style={{ cursor: "pointer" }}
                onClick={() => handleThumbnailClick(0)}
              />
              {/* {product.secondaryImageUrls &&
                product.secondaryImageUrls.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    width={50}
                    height={50}
                    style={{
                      cursor: "pointer",
                      border: "2px solid transparent",
                    }}
                    onClick={() => handleThumbnailClick(index + 1)}
                  />
                ))} */}
            </Space>
          </Col>

          {/* Product details (right side) */}
          <Col xs={24} md={12} id="info">
            <Typography.Title id="title"
              style={{ color: "#4B3F72", width: "220px" }}
              level={2}
            >
              Author
            </Typography.Title>
            <Typography.Title id="title"
              style={{ marginLeft:"100px", color: "#4B3F72", width: "220px" }}
              level={2}
            >
             {product.authorName}
            </Typography.Title>
            <Typography.Title id="title"
              style={{ color: "#4B3F72", width: "220px" }}
              level={2}
            >
              Title:
            </Typography.Title>
            <Typography.Title id="title"
              style={{ marginLeft:"100px", color: "#4B3F72", width: "220px" }}
              level={2}
            >
             {product.itemName}
            </Typography.Title>
            <Typography.Title style={{ color: "#6D597A" }} level={3}>
              Description:
            </Typography.Title>
            <Typography.Title style={{ marginLeft:"150px", color: "#6D597A" }} level={3}>
              {product.description}
            </Typography.Title>
            <div style={{ marginTop: "10px" }}>
              <p className="my-4" style={{ color: "#333333" }}>
                Note Rating:
              </p>
              <Rate disabled value={calRating(product)} />
            </div>
            <Link to="dashboard/">
            <Button
              type="primary"
              style={{ marginTop: "20px", backgroundColor: "#1d3557" }}
              onClick={() => {
              
              }}
            >
              Edit
            </Button>
            </Link>
            <div className="heart-container" title="Like">
              <input
                checked={wishlistItems.some((item) => item.id === product.id)}
                onChange={(e) => handleChange(e, product)}
                type="checkbox"
                className="checkbox"
                id="Give-It-An-Id"
              />  
              <div className="svg-container">
                <svg
                  viewBox="0 0 24 24"
                  className="svg-outline"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  className="svg-filled"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                </svg>
                <svg
                  className="svg-celebrate"
                  width="100"
                  height="100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon points="10,10 20,20"></polygon>
                  <polygon points="10,50 20,50"></polygon>
                  <polygon points="20,80 30,70"></polygon>
                  <polygon points="90,10 80,20"></polygon>
                  <polygon points="90,50 80,50"></polygon>
                  <polygon points="80,80 70,70"></polygon>
                </svg>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Info product={product} />
      <section className="features-section my-5 container">
      </section>
    </div>
  ) : (
    <Typography.Text>Product not found</Typography.Text>
  );
};

export default Product;
