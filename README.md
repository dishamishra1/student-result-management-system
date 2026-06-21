# SRMS Pro Max Fixed

Updated MERN Student Result Management System.

## Fixed in this version
- Logged-in users cannot access Login/Signup pages again.
- Course is now a proper MongoDB reference and seed creates courses.
- Teacher can upload marks/attendance only for assigned subjects.
- Admin can assign subjects to teachers.
- Cleaner professional UI theme.

## Demo credentials after seed
Admin: admin@srms.com / Admin@123
Teacher: teacher@srms.com / Teacher@123
Student: student@srms.com / Student@123

## Run
Backend:
```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

Frontend:
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173
