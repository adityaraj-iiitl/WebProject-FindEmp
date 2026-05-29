FindEmp – Job Portal Project

FindEmp is a full-stack web application built to connect job seekers with recruiters. It allows users to browse job listings, create accounts, and apply for jobs in a simple and efficient way.

Tech Stack
Frontend
React (Vite) – Used for building a fast and responsive UI
React Router – Handles navigation between pages without reloads
Axios – Used to communicate with the backend APIs
CSS3 – Custom styling for a clean and professional interface
Backend
Spring Boot – Core framework powering the backend
Spring Data JPA – Simplifies database operations
MySQL – Stores users, jobs, and applications
Maven – Dependency management and build tool
Getting Started (Team Setup)
1. Database Setup

Make sure MySQL is installed and running. Then create the database:

CREATE DATABASE findemp_db;
2. Backend Configuration
Navigate to the backend folder
Copy application.properties.example and rename it to application.properties
Add your MySQL credentials:
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

This file is not tracked by Git, so your credentials remain private.

3. Running the Project

Open two terminals:

Terminal 1 – Backend

cd backend
./mvnw spring-boot:run

Terminal 2 – Frontend

cd frontend
npm install
npm run dev
Project Structure
frontend/src/pages – Main pages like Home, Login, Register, AddJob
frontend/src/components – Reusable UI components (Navbar, JobCards, etc.)
backend/src/main/java/.../entity – Data models (User, Job, Application)
backend/src/main/java/.../controller – API endpoints
Security Note

Sensitive files like application.properties and node_modules are excluded using .gitignore. Always use .example files when sharing configurations with others.
