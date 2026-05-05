# Shems (Smart Home Energy Management System)

Shems is a robust, full-stack application designed to manage smart home devices, monitor real-time power consumption, and trigger automated alerts based on custom power thresholds. It features a secure ASP.NET Core REST API backend and a responsive, role-aware React frontend.

## 🛠 Technologies Used

This project utilizes a modern, enterprise-level architecture separated into two distinct layers:

### Backend API (C# / .NET)
* **.NET 10 & ASP.NET Core:** The foundational framework used to build the high-performance RESTful API.
* **Entity Framework Core (EF Core):** The ORM used to bridge the C# domain models with the SQL database using a Code-First approach.
* **Microsoft SQL Server:** The relational database used to persistently store users, devices, alert profiles, and background job queues.
* **ASP.NET Core Identity:** The membership system managing user registration, secure password hashing, and Role-Based Access Control (RBAC).
* **Hangfire:** A background job processor used to run automated, recurring tasks (monitoring device power draws) independent of HTTP requests.
* **Swashbuckle (Swagger):** An interactive documentation tool for testing API endpoints.

### Frontend Web App (JavaScript / React)
* **React.js & Vite:** The core frontend library and lightning-fast build tool powering the Single Page Application (SPA).
* **React Router DOM:** Handles client-side routing, protected routes, and role-based navigation guards.
* **Axios & Interceptors:** Manages all HTTP requests and automatically handles silent token refreshes via interceptors.
* **React-Bootstrap:** Provides a responsive, mobile-friendly, and accessible component library for the user interface.

---

## 🔒 Security Architecture: Dual-Cookie Authentication

This application utilizes a highly secure, dual-cookie authentication flow rather than passing tokens in the standard HTTP body or storing them in the browser's vulnerable `localStorage`.

1. **Short-Lived JWTs (15 Minutes):** The primary access token is intentionally short-lived to drastically minimize the attack window.
2. **Refresh Token Rotation (7 Days):** A secondary, cryptographically secure refresh token maintains a "sliding session." When the 15-minute JWT expires, the frontend's **Axios Interceptor** silently calls the `/refresh` endpoint to generate fresh tokens without interrupting the user's experience. 
3. **Mitigation of XSS & CSRF:** Both tokens are sent to the client as `HttpOnly`, `SameSite=Strict`, and `Secure=true` cookies. This flag absolutely forbids any client-side JavaScript from reading the tokens, neutralizing XSS and CSRF data-theft vectors.
4. **Role-Based UI:** The React frontend utilizes `<ProtectedRoute>` and `<AdminRoute>` guards to hide administrative UI elements and block unauthorized URL access at the client level, backed by strict server-side validation.

---

## 🚀 How to Run the Project

Follow these steps to get the full-stack application running on your local machine.

### Prerequisites
* [.NET 10 SDK](https://dotnet.microsoft.com/download)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express or Developer edition)
* [Node.js](https://nodejs.org/) (v18 or higher)

### Part 1: Backend Setup
1. **Database Configuration:** Open `Shems.Api/appsettings.json` and ensure the `DefaultConnection` string points to your local SQL Server instance. Update the JWT settings with your own secure secret key.
2. **Apply Migrations:** Open your terminal in the `Shems.Api` directory and run:
   ```bash
   dotnet ef database update
   ```
   *(Note: Hangfire will automatically generate its own SQL tables the first time the application runs).*
   
4. **Run the API:**
   ```bash
   dotnet run
   
### Part 2: Frontend Setup
1. **Install Dependencies:** Open a new terminal in the `Shems.Frontend` directory and run:
   ```bash
   npm install
   ```
2. **Start the Development Server:**
   ```bash
   npm run dev

3. **Access the App:** The React application will be available at `http://localhost:5173`.

---

## 📚 API Endpoint Documentation

Below are the core endpoints available in the system. Full schemas and parameter requirements can be viewed interactively via Swagger at `https://localhost:<port>/swagger`.

### Authentication (`/api/auth`)
* `POST /register` - Registers a new user.
* `POST /login` - Authenticates a user and sets HTTP-Only cookies.
* `POST /refresh` - Validates and rotates the session credentials.
* `POST /logout` - Revokes the refresh token and clears cookies.

### Residents (`/api/resident`)
* `GET /{id}/dashboard` - Retrieves a specific resident's system overview.
* `PUT /{id}/profile` - Updates a resident's personal preferences.

### Devices & Zones (`/api/device` | `/api/zone`)
* `GET /` - Retrieves all registered components.
* `POST /` - Registers new components. *(Requires Admin)*.
* `PUT /{id}/status` - Updates hardware status or current power draw. *(Requires Admin)*.

---

## ⚙️ Background Monitoring (Hangfire)
The API features an automated worker service scheduled via Hangfire. Every minute, the system queries the database to compare the `CurrentPowerDraw` of all active devices against their assigned `AlertProfile` thresholds. If a spike is detected, an alert is logged to the system console and Hangfire dashboard. Access the dashboard at `https://localhost:<port>/hangfire`.

---

## 📸 Demonstration

### 1. Login & Registeration
Demonstrates the login and registeration pages.
<img width="2552" height="1399" alt="Login" src="https://github.com/user-attachments/assets/f101b192-e105-447f-8f7c-dc55e6afb3dd" /> </br>
<img width="2557" height="1391" alt="Registerarion" src="https://github.com/user-attachments/assets/70cfc132-faee-4662-a13f-9c2978d85ab6" />

### 2. User Experience & Dashboard
Demonstrates the personalized resident dashboard summarizing power draw, active devices, and budget data.
<img width="2559" height="1395" alt="Home" src="https://github.com/user-attachments/assets/453399a6-366f-40d7-b6aa-af7e8e81e9cc" />

### 3. Device & Zone Management
Demonstrates the data tables highlighting active devices, power consumption metrics, and administrative action buttons.
<img width="2559" height="1400" alt="Device List" src="https://github.com/user-attachments/assets/3abc9dd0-f9b5-4ec6-b832-26d0ef8d4f22" />

### 4. Secure Dual-Cookie Authentication
Demonstrates the network tab showing the short-lived JWT and long-lived Refresh Token cookies being securely set as `HttpOnly`.
<img width="1176" height="612" alt="Login Request" src="https://github.com/user-attachments/assets/e8573f65-ba56-491b-9e30-613264efd3b3" /> </br>
<img width="1315" height="195" alt="image" src="https://github.com/user-attachments/assets/394c5afa-153e-4d75-805b-3beefb389826" />

### 5. Role-Based Access Control (403 Forbidden)
Demonstrates a standard user attempting to access an `[Authorize(Roles="Admin")]` endpoint and being correctly rejected.
<img width="1895" height="543" alt="RBAC Forbidden" src="https://github.com/user-attachments/assets/7defbcab-a349-48e7-9847-d8b6016ff222" />

### 6. Swagger
Demonstrates the working .NET 10 Swagger configuration.
<img width="2241" height="1380" alt="Swagger" src="https://github.com/user-attachments/assets/3856bbbc-e92b-4b36-8603-58aaa3f7a828" />
<img width="2180" height="1228" alt="Swagger" src="https://github.com/user-attachments/assets/bd1de68f-546d-4b63-9681-89279279e83d" />

### 7. Background Job Execution (Hangfire)
Demonstrates the Hangfire dashboard successfully executing the power-monitoring background job.
<img width="2539" height="1383" alt="Hangfire Jobs" src="https://github.com/user-attachments/assets/05d0efb2-b603-4987-9397-e8a9611e2a29" />
<img width="2544" height="1378" alt="Hangfire Job Alert" src="https://github.com/user-attachments/assets/e1c64970-a78d-4633-b3ef-5553d4837331" />
