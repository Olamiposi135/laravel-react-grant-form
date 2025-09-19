# Laravel React Grant Web Application

## Overview

This project is a full-stack web application for managing and tracking grant applications. It is built using a Laravel backend (PHP) and a React frontend (JavaScript). The application allows users to browse available grants, submit applications, track their application status, and for administrators/agents to manage applications.

---

## AI Development Prompt

Below is a comprehensive AI prompt that can be used to recreate this entire project from scratch:

### 🤖 **Complete AI Prompt for Laravel React Grant Web Application**

```
<userPrompt>
# Laravel React Grant Web Application

## Overview

This project is a full-stack web application for managing and tracking grant applications. It is built using a Laravel backend (PHP) and a React frontend (JavaScript). The application allows users to browse available grants, submit applications, track their application status, and for administrators/agents to manage applications.

---

## Features

-   **Homepage**: Landing page with general information.
-   **About Page**: Details about the organization or grant program.
-   **Learn More Page**: Additional information and FAQs.
-   **Grant List Page**: Browse available grants.
-   **Application Page**: Submit a new grant application with file uploads and validation.
-   **Success Page**: Confirmation after successful application submission.
-   **Track Application**: Users can check the status of their application using reference and SSN.
-   **Admin Agent Page**: Admins/agents can view and manage submitted applications.
-   **Not Found Page**: Custom 404 page for undefined routes.
-   **Navigation Bar & Footer**: Consistent layout across all pages.
-   **Back to Top Button**: Quick navigation for long pages.

---

## Project Structure

```

laravel-react-grant-web/
│
├── app/Http/Controllers/ # Laravel controllers (business logic)
├── app/Models/ # Laravel Eloquent models
├── frontend/ # React frontend source code
│ ├── src/
│ │ ├── components/ # Reusable React components (Navbar, Footer, etc.)
│ │ ├── pages/ # React page components (Homepage, ApplicationPage, etc.)
│ │ └── App.jsx # Main React app with routing
│ └── ...
├── routes/ # Laravel route definitions
├── public/ # Public assets and uploads
├── database/ # Migrations and seeders
└── ...

````

---

## Installed Modules & Packages

### Backend (Laravel/PHP)

-   **laravel/framework**: Main Laravel framework.
-   **fideloper/proxy**: Trusted proxy package for Laravel.
-   **fruitcake/laravel-cors**: CORS support for API.
-   **guzzlehttp/guzzle**: HTTP client for API requests.
-   **laravel/tinker**: REPL for Laravel.
-   **laravel/sanctum**: API authentication (if used).
-   **laravel/ui**: Frontend scaffolding (optional).
-   **spatie/laravel-permission**: Role and permission management (if used).
-   **vlucas/phpdotenv**: Environment variable loader.

> _Note: Check `composer.json` for the full list of backend dependencies._

### Frontend (React/JavaScript)

-   **react**: Core React library.
-   **react-dom**: React DOM bindings.
-   **react-router-dom**: Routing for React SPA.
-   **axios**: HTTP client for API requests.
-   **antd**: Ant Design UI library (used for FloatButton and possibly other UI elements).
-   **@ant-design/icons**: Icon set for Ant Design.
-   **classnames**: Utility for conditionally joining classNames (if used).
-   **tailwindcss**: Utility-first CSS framework (if used, check for config files).
-   **postcss, autoprefixer**: CSS tooling (if using Tailwind or custom styles).

> _Note: Check `frontend/package.json` for the full list of frontend dependencies._

---

## Setup Instructions

### Backend (Laravel)

1. **Install dependencies:**

    ```bash
    composer install
    ```

2. **Copy and configure environment:**

    ```bash
    cp .env.example .env
    # Edit .env with your DB and mail settings
    ```

3. **Generate application key:**

    ```bash
    php artisan key:generate
    ```

4. **Run migrations:**

    ```bash
    php artisan migrate
    ```

5. **(Optional) Seed database:**

    ```bash
    php artisan db:seed
    ```

6. **Start Laravel server:**
    ```bash
    php artisan serve
    ```

### Frontend (React)

1. **Navigate to frontend directory:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start React development server:**
    ```bash
    npm start
    ```

---

## API Endpoints

-   **POST /api/submit-application**: Submit a new application.
-   **POST /api/track-application**: Track application status by reference and SSN.
-   **GET /api/applications**: (Admin) List all applications.
-   **Other endpoints**: See Laravel routes for more.

---

## Customization & Extending

-   **Add new pages**: Create a new component in `frontend/src/pages/` and add a route in `App.jsx`.
-   **Add new backend logic**: Create a new controller in `app/Http/Controllers/` and define routes in `routes/web.php` or `routes/api.php`.
-   **Styling**: Uses Tailwind CSS and Ant Design for UI. Customize in `frontend/src/index.css` or via component props.

---

## Troubleshooting

-   **CORS Issues**: Ensure `fruitcake/laravel-cors` is configured and enabled.
-   **File Uploads**: Make sure `public/uploads` is writable and storage is linked (`php artisan storage:link`).
-   **API Errors**: Check Laravel logs in `storage/logs/laravel.log`.
-   **Frontend Errors**: Use browser dev tools and check the console for React errors.

---

## Authors & Credits

-   **Frontend**: React, Ant Design, Tailwind CSS
-   **Backend**: Laravel PHP
-   **Contributors**: [Your Name/Team]

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.
````

---

## 📋 **Step-by-Step Implementation Guide**

### **Phase 1: Backend Foundation (Days 1-3)**

1. **Day 1: Laravel Setup**

    - Create new Laravel project
    - Configure database connection
    - Install and configure CORS
    - Set up basic project structure

2. **Day 2: Database Design**

    - Create applications migration with all required fields
    - Create admin_users migration
    - Set up Eloquent models with relationships
    - Configure SSN encryption

3. **Day 3: Core Controllers**
    - Implement ApplicationController with form submission
    - Add file upload handling with validation
    - Create email notification system
    - Set up basic API routes

### **Phase 2: Frontend Foundation (Days 4-5)**

1. **Day 4: React Setup**

    - Create React app with routing
    - Install and configure Tailwind CSS
    - Set up component structure
    - Create basic layout components

2. **Day 5: Navigation & Layout**
    - Implement responsive Navbar
    - Create Footer component
    - Add BackToTopButton
    - Set up routing for all pages

### **Phase 3: Core Features (Days 6-10)**

1. **Day 6-7: Multi-Step Form**

    - Create 4-step application form
    - Implement form validation
    - Add progress indicator
    - Handle state management

2. **Day 8: File Upload System**

    - Implement file upload with preview
    - Add drag-drop functionality
    - Handle file validation
    - Create loading states

3. **Day 9: Form Submission**

    - Connect form to backend API
    - Add error handling
    - Implement success page
    - Add email integration

4. **Day 10: Tracking System**
    - Create tracking form
    - Implement timeline component
    - Add status visualization
    - Handle data security

### **Phase 4: Admin Features (Days 11-12)**

1. **Day 11: Admin Authentication**

    - Create admin login system
    - Implement session management
    - Add password reset functionality

2. **Day 12: Admin Dashboard**
    - Create applications management interface
    - Add search and filtering
    - Implement status updates
    - Add pagination

### **Phase 5: Polish & Testing (Days 13-15)**

1. **Day 13: UI/UX Enhancement**

    - Add loading animations
    - Implement shimmer effects
    - Enhance mobile responsiveness
    - Add accessibility features

2. **Day 14: Testing & Bug Fixes**

    - Test all functionality
    - Fix any discovered bugs
    - Optimize performance
    - Test across devices

3. **Day 15: Documentation & Deployment**
    - Complete documentation
    - Prepare for deployment
    - Final testing
    - Create deployment guide

## 🔧 **Key Implementation Notes**

-   **Email Processing**: Use 30-second timeout to handle Gmail SMTP delays
-   **File Security**: Validate file types and sizes both client and server-side
-   **SSN Handling**: Encrypt in database, mask in UI (show only last 4 digits)
-   **Mobile-First**: Design for mobile devices first, then scale up
-   **Error Handling**: Provide clear, actionable error messages
-   **Performance**: Use loading states and skeletons for better perceived performance
-   **Security**: Validate all inputs, sanitize data, use HTTPS in production

This prompt provides a complete roadmap for recreating the entire grant application system with modern 2025 standards and best practices.
