# SmartTasks 🚀

SmartTasks is a modern, full-stack task management application designed to help you work smarter, not harder. It features a sleek dark-themed UI, intelligent categorization, real-time filtering, and a robust Express + MongoDB backend for secure data persistence.

## ✨ Features

- **Secure Authentication:** Full JWT-based user authentication with secure password hashing (bcrypt) and case-insensitive email handling.
- **Task Management:** Create, read, update, and delete tasks seamlessly.
- **Advanced Filtering & Sorting:** Instantly filter tasks by Status, Priority, or Category. Sort by Due Date, Priority level, or Creation Date.
- **Responsive UI:** A beautiful, responsive dark-mode interface built with React, Vite, and Tailwind CSS.
- **Quick Test Login:** Included auto-fill test account feature to quickly explore the app without signing up.
- **Database Persistence:** Real-time data storage powered by MongoDB and Mongoose.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ORM:** Mongoose
- **Security:** JSON Web Tokens (JWT) & bcryptjs
- **Middleware:** CORS

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally (or a MongoDB Atlas connection string)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdulnasar2006/Task-Manager.git
   cd Task-Manager
   ```

2. **Install dependencies:**
   This project uses a unified `package.json` to manage both the React frontend and Express backend.
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory (you can copy `.env.example` if available) and add the following variables:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/task-manager
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Run the Application:**
   The project uses `concurrently` to spin up both the Vite frontend and Express backend simultaneously.
   ```bash
   npm run dev
   ```
   - The **Frontend** will be available at: `http://localhost:3000` (or `3001` if port is in use).
   - The **Backend API** will run on: `http://localhost:4000`.

## 🧪 Testing the App

When you launch the app, you will be greeted by the Login Screen.
You can either create your own account or use the built-in **Test Account**:
- **Email:** `test@smarttasks.com`
- **Password:** `password123`
*(Note: This test account is automatically seeded into your MongoDB database when you first start the server).*

## 📂 Project Structure

```text
Task-Manager/
├── server/                 # Express Backend
│   ├── middleware/         # Custom Express middlewares (Auth)
│   ├── models/             # Mongoose schemas (User, Task)
│   ├── routes/             # API route handlers
│   └── index.js            # Entry point for backend server
├── src/                    # React Frontend
│   ├── components/         # Reusable React components (Navbar, TaskCard, etc.)
│   ├── context/            # React Context for global state (AppContext)
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main application layout
│   └── main.tsx            # Frontend entry point
├── index.html              # Vite HTML template
├── package.json            # Project dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/abdulnasar2006/Task-Manager/issues).



