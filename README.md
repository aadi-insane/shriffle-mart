# 🛒 ShriffleMart

<div align="center">

![ShriffleMart Logo](https://img.shields.io/badge/ShriffleMart-E--Commerce-blue?style=for-the-badge&logo=shopping-cart)

**A Modern Full-Stack E-Commerce Platform Built with Ruby on Rails**

[![Ruby on Rails](https://img.shields.io/badge/Ruby%20on%20Rails-7.0+-red?style=flat-square&logo=rubyonrails)](https://rubyonrails.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.0+-purple?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-blue?style=flat-square&logo=sqlite)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](#) • [📖 Documentation](#getting-started) • [🐛 Report Bug](https://github.com/aadi-insane/shriffle-mart/issues) • [✨ Request Feature](https://github.com/aadi-insane/shriffle-mart/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About The Project

ShriffleMart is a comprehensive e-commerce platform designed to demonstrate modern web development practices using Ruby on Rails. This project showcases a complete online shopping experience with user authentication, product management, shopping cart functionality, and order processing.

### Why ShriffleMart?

- 🎓 **Educational**: Perfect for learning Rails MVC architecture
- 🏗️ **Well-Structured**: Clean, maintainable codebase following Rails conventions
- 📱 **Responsive**: Mobile-first design with Bootstrap 5
- 🔒 **Secure**: Implements Rails security best practices
- 🚀 **Production-Ready**: Scalable architecture suitable for real-world deployment

---

## ✨ Features

<table>
<tr>
<td>

### 👤 User Management
- [x] User registration & authentication
- [x] Secure session management
- [x] User dashboard with order history
- [x] Profile management
- [x] Address book functionality

</td>
<td>

### 🛍️ Product Catalog
- [x] Product listing with pagination
- [x] Advanced product search & filtering
- [x] Product categories
- [x] Detailed product views
- [x] Product image gallery

</td>
</tr>
<tr>
<td>

### 🛒 Shopping Experience
- [x] Dynamic shopping cart
- [x] Real-time cart updates
- [x] Cart persistence across sessions
- [x] Quantity management
- [x] Price calculations

</td>
<td>

### 💳 Order Management
- [x] Streamlined checkout process
- [x] Multiple address support
- [x] Order confirmation
- [x] Order tracking
- [x] Order history

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|----------|------------|
| **Backend** | ![Ruby on Rails](https://img.shields.io/badge/Ruby%20on%20Rails-CC0000?style=for-the-badge&logo=ruby-on-rails&logoColor=white) |
| **Frontend** | ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) ![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white) |
| **Database** | ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white) |
| **Styling** | ![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white) |

</div>

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Check Ruby version (>= 3.0.0)
ruby --version

# Check Rails version (>= 7.0.0)
rails --version

# Check Node.js version (>= 14.0.0)
node --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadi-insane/shriffle-mart.git
   cd shriffle-mart
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Setup the database**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Start the development server**
   ```bash
   rails server
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### 🎉 You're all set! The application should now be running locally.

---

## 💡 Usage

### Quick Start Guide

1. **Register a new account** or use the test credentials:
   - Email: `test@example.com`
   - Password: `password`

2. **Browse products** on the homepage

3. **Add items to cart** and proceed to checkout

4. **Manage your profile** and view order history in the dashboard

### Sample Data

The application comes with pre-seeded data including:
- 20+ sample products across different categories
- Test user accounts
- Sample orders for demonstration

---

## 📁 Project Structure

```
shriffle-mart/
├── 📁 app/
│   ├── 📁 controllers/          # Application controllers
│   │   ├── addresses_controller.rb
│   │   ├── cart_controller.rb
│   │   ├── dashboard_controller.rb
│   │   ├── orders_controller.rb
│   │   ├── products_controller.rb
│   │   ├── sessions_controller.rb
│   │   └── users_controller.rb
│   ├── 📁 models/               # ActiveRecord models
│   │   ├── address.rb
│   │   ├── order.rb
│   │   ├── order_item.rb
│   │   ├── product.rb
│   │   └── user.rb
│   ├── 📁 views/                # View templates
│   └── 📁 assets/               # Stylesheets & JavaScript
├── 📁 config/                   # Application configuration
├── 📁 db/                       # Database files
│   ���── 📁 migrate/              # Database migrations
│   └── seeds.rb                 # Sample data
└── 📁 public/                   # Static assets
```

---

## 📸 Screenshots

<div align="center">

### Homepage
![Homepage](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=Homepage+Screenshot)

### Product Details
![Product Details](https://via.placeholder.com/800x400/2196F3/FFFFFF?text=Product+Details+Screenshot)

### Shopping Cart
![Shopping Cart](https://via.placeholder.com/800x400/FF9800/FFFFFF?text=Shopping+Cart+Screenshot)

### User Dashboard
![User Dashboard](https://via.placeholder.com/800x400/9C27B0/FFFFFF?text=User+Dashboard+Screenshot)

</div>

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Rails conventions and best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

**Aditya Aerpule** - [@aadi-insane](https://github.com/aadi-insane)

Project Link: [https://github.com/aadi-insane/shriffle-mart](https://github.com/aadi-insane/shriffle-mart)

---

<div align="center">

### 🌟 Show your support

Give a ⭐️ if this project helped you!

**[⬆ Back to Top](#-shrifflemart)**

</div>

---

<div align="center">
<sub>Built with ❤️ by <a href="https://github.com/aadi-insane">Aditya Aerpule</a></sub>
</div>