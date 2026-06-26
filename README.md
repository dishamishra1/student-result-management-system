Student Result Management System (SRMS)

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application for managing student academic records with secure role-based authentication and analytics dashboards.

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

---

Features

Admin
- Add and manage students
- Add and manage teachers
- Add and manage courses
- Add and manage subjects
- Assign subjects to teachers
- View institute statistics
- Manage announcements
- View leaderboard and analytics

### 👨‍🏫 Teacher
- Secure login
- View assigned subjects
- Upload internal & external marks
- Mark attendance
- View student performance

Student
- Secure login
- View marks and results
- Check CGPA and percentage
- View attendance
- Read announcements
- Analyze subject-wise performance

---

Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database
- MongoDB
- Mongoose

---

 Authentication

- JWT-based authentication
- Role-based authorization
- Protected routes
- Password hashing using bcrypt
- Separate dashboards for Admin, Teacher, and Student

---

##  Modules

- Authentication
- Student Management
- Teacher Management
- Subject Management
- Course Management
- Attendance Management
- Marks Management
- Result Analytics
- Dashboard Statistics
- Announcements

---

##  Folder Structure

```text
SRMS/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── utils/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

##Installation

### Clone the repository

```bash
git clone https://github.com/dishamishra1/student-result-management-system.git
```

### Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

##  Key Highlights

- Role-based access control
- JWT Authentication
- Attendance Management
- Student Result Analytics
- Course & Subject Management
- Teacher Subject Assignment
- Dashboard Statistics
- Modern MERN Architecture

---


## 🔮 Future Improvements

- Email notifications
- Forgot password functionality
- PDF/Excel report export
- Profile image upload
- Advanced filters and search
- Performance trend charts
- Responsive mobile optimization

---

##  Author

**Disha Mishra**

- MCA Student
- MERN Stack Developer
- DSA Enthusiast

GitHub: https://github.com/dishamishra1

---

## 📜 License

This project is intended for educational and portfolio purposes.
