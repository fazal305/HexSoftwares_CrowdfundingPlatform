# 🚀 HexSoftwares Crowdfunding Platform

A full-stack crowdfunding web application built for the HexSoftwares internship.  
It allows users to create projects, contribute funding (simulated payments), and post updates.

---

## 🌐 Live Demo

🔗 Frontend (GitHub Pages):  
https://fazal305.github.io/HexSoftwares_CrowdfundingPlatform/

🔗 Backend (Render API):  
https://hexsoftwares-crowdfundingplatform.onrender.com

---

## 📌 Features

### 👤 Authentication
- User registration & login
- JWT-based authentication
- Protected routes

### 📁 Projects
- Create crowdfunding projects
- Set funding goals and deadlines
- Categorized projects (Tech, Art, Music, etc.)
- Featured projects section

### 💰 Contributions
- Simulated payment system (Card, EasyPaisa, JazzCash)
- 90% success rate simulation
- Automatic funding updates
- Backer count tracking

### 📢 Updates
- Project creators can post updates
- Public update viewing per project

### 📊 Dashboard
- User profile
- My projects overview
- My contributions history
- Spending summary

---

## 🧱 Tech Stack

### Frontend
- HTML5
- CSS3 (Cyberpunk Dark UI)
- Bootstrap 5
- jQuery
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- CORS

### Deployment
- Frontend: GitHub Pages
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure


HexSoftwares_CrowdfundingPlatform/
│
├── backend/
│ ├── models/
│ │ ├── User.js
│ │ ├── Project.js
│ │ ├── Contribution.js
│ │ └── Update.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── projects.js
│ │ ├── contributions.js
│ │ └── updates.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── server.js
│ ├── package.json
│ └── .env
│
├── frontend/
│ ├── index.html
│ ├── auth.html
│ ├── projects.html
│ ├── project-detail.html
│ ├── create-project.html
│ ├── dashboard.html
│ ├── app.js
│ └── styles.css


---

## ⚙️ Installation (Local Setup)

### 1. Clone Repository
```bash
git clone https://github.com/fazal305/HexSoftwares_CrowdfundingPlatform.git
2. Backend Setup
cd backend
npm install
npm run dev
3. Environment Variables (.env)
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
🔌 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
Projects
GET /api/projects
GET /api/projects/featured
GET /api/projects/:id
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
Contributions
POST /api/contributions
GET /api/contributions/my-contributions
GET /api/contributions/project/:id
Updates
POST /api/updates
GET /api/updates/project/:id
DELETE /api/updates/:id
💳 Payment System

⚠️ This project uses SIMULATED PAYMENTS ONLY

No real transactions occur
Success rate: 90% simulation
Methods: Card, EasyPaisa, JazzCash
🧠 Key Learning Outcomes
Full-stack MERN-style architecture
REST API development
JWT authentication
MongoDB schema design
Frontend API integration
Deployment (Render + GitHub Pages)
Project structuring for production
🚀 Future Improvements
Real payment gateway integration
Image upload for projects
Admin dashboard
Email notifications
Real-time updates (Socket.io)
👨‍💻 Author

Fazal Abbas
HexSoftwares Internship Project

📜 License

This project is for educational/internship purposes only
