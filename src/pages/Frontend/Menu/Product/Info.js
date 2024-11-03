import React, { useState } from 'react';
import { Tabs, Rate, Input, Button } from 'antd';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from 'config/firebase';
import { UserOutlined,StarOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Info({ product }) {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);

  // Handler for submitting the review
  const handleReviewSubmit = async () => {
    if (newReview && newRating) {
      try {
        const productRef = doc(firestore, 'items', product.productId); // Assuming product.id is the product ID
        const reviewObject = {
          review: newReview,
          rating: newRating,
          timestamp: new Date(),
        };
        
        await updateDoc(productRef, {
          reviews: arrayUnion(reviewObject),
        });

        // Reset form fields
        setNewReview('');
        setNewRating(0);

        console.log('Review submitted successfully!');
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarOutlined
        key={index}
        style={{ color: index < rating ? 'rgb(255, 91, 137)' : 'lightgray' }}
      />
    ));
  }

  return (
    <div className="info-container container mt-4">
      <Tabs
        defaultActiveKey="1"
        centered
        className="custom-tabs"
        tabBarStyle={{ color: 'black' }} // Set tab text color to black
        animated={{ inkBar: true, tabPane: true }} // Enable smooth transitions
      >
        <TabPane tab="Description" key="1">
          <div className="tab-content">
            <h4>Description</h4>
            <p>{product.description}</p>
          </div>
        </TabPane>

        <TabPane tab="Reviews" key="3">
          <div className="tab-content">
            <h4>Reviews</h4>
            {product.reviews && product.reviews.length > 0 ? (
              <ul>
                {product.reviews.map((review, index) => (
                  <div style={{backgroundColor:"#fffcdc"}} className='px-3 py-2 my-2 rounded rounded-3'>
                  <UserOutlined/>
                  <li key={index} style={{listStyleType:"none"}}>
                    <div><b>Rating: </b>{renderStars(review.rating)}</div>
                    <div className='text-secondary'>{review.review}</div>
                    <div className='text-danger' >{new Date(review.timestamp.toDate()).toLocaleString()}</div>
                  </li>
                  </div>
                ))}
              </ul>
            ) : ( 
              <p>No reviews yet.</p>
            )}

            {/* Rating and Review Form */}
            <h5>Submit a Review</h5>
            <form className="review-form">
              <div className="form-group">
                <label htmlFor="rating">Rating:</label> 
                <Rate
                  value={newRating}
                  onChange={(value) => setNewRating(value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="review">Your Review:</label>
                <TextArea
                  rows={4}
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write your review here"
                />
              </div>
              <Button
                type="primary"
                className='mt-3'
                onClick={handleReviewSubmit}
                disabled={!newReview || !newRating}
              >
                Submit Review
              </Button>
            </form>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
