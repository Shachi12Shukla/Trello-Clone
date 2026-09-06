# 🗂️ Trello Clone

A full-stack Trello-inspired task management application built with the MERN stack. Users can sign up, create workspaces, invite members, create boards inside a workspace, and manage issues (cards) with status tracking.

**🚀 Live Demo:** [trello-clone-gamma-flax.vercel.app](https://trello-clone-gamma-flax.vercel.app)

## ✨ Features

- 🔐 User authentication (Signup / Signin) with JWT-based sessions and hashed (bcrypt) passwords
- 🔑 Strong password validation (uppercase, lowercase, number, and special character required)
- 🛡️ Protected routes — only authenticated users can access the app
- 🏢 Create and view workspaces
- 👥 Invite members to a workspace and remove them (admin-only actions)
- 🧑‍💼 Role-based access — actions and data are scoped to workspace admins/members
- 📋 Create boards within a workspace
- 🐛 Create issues (cards) inside a board
- 📌 Track issue status: **To Do**, **In-Progress**, **Completed**
- ✏️ Update issue title and status (only by the user who created the issue)
- 🔔 Toast notifications for user feedback

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React 19
- ⚡ Vite
- 🧭 React Router
- 🌐 Axios
- 🍞 React Hot Toast
- 🎨 Lucide React (icons)

**Backend**
- 🟢 Node.js
- 🚂 Express 5
- 🍃 MongoDB with Mongoose
- 🔏 JSON Web Token (JWT) for authentication
- 🔒 bcrypt for password hashing
- ✅ Zod for request validation
- 🌍 cors for cross origin requests
- 🗝️ dotenv for environment variable sharing

## 📁 Project Structure

```
Trello-Clone/
├── backend/
│   └── src/
│       ├── config/         # Database connection
│       ├── controllers/    # Route handler logic
│       ├── middlewares/    # Auth middleware
│       ├── models/         # Mongoose schemas (User, Workspace, Board, Issue)
│       ├── routes/         # Express routes
│       ├── validators/     # Zod validation schemas
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/      # Reusable UI components (modals, avatars, etc.)
        ├── context/         # Auth context
        ├── Hooks/           # Custom hooks (useWorkspaces, useBoards, etc.)
        ├── layouts/         # AppLayout, AuthLayout, IssueLayout
        |__utils             # Axios instance
        |
        ├── services/        # Axios API calls (Auth, Workspace, Board, Issue)
        ├── screens/         # Home, Auth, Dashboard, Workspace, Board, Members, Issue
        ├── App.jsx
        └── main.jsx
```

## 🚦 Getting Started

### ✅ Prerequisites
- Node.js
- MongoDB (local instance or a connection URI)

### ⚙️ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with the following variables:
```
PORT=7000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Run the backend server:
```bash
npm run dev
```

### 💻 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`. 🎉

## 🔮 Upcoming Features

- 🕘 User can directly navigate to the "recently viewed board".
- 📅 Calendar (e.g. Google Calendar) integration with workspaces.