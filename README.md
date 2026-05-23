# 🏕️ Wanderlust

> An Airbnb-inspired full-stack web application for discovering and listing unique travel stays — built with Node.js, Express, MongoDB, and EJS.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://wanderlust-project-jruw.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-archipriya03-black?style=for-the-badge&logo=github)](https://github.com/archipriya03/Wanderlust-)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Future Improvements](#-future-improvements)

---

## 📖 About the Project

**Wanderlust** is a full-stack web application that allows users to list their properties and explore stays listed by others — similar to Airbnb. It was built to demonstrate end-to-end web development skills including authentication, cloud storage, interactive maps, and database design using the MVC pattern.

Users can:
- Register and log in securely
- Create, edit, and delete their own listings
- Upload property images (stored on Cloudinary)
- View listing locations on an interactive map (Leaflet.js)
- Leave reviews and star ratings on listings

---

## 🌐 Live Demo

🔗 **[https://wanderlust-project-jruw.onrender.com](https://wanderlust-project-jruw.onrender.com)**

> ⚠️ Hosted on Render's free tier — the server may take **30–60 seconds to wake up** on first visit.

---

## ✨ Features

- 🔐 **User Authentication** — Register, login, logout using Passport.js (local strategy)
- 🏠 **Full CRUD for Listings** — Create, read, update, delete property listings
- 🛡️ **Authorization** — Only the owner of a listing can edit or delete it
- 🖼️ **Image Upload** — Upload property photos via Multer + Cloudinary
- 🗺️ **Interactive Maps** — Leaflet.js map on every listing page showing the property location
- ⭐ **Reviews & Ratings** — Logged-in users can leave star ratings and text reviews
- ⚡ **Flash Messages** — User-friendly success and error notifications
- 🔒 **Input Validation** — Server-side validation using Joi schemas
- 📱 **Responsive Design** — Works across desktop and mobile devices
- 🧱 **MVC Architecture** — Clean separation of Models, Views, and Controllers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (Atlas) |
| **ODM** | Mongoose |
| **Templating** | EJS + EJS-Mate (layouts) |
| **Authentication** | Passport.js (local strategy) |
| **Session Store** | connect-mongo |
| **Image Upload** | Multer + Cloudinary |
| **Maps** | Leaflet.js + OpenStreetMap |
| **Validation** | Joi |
| **Styling** | Custom CSS |
| **Deployment** | Render |

---

## 📁 Project Structure

```
Wanderlust/
│
├── controllers/          # Route handler logic (listings, reviews, users)
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/               # Mongoose schemas
│   ├── listing.js
│   └── review.js
│   └── user.js
│
├── routes/               # Express routers
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/                # EJS templates
│   ├── listings/
│   ├── users/
│   ├── layouts/
│   └── partials/
│
├── public/               # Static assets (CSS, JS, images)
│   ├── css/
│   └── js/
│
├── utils/                # Utility helpers
│   ├── ExpressError.js   # Custom error class
│   └── wrapAsync.js      # Async error wrapper
│
├── init/                 # Database seed data
│   └── data.js
│
├── app.js                # Main Express app entry point
├── cloudConfig.js        # Cloudinary configuration
├── middleware.js         # Custom middleware (isLoggedIn, isOwner, etc.)
├── schema.js             # Joi validation schemas
├── package.json
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A [Cloudinary](https://cloudinary.com/) account (free tier works)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/archipriya03/Wanderlust-.git
cd Wanderlust-
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) below).

**4. Seed the database (optional)**
```bash
node init/index.js
```

**5. Start the development server**
```bash
node app.js
```

**6. Open in browser**
```
http://localhost:8080
```

---

## 🔑 Environment Variables

Create a `.env` file in the root with the following:

```env
# MongoDB
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust

# Session
SECRET=your_session_secret_key

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## ⚙️ How It Works

### Authentication Flow
1. User registers with username and password
2. Password is hashed and stored securely via Passport-Local-Mongoose
3. Sessions are persisted in MongoDB using `connect-mongo`
4. Protected routes check `req.isAuthenticated()` via the `isLoggedIn` middleware

### Listing Ownership
- Every listing stores a reference to the user who created it
- The `isOwner` middleware checks if `req.user._id` matches `listing.owner` before allowing edits or deletion

### Image Upload
- User selects a photo on the listing form
- Multer processes the file in memory
- `cloudinary.uploader` streams it to Cloudinary
- The returned URL and filename are saved to the listing document in MongoDB

### Map Display
- Listing location is stored as a text field (e.g., "Manali, India")
- On the listing detail page, Leaflet.js renders an OpenStreetMap tile layer
- A marker is placed at coordinates fetched via the Nominatim geocoding API

### Error Handling
- Custom `ExpressError` class for structured HTTP errors
- `wrapAsync` wrapper catches async errors and passes them to Express error middleware
- Joi validates all form inputs before they reach the database

---

## 🔮 Future Improvements

- [ ] 📅 Calendar-based booking with availability blocking
- [ ] 💬 Real-time host-guest messaging via Socket.io
- [ ] 💳 Payment integration with Razorpay
- [ ] 🔍 Advanced search with filters (price range, location radius, property type)
- [ ] 📊 Host dashboard with booking analytics
- [ ] 📧 Email notifications for booking confirmations

---

## 👩‍💻 Author

**Archi Priya**
MCA Student · Banasthali Vidyapith

[![GitHub](https://img.shields.io/badge/GitHub-archipriya03-black?logo=github)](https://github.com/archipriya03)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-archi--priya-blue?logo=linkedin)](https://linkedin.com/in/archi-priya-5b81122b7)
[![Email](https://img.shields.io/badge/Email-archipriya03@gmail.com-red?logo=gmail)](mailto:archipriya03@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
