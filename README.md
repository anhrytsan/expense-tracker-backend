# Expense Tracker API Backend

This document provides instructions for setting up and running the backend server for the Expense Tracker application.

## 📜 About The Project

This is a RESTful API built with Node.js, Express, and MongoDB. It serves as the backbone for the Expense Tracker frontend, handling all business logic, data storage, and user authentication.

## ✨ Features

* **RESTful API:** A well-structured API for managing all application resources:
    * Users (Authentication)
    * Departments
    * Employees
    * Expense Types
    * Expenses
    * Monthly Limits
* **Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
* **Data Validation:** Server-side validation to ensure data integrity.
* **MongoDB Integration:** Uses Mongoose for elegant and straightforward object data modeling (ODM).
* **API Documentation:** Interactive API documentation powered by Swagger (OpenAPI).

## 🛠️ Tech Stack

* **Node.js:** A JavaScript runtime for building fast and scalable server-side applications.
* **Express.js:** A minimal and flexible Node.js web application framework.
* **MongoDB:** A NoSQL database for storing application data.
* **Mongoose:** An ODM library for MongoDB and Node.js.
* **JSON Web Token (JWT):** For implementing secure authentication.
* **Swagger (swagger-jsdoc & swagger-ui-express):** For generating interactive API documentation.

## 🚀 Getting Started

Follow these steps to get the backend server running locally.

### Prerequisites

* Node.js (v18 or higher is recommended)
* MongoDB (either a local instance or a cloud-based service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anhrytsan/expense-tracker-backend.git
    ```
2.  **Navigate to the backend directory:**
    ```bash
    cd expense-tracker-backend
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```

### Running the Server

1.  **For development (with auto-reloading using nodemon):**
    ```bash
    npm run dev
    ```
2.  **For production:**
    ```bash
    npm start
    ```
The server will start and connect to the MongoDB database.

## 📄 API Documentation

The API is documented using Swagger. Once the server is running, you can access the interactive documentation by navigating to the following URL in your browser:

http://localhost:3000/api-docs

This interface allows you to view all available endpoints, see their required parameters, and test them directly from your browser.