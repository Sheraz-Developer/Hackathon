# Shopity

## 1. Project Overview
**Title:** Shopity  
**Description:** A full-stack e-commerce site featuring a comprehensive dashboard for managing electronics items.

---

## 2. Features
- 🎨 **Visually appealing landing page**
- 🔐 **User authentication** (Login/Signup)
- 🛍️ **Product filtering** (by price, category, or date) and detailed previews
- 🛒 **Add to cart**, wishlist, and order tracking functionalities
- 🖥️ **Admin dashboard** for managing products (add, update, delete)
- 💳 **Secure checkout process** with multiple payment options

---

## 3. Tech Stack
- **Frontend:** React, Bootstrap, SCSS
- **Backend:** Firebase (Backend services)
- **Database:** Firebase Firestore
- **Other Tools:** Ant Design, Toastify JS

---

## 4. Pages and Structure

### 🔹 Landing Page
- A visually appealing homepage that welcomes users.
- Highlights featured products, offers, and categories.
- User-friendly navigation and filtering options.

### 🔹 Login Page
- User authentication using Firebase Authentication.
- Supports email and password login.

### 🔹 Signup Page
- New user registration with form validation.
- Firebase Authentication integration for creating new accounts.

### 🔹 Dashboard
**Sub-pages:**
1. **All Products:**  
   Admin view of all products with options to edit or delete.
2. **Add New Product:**  
   Form for adding new products, including fields for product details, images, and categories.
3. **Orders:**  
   Overview of customer orders, with the ability to mark orders as completed or shipped.
4. **Track Order:**  
   Allows users to view the current status of their placed orders.
5. **User Account:**  
   User profile settings, allowing users to update personal information.

### 🔹 Product Home Page
- Displays a collection of products with filter and sorting options for easy navigation.

### 🔹 Product Preview Page
- Detailed view of a single product, including images, description, price, reviews, and calculated seller ratings.
- Option to add the product to the cart or wishlist.

### 🔹 Wishlist Page
- Displays products that users have added to their wishlist.
- Ability to move products to the cart or remove them from the wishlist.

### 🔹 Cart Page
- Users can review the products they’ve added to the cart.
- Option to adjust product quantities or remove items.
- Displays the total cost before proceeding to checkout.

### 🔹 Checkout Page
- Final step in the purchase process.
- Captures shipping address, payment method (Visa, Cash on Delivery, etc.), and displays the order summary.

---
## Contributing

Contributions are always welcome!
Please adhere to this project's `code of conduct`.


## Installation

Run Locally
```bash
git clone git clone https://github.com/Nouman475/shopity.git
```
Install dependencies

```bash
npm install
```
  Run 

```bash
npm start
```
## Authors

- [Muhammad Nouman](https://github.com/Nouman475)


## Acknowledgements
Special thanks to the open-source community for the tools and libraries used in this project.
## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


