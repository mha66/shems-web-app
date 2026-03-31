# Shems API (Smart Home Energy Management System)

Shems is a robust, secure, and automated ASP.NET Core Web API designed to manage smart home devices, monitor real-time power consumption, and trigger automated alerts based on custom power thresholds.

## 🛠 Technologies Used

This project is built using a modern, enterprise-level Microsoft technology stack:

* **.NET 10 & ASP.NET Core:** The foundational framework used to build the high-performance, cross-platform RESTful API.
* **Entity Framework Core (EF Core):** The Object-Relational Mapper (ORM) used to bridge the C# domain models with the SQL database using a Code-First approach.
* **Microsoft SQL Server:** The relational database used to persistently store users, devices, alert profiles, and background job queues.
* **ASP.NET Core Identity:** The built-in membership system used to manage user registration, secure password hashing, and Role-Based Access Control (RBAC).
* **JSON Web Tokens (JWT) & Token Rotation:** A dual-token architecture utilizing short-lived JWTs and long-lived Refresh Tokens to provide secure, sliding sessions.
* **Hangfire:** A comprehensive background job processor used to run automated, recurring tasks (monitoring device power draws) independent of HTTP requests.
* **Swashbuckle (Swagger):** An interactive documentation tool that auto-generates a testing UI for the API endpoints.

---

## 🔒 Security Architecture: HTTP-Only Cookies & Token Rotation

This application utilizes a highly secure, dual-cookie authentication flow rather than passing tokens in the standard HTTP body or storing them in the browser's vulnerable `localStorage`.

1.  **Short-Lived JWTs (15 Minutes):** The primary access token is intentionally short-lived to drastically minimize the attack window if a token is ever intercepted.
2.  **Refresh Token Rotation (7 Days):** A secondary, cryptographically secure refresh token is issued to maintain a "sliding session." When the 15-minute JWT expires, the `/refresh` endpoint uses the refresh token to generate a brand new JWT and a *brand new* refresh token. This completely prevents replay attacks and automatically revokes access if an old token is reused.
3.  **Mitigation of Cross-Site Scripting (XSS):** Both the `jwt` and `refreshToken` are sent to the client as `HttpOnly` cookies. This flag absolutely forbids any client-side JavaScript from reading the tokens, neutralizing XSS data-theft vectors.
4.  **Strict SameSite Policies:** By combining `HttpOnly` with `SameSite = Strict` and `Secure = true`, the API guarantees that the tokens will only be transmitted over encrypted HTTPS to the exact same domain, protecting against Cross-Site Request Forgery (CSRF).

---

## 🚀 How to Run the Project

Follow these steps to get the API running on your local machine.

### Prerequisites
* [.NET 10 SDK](https://dotnet.microsoft.com/download)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express or Developer edition)
* An IDE like Visual Studio 2022, VS Code, or JetBrains Rider.

### 1. Database Configuration
Open the `appsettings.json` file and ensure the `DefaultConnection` string points to your local SQL Server instance. Update the JWT settings with your own secure secret key.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ShemsDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "Jwt": {
    "Key": "YOUR_SUPER_SECRET_KEY_MUST_BE_LONG_ENOUGH",
    "Issuer": "ShemsApi",
    "Audience": "ShemsUsers"
  }
}
```

### 2. Apply Migrations
Open your terminal in the project directory and run the following command to generate the database schema, including the Identity, Refresh Token, and Application tables:

```bash
dotnet ef database update
```
*(Note: Hangfire will automatically generate its own SQL tables the first time the application runs).*

### 3. Run the Application
Start the server using the .NET CLI:
```bash
dotnet run
```
Once running, the API will output the listening ports (e.g., `https://localhost:5133`). 

### 4. Access the Dashboards
* **Swagger API UI:** Navigate to `https://localhost:<port>/swagger` to interact with the endpoints.
* **Hangfire Job UI:** Navigate to `https://localhost:<port>/hangfire` to view the background monitoring tasks.

---

## 📚 API Endpoint Documentation

Below are the core endpoints available in the system. Full schemas and parameter requirements can be viewed interactively via Swagger.

### Authentication (`/api/auth`)
* `POST /register` - Registers a new user with default "User" role privileges.
* `POST /login` - Authenticates a user and sets both the `jwt` and `refreshToken` HTTP-Only cookies.
* `POST /refresh` - Validates the current refresh token cookie, rotates the session credentials, and issues a fresh 15-minute JWT and 7-day refresh token.
* `POST /logout` - Revokes the refresh token in the database and commands the browser to delete the authentication cookies.

### Residents (`/api/resident`)
* `GET /{id}` - Retrieves a specific resident's profile. *(Requires Auth)*
* `PUT /{id}` - Updates a resident's profile. Validates `NameIdentifier` to ensure users can only edit their own profiles unless they are an `Admin`. *(Requires Auth)*

### Devices (`/api/device`)
* `GET /` - Retrieves all registered smart home devices. *(Requires Auth)*
* `POST /` - Registers a new smart home device. *(Requires Admin)*
* `PUT /{id}` - Updates device status or current power draw. *(Requires Admin)*

---

## ⚙️ Background Monitoring (Hangfire)
The API features an automated worker service (`IDeviceMonitoringService`) scheduled via Hangfire. Every minute, the system queries the database to compare the `CurrentPowerDraw` of all active devices against their assigned `AlertProfile` thresholds. If a spike is detected, an alert is logged to the system console and Hangfire dashboard.

---

## 📸 Demonstration

### 1. Secure Dual-Cookie Authentication (Postman)
Demonstrates a successful 200 OK response from the `/login` endpoint, showing both the short-lived JWT and long-lived Refresh Token cookies being securely set. 
<img width="1899" height="619" alt="Login Success" src="https://github.com/user-attachments/assets/97c29ede-15a7-4e46-81cc-540917013400" />

### 2. Session Refresh Flow
Demonstrates the `/refresh` endpoint successfully rotating the credentials after the initial 15-minute JWT expires.
<img width="1913" height="610" alt="Token Refresh" src="https://github.com/user-attachments/assets/410b3fa4-0e00-4c9a-8d1f-0fdd0e819268" />

### 3. Role-Based Access Control (403 Forbidden)
Demonstrates a standard user attempting to access an `[Authorize(Roles="Admin")]` endpoint and being correctly rejected.
<img width="1895" height="543" alt="RBAC Forbidden" src="https://github.com/user-attachments/assets/7defbcab-a349-48e7-9847-d8b6016ff222" />

### 4. Swagger
Demonstrates the working .NET 10 Swagger configuration.
<img width="2241" height="1380" alt="Swagger" src="https://github.com/user-attachments/assets/3856bbbc-e92b-4b36-8603-58aaa3f7a828" />
<img width="2180" height="1228" alt="Swagger" src="https://github.com/user-attachments/assets/bd1de68f-546d-4b63-9681-89279279e83d" />


### 5. Background Job Execution (Hangfire)
Demonstrates the Hangfire dashboard successfully executing the power-monitoring background job.
<img width="2539" height="1383" alt="Hangfire Jobs" src="https://github.com/user-attachments/assets/05d0efb2-b603-4987-9397-e8a9611e2a29" />
<img width="2544" height="1378" alt="Hangfire Job Alert" src="https://github.com/user-attachments/assets/e1c64970-a78d-4633-b3ef-5553d4837331" />
