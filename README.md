# 🔄 SkillSwap - Connect, Learn, Grow

> A modern full-stack platform for peer-to-peer skill exchange and learning

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

## 🌟 Features

- 👥 **User Authentication & Profiles**
  - Secure JWT-based authentication
  - Email & password authentication
  - Protected routes and API endpoints
  - User profile management

- 🎯 **Skill Exchange Platform**
  - Course listing and management
  - Skill categorization and search
  - Peer-to-peer learning sessions

- 💬 **Real-time Communication**
  - Live chat using Socket.IO
  - Real-time notifications
  - Interactive learning sessions

- 💳 **Payment Integration**
  - Secure payments via Stripe
  - Transaction history
  - Refund management

- 📱 **Modern UI/UX**
  - Responsive design
  - Interactive components
  - User-friendly navigation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/skillswap.git
cd skillswap
```

2. **Set up the frontend**
```bash
cd skillswap-react
npm install
```

3. **Set up the backend**
```bash
cd ../skillswap-backend
npm install
```

4. **Environment Configuration**
Create `.env` files in both frontend and backend directories with necessary configurations:

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

Backend (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

5. **Start the development servers**

Backend:
```bash
cd skillswap-backend
npm run dev
```

Frontend:
```bash
cd skillswap-react
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📁 Project Structure

```
skillswap/
├── skillswap-react/          # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context providers
│   │   ├── assets/          # Static assets
│   │   └── styles/          # CSS styles
│   └── public/              # Public assets
│
├── skillswap-backend/        # Backend application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   └── scripts/            # Database scripts
│
└── images/                  # Project images and assets
```

## 🛠️ Technology Stack

### Frontend
- React 18.2.0
- React Router DOM for routing
- Axios for API requests
- Socket.IO Client
- Formik & Yup for form validation
- React Icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Socket.IO for real-time communication
- Bcrypt for password hashing
- Nodemailer for email services

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📫 Contact

Project Link: [https://github.com/yourusername/skillswap](https://github.com/yourusername/skillswap)

---

<div align="center">
Made with ❤️ by the SkillSwap Team
</div> 
