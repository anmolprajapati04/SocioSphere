# SocioSphere – Smart Society Management System

SocioSphere is a **full-stack smart society management platform** designed to simplify and digitize the administration of residential societies, apartments, and gated communities.

The system enables administrators, residents, accountants, and security staff to efficiently manage daily society operations such as **maintenance payments, complaints, visitor management, amenity bookings, notices, and communication**.

SocioSphere uses a **modern full-stack architecture** consisting of a **Node.js + Express backend**, **React (Vite) frontend**, and **MySQL database**, allowing seamless interaction between users and system services.

---

# Table of Contents

- [System Architecture](#system-architecture)
- [Project Folder Structure](#project-folder-structure)
- [Tech Stack](#tech-stack)
- [Backend System](#backend-system)
- [Frontend System](#frontend-system)
- [Core Modules](#core-modules)
- [API Overview](#api-overview)
- [Real-Time Features](#real-time-features)
- [Email Notification System](#email-notification-system)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Features](#features)
- [Future Scope](#future-scope)
- [Conclusion](#conclusion)

---

# System Architecture

SocioSphere follows a **three-tier architecture**:

## 1. Frontend Layer (Client Side)

The frontend represents the **user interface of the system** where users interact with the application.

Responsibilities:

- Display dashboards and data
- Handle user inputs and forms
- Send API requests to the backend
- Manage routing and navigation
- Show alerts and notifications

Technologies used:

- React (Vite)
- React Router
- Axios
- CSS

---

## 2. Backend Layer (Server Side)

The backend handles the **core business logic and API services**.

Responsibilities:

- Authentication and authorization
- Role-based access control
- Database communication
- Real-time communication
- Email notifications
- API request processing

Technologies used:

- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- Socket.IO
- Nodemailer

---

## 3. Database Layer

The database stores all persistent application data.

Examples of stored data include:

- User accounts
- Societies
- Residents
- Maintenance payments
- Complaints
- Visitors
- Amenity bookings
- Notices
- Audit logs

Technology used:

- MySQL

---

# Project Folder Structure


SocioSphere
│
├── backend
│ ├── src
│ │ ├── config
│ │ ├── controllers
│ │ ├── middlewares
│ │ ├── models
│ │ ├── routes
│ │ ├── services
│ │ ├── utils
│ │ ├── app.js
│ │ └── server.js
│ │
│ ├── .env
│ ├── package.json
│ └── node_modules
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── services
│ │ ├── styles
│ │ │ ├── main.css
│ │ │ ├── dashboard.css
│ │ │ └── forms.css
│ │ ├── App.jsx
│ │ └── main.jsx
│ │
│ ├── package.json
│ └── vite.config.js
│
└── README.md


---

# Tech Stack

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- Socket.IO
- Nodemailer
- JWT Authentication

## Frontend

- React (Vite)
- React Router
- Axios

## Styling

- Plain CSS
  - `main.css`
  - `dashboard.css`
  - `forms.css`

---

# Backend System

The backend manages **authentication, API services, and database interactions**.

---

## Authentication System

SocioSphere uses **JWT (JSON Web Token) based authentication**.

Features include:

- User registration
- Secure login
- Token-based authentication
- Refresh tokens
- Password reset functionality

Authentication workflow:

1. User enters login credentials.
2. Backend validates credentials.
3. A JWT token is generated.
4. The token is returned to the frontend.
5. The frontend uses the token to access protected APIs.

---

## Role-Based Access Control (RBAC)

The system supports multiple roles with different permissions.

| Role | Description |
|-----|-------------|
| SUPER_ADMIN | Manages the entire platform |
| SOCIETY_ADMIN | Manages society operations |
| RESIDENT | Uses society services |
| SECURITY_GUARD | Manages visitor entry and exit |
| ACCOUNTANT | Handles financial records |

This ensures **secure and controlled access to system features**.

---

## Database Management

SocioSphere uses **Sequelize ORM** to communicate with MySQL.

Advantages:

- Structured database models
- Easy query management
- Data validation
- Table relationships

Example tables:

- Users
- Societies
- Flats
- Payments
- Complaints
- Visitors
- Amenities
- Bookings
- Notices

---

# Frontend System

The frontend is built using **React with Vite**, providing a fast and scalable user interface.

The UI follows a **component-based architecture**, which makes the application modular and easy to maintain.

Frontend responsibilities:

- Rendering dashboards
- Handling forms
- Managing navigation
- Communicating with backend APIs
- Displaying notifications and alerts

---

# Core Modules

## User Management

- User registration
- User login
- Role assignment
- Profile management

---

## Maintenance Management

- Maintenance plan creation
- Payment tracking
- Defaulter monitoring

---

## Complaint Management

Residents can:

- Submit complaints
- Track complaint status
- Receive updates

---

## Visitor Management

Security guards manage:

- Visitor entry
- Visitor exit
- Resident verification
- Visitor approval

---

## Amenity Booking

Residents can book facilities such as:

- Gym
- Swimming pool
- Community hall
- Sports courts

---

## Notice and Notification System

Admins can publish:

- Society announcements
- Emergency notices
- Event notifications

---

# API Overview

The backend exposes REST APIs that allow the frontend to interact with the system.

Example API categories:

| Module | Example Endpoint |
|------|----------------|
| Authentication | `/api/auth/login` |
| Users | `/api/users` |
| Complaints | `/api/complaints` |
| Visitors | `/api/visitors` |
| Maintenance | `/api/payments` |
| Amenities | `/api/amenities` |
| Notices | `/api/notices` |

All protected APIs require **JWT authentication tokens**.

---

# Real-Time Features

SocioSphere integrates **Socket.IO** for real-time communication.

Events include:

| Event | Description |
|------|-------------|
| visitor_request | Visitor arrival notification |
| visitor_approved | Visitor approval confirmation |
| complaint_update | Complaint status updates |
| emergency_alert | Emergency alerts |

This ensures instant communication between residents, administrators, and security staff.

---

# Email Notification System

SocioSphere uses **Nodemailer** to send automated emails.

Emails are sent for:

- Maintenance bill reminders
- Payment receipts
- Visitor approval requests
- Password reset links

This improves communication and ensures residents stay informed.

---

# Backend Setup

## 1 Install Dependencies

```bash
cd backend
npm install
2 Configure MySQL Database

Create a database named:

sociosphere_db

Ensure the configured user has access.

3 Configure Environment Variables

Create a .env file inside the backend directory.

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sociosphere_db
JWT_SECRET=supersecretkey
4 Run Backend Server
cd backend
npx nodemon src/server.js

Backend will run on:

http://localhost:5000
Frontend Setup
1 Install Dependencies
cd frontend
npm install
2 Run Development Server
npm run dev

The frontend will run on the URL printed by Vite, typically:

http://localhost:5173
Features

Secure user authentication

Role-based access control

Resident management

Maintenance payment system

Complaint management

Visitor management

Amenity booking

Society notices

Real-time alerts

Email notifications

Future Scope

SocioSphere can be expanded with advanced smart society features.

Mobile Application

Develop Android and iOS applications for easier resident access.

AI-Based Complaint Management

Machine learning models can:

Categorize complaints automatically

Prioritize urgent issues

Predict recurring maintenance problems

IoT Integration

Integrate smart devices such as:

Smart gates

Smart electricity meters

Smart parking sensors

Smart security cameras

Online Payment Gateway

Integrate payment systems such as:

Razorpay

Stripe

UPI payments

Residents will be able to pay maintenance fees online.

Smart Parking System

Future improvements may include:

Parking slot allocation

Visitor parking management

Real-time parking availability

Face Recognition Security

AI-based face recognition can improve visitor verification and security monitoring.

Community Social Platform

Residents could interact using:

Community discussion forums

Event announcements

Society polls

Multi-Society SaaS Platform

SocioSphere can evolve into a Software-as-a-Service (SaaS) platform, allowing multiple societies to register and manage their operations online.

Conclusion

SocioSphere is a modern smart society management system designed to streamline the operations of residential communities. By combining React, Node.js, MySQL, and real-time technologies, the platform provides a secure and efficient way for residents, administrators, and security staff to manage society activities.

With future enhancements such as AI integration, IoT devices, mobile applications, and digital payments, SocioSphere has the potential to become a complete smart community ecosystem.
