# 📚 BookWorm - Your Personal Reading Tracker

![BookWorm Banner](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)

BookWorm is a modern, full-stack web application designed to help book lovers track their reading journey, discover new books, and manage their personal library with style and ease.

## ✨ Features

### 🔐 Authentication & User Management

- **Secure Authentication System** with email/password
- **Google OAuth Integration** via Firebase Authentication
- **Protected Routes** with role-based access control (User/Admin)
- **Profile Photo Upload** with image preview

### 📖 Reading Management

- Personal library to track books
- Reading progress monitoring
- Book recommendations based on preferences
- Community engagement features

### 🎨 Modern UI/UX

- **Glassmorphism Design** with backdrop blur effects
- **Dark Gradient Theme** with floating book animations
- **Smooth Animations** powered by GSAP
- **Responsive Design** optimized for all devices
- **Interactive Elements** with hover effects and transitions

### 🔔 User Experience

- **Real-time Toast Notifications** using react-hot-toast
- **Form Validation** with immediate feedback
- **Password Strength Indicators** for secure account creation
- **Show/Hide Password** toggle functionality

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 15.1.6 (App Router)
- **Language:** TypeScript 5.0
- **UI Library:** React 19.0
- **Styling:** Tailwind CSS 4.0
- **Animations:** GSAP 3.14.2
- **HTTP Client:** Axios 1.7.9
- **Notifications:** React Hot Toast 2.4.1

### Backend Integration

- **Authentication:** Firebase 11.10.0
- **API:** RESTful API communication

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Firebase project (for authentication)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/shamim0183/BookWorm-client.git
   cd BookWorm-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
bookworm-client/
├── app/
│   ├── login/           # Login page with authentication
│   ├── register/        # Registration page with form validation
│   ├── library/         # User's personal book library
│   ├── admin/           # Admin dashboard routes
│   └── layout.tsx       # Root layout component
├── lib/
│   ├── auth.js          # Firebase authentication logic
│   └── axios.js         # Axios configuration
├── public/              # Static assets
├── .env.local          # Environment variables (not committed)
└── package.json        # Project dependencies
```

## 🎨 Key Design Features

### Glassmorphism Cards

- Semi-transparent backgrounds with backdrop blur
- White borders with opacity for depth
- Smooth shadow effects

### Animated Backgrounds

- Floating book cover animations
- Gradient transitions
- Interactive hover states

### Color Palette

- **Primary Dark:** `#1F242E` - Deep charcoal
- **Accent Green:** `#2C5F4F` - Forest green
- **Highlight Gold:** `#C9A86A` - Warm gold
- **Light Cream:** `#FAF7F0` - Soft cream

## 🔒 Security Features

- Password strength validation (minimum 6 characters, uppercase, lowercase, numbers, special characters)
- Secure password storage with hashing
- Protected API routes
- Firebase authentication token verification
- HTTPS-only production deployment

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Shamim Hossain**

- GitHub: [@shamim0183](https://github.com/shamim0183)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [GSAP](https://greensock.com/gsap/)
- Open Library API for book covers

---

**Note:** This is the client-side application. Make sure to set up the corresponding backend server for full functionality.

For backend repository and setup instructions, please refer to the BookWorm Server documentation.
