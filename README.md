# BookNest - Online Book Borrowing Platform

## 📚 Project Overview
BookNest is a seamless and modern web application designed to digitize the traditional library experience. Users can explore a vast collection of books, filter by categories, and borrow titles digitally. The platform prioritizes security, performance, and a beautiful user experience with a sleek dark-themed, glassmorphic design.

**Live URL:** [BookNest on Vercel](https://your-deployment-url.vercel.app)

## ✨ Key Features
- **Modern UI/UX:** Stunning dark theme with glassmorphism, dynamic gradients, and smooth micro-animations.
- **Authentication:** Secure email/password and Google Social Login powered by BetterAuth.
- **Book Discovery:** Browse featured books, view new arrivals in a scrolling marquee, and search across the entire catalog.
- **Category Filtering:** Filter books by categories like Story, Tech, and Science using an interactive sidebar.
- **Digital Borrowing:** Logged-in users can borrow books digitally, instantly updating the available quantity.
- **Profile Management:** View borrow history and update profile information (Name & Photo) seamlessly.
- **Responsive Design:** Fully responsive layout that looks great on mobile, tablet, and desktop devices.
- **Data Persistence:** Robust data storage using MongoDB with Mongoose ORM.

## 🛠️ Tech Stack & NPM Packages
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4, DaisyUI v5
- **Authentication:** BetterAuth
- **Database:** MongoDB, Mongoose
- **Notifications:** React Hot Toast
- **Animations:** Animate.css, SwiperJS
- **Icons:** Heroicons (SVG)

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd book-borrowing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   *Note: Generate a `BETTER_AUTH_SECRET` using `openssl rand -base64 32` or via the BetterAuth docs.*

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Seed the database**
   The database will automatically seed with 12 initial books when you visit the homepage for the first time. If needed, you can manually trigger it by visiting `/api/seed`.

## 📦 Deployment
This project is optimized for deployment on Vercel. Simply connect your GitHub repository to Vercel and ensure all environment variables from `.env.local` are added to the Vercel project settings.
