# 🛒 ShriffleMart – Beginner-Friendly Full-Stack E-Commerce Website

ShriffleMart is a simple, beginner-friendly full-stack e-commerce web application built with **Ruby on Rails**, styled using **Bootstrap 5**, and enhanced with **jQuery** for basic dynamic features. It demonstrates the core structure and logic of a basic online store including user authentication, product browsing, shopping cart, and a simulated checkout flow.

---

## 🚀 Tech Stack

- **Backend**: Ruby on Rails (latest stable version)
- **Frontend**: Bootstrap 5 (via CDN) + jQuery
- **Database**: SQLite (default for Rails development)

---

## ✅ Core Features

### 👤 User Authentication
- User Registration with validations
- Login & Logout using Rails sessions
- Flash messages for feedback (login success/error, logout, etc.)

### 🛍️ Product Management
- Product listing on homepage
- Single product detail view
- Products are seeded via `db/seeds.rb`

### 🛒 Shopping Cart (Session-based)
- Add to cart (via jQuery and AJAX)
- Remove from cart
- View cart with quantities, total price

### 💳 Checkout & Orders
- Checkout form (Name, Email, Address)
- Saves order and order items in the database
- Redirects to a Thank You page (no real payment integration)

---

## 📦 Getting Started

### Prerequisites
- Ruby >= 3.x
- Rails >= 7.x
- SQLite3
- Node.js & Yarn (for Rails asset pipeline)

### Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/shrifflemart.git
cd shrifflemart
````

2. Install dependencies:

```bash
bundle install
```

3. Set up the database:

```bash
rails db:setup
```

4. Start the development server:

```bash
rails server
```

5. Open your browser:

```
http://localhost:3000
```

---

## 🧪 Test Credentials

You can register a new user or create one via console:

```bash
rails console
User.create(name: "Test User", email: "test@example.com", password: "password")
```

---

## 📁 Folder Structure Overview

```
shrifflemart/
├── app/
│   ├── controllers/     # All controller logic (Users, Products, Orders, Cart, Sessions)
│   ├── models/          # ActiveRecord models
│   ├── views/           # HTML views and partials
│   └── assets/          # JavaScript (jQuery), stylesheets
├── db/
│   ├── migrate/         # DB schema migrations
│   └── seeds.rb         # Sample products
├── config/
│   └── routes.rb        # URL route definitions
```

---

## 🎯 Learning Goals

This project is built to help beginners:

* Understand MVC architecture in Rails
* Practice using Rails generators and migrations
* Learn to manage session data (e.g., for carts)
* Apply Bootstrap utility classes for responsive UIs
* Use jQuery for basic dynamic behavior without React or Vue

---

## 🚫 What’s Not Included

* No real payment gateway integration
* No admin dashboard
* No advanced cart logic (like inventory/stock checks)
* No user profile or order history

---

## 🙌 Credits & License

This project is open-source and free to use for learning purposes. Created as a sample beginner project by \[Your Name].

Licensed under the [MIT License](LICENSE).

---

Happy Coding! 🎉

