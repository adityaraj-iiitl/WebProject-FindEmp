# FindEmp - Job Portal Project

FindEmp is a full-stack web application designed to connect job seekers with recruiters. Users can browse available jobs, create accounts, and apply for positions instantly.

## 🚀 Tech Stack

### Frontend
- **React (Vite)**: For a fast and modern user interface.
- **React Router**: Handles page navigation without reloading.
- **Axios**: Used to talk to our Spring Boot backend.
- **CSS3**: Custom premium styling with a clean, professional look.

### Backend
- **Spring Boot 4.0.5**: The backbone of our application.
- **Spring Data JPA**: Handles all our database operations easily.
- **MySQL**: To store jobs, user accounts, and applications securely.
- **Maven**: For managing project dependencies.

---

## 🛠️ Getting Started (For Team Members)

### 1. Database Setup
1. Make sure you have **MySQL** installed and running.
2. Open your MySQL terminal or Workbench and create the database:
   ```sql
   CREATE DATABASE findemp_db;
   ```

### 2. Backend Configuration
1. Go to the `backend` folder.
2. Find `application.properties.example`.
3. **Copy and Rename** it to `application.properties`.
4. Open the new `application.properties` and enter your MySQL username and password:
   ```properties
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   ```
   *(Note: This file is ignored by Git, so your password will never be shared!)*

### 3. Running the Project
You need two terminals open:

**Terminal 1: Backend**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2: Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

- `frontend/src/pages`: Contains Home, Login, Register, and AddJob pages.
- `frontend/src/components`: Reusable UI elements like Navbar and JobCards.
- `backend/src/main/java/.../entity`: Data models (Job, User, Application).
- `backend/src/main/java/.../controller`: API endpoints that the frontend calls.

---

## 🔐 Security Notice
We use a `.gitignore` file to ensure that local configuration files like `application.properties` and `node_modules` are not pushed to GitHub. Always use the `.example` files when sharing configuration templates with the team.
